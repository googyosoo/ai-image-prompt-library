import { GoogleGenAI } from '@google/genai';

function getGeminiClient(): GoogleGenAI | null {
  const rawKey =
    process.env.GEMINI_API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    '';

  const apiKey = rawKey.trim().replace(/^["']|["']$/g, '');

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.length < 10) {
    return null;
  }

  try {
    return new GoogleGenAI({
      apiKey,
    });
  } catch (e) {
    return null;
  }
}

function getSmartFallbackImage(prompt: string): string {
  const p = (prompt || '').toLowerCase();
  if (p.includes('cat') || p.includes('고양이') || p.includes('kitten') || p.includes('fox') || p.includes('여우') || p.includes('animal') || p.includes('동물')) {
    return 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80';
  }
  if (p.includes('cyberpunk') || p.includes('neon') || p.includes('samurai') || p.includes('city') || p.includes('사이버펑크') || p.includes('네온')) {
    return 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80';
  }
  if (p.includes('product') || p.includes('skincare') || p.includes('bottle') || p.includes('화장품') || p.includes('제품') || p.includes('앰플')) {
    return 'https://images.unsplash.com/photo-1608248597359-0f0f35338573?w=800&auto=format&fit=crop&q=80';
  }
  if (p.includes('space') || p.includes('astronaut') || p.includes('nebula') || p.includes('우주') || p.includes('성운')) {
    return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';
  }
  if (p.includes('portrait') || p.includes('girl') || p.includes('woman') || p.includes('man') || p.includes('인물') || p.includes('소녀')) {
    return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80';
  }
  return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';
}

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const body = req.body || {};
  const { prompt = '', aspectRatio = '1:1', negativePrompt = '' } = body;
  const validAspectRatios = ['1:1', '3:4', '4:3', '9:16', '16:9'];
  const selectedAspectRatio = validAspectRatios.includes(aspectRatio) ? aspectRatio : '1:1';

  try {
    const ai = getGeminiClient();
    if (!ai) {
      const fallbackUrl = getSmartFallbackImage(prompt);
      return res.status(200).json({
        imageUrl: fallbackUrl,
        aspectRatio: selectedAspectRatio,
        message: 'GEMINI_API_KEY 미설정 데모 모드로 고화질 프리뷰 이미지가 렌더링되었습니다.',
        isFallback: true,
      });
    }

    let finalPrompt = prompt;
    if (negativePrompt && negativePrompt.trim()) {
      finalPrompt += `. Avoid: ${negativePrompt}`;
    }

    let imageUrl = '';

    // Strategy 1: Google Imagen 3 (imagen-3.0-generate-002)
    try {
      const imgRes = await (ai.models as any).generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: finalPrompt,
        config: {
          numberOfImages: 1,
          aspectRatio: selectedAspectRatio,
          outputMimeType: 'image/jpeg',
        },
      });

      if (imgRes && imgRes.generatedImages && imgRes.generatedImages.length > 0) {
        const imageBytes = imgRes.generatedImages[0].image?.imageBytes;
        if (imageBytes) {
          imageUrl = `data:image/jpeg;base64,${imageBytes}`;
        }
      }
    } catch (e1: any) {
      console.warn('Imagen 3.0 attempt notice:', e1?.message);
    }

    // Strategy 2: Google Gemini multimodal image generation
    if (!imageUrl) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: {
            parts: [{ text: finalPrompt }],
          },
        });

        const candidates = response.candidates;
        if (candidates && candidates.length > 0) {
          const parts = candidates[0].content?.parts || [];
          for (const part of parts) {
            if (part.inlineData && part.inlineData.data) {
              const mimeType = part.inlineData.mimeType || 'image/png';
              imageUrl = `data:${mimeType};base64,${part.inlineData.data}`;
              break;
            }
          }
        }
      } catch (e2: any) {
        console.warn('Gemini image generation attempt notice:', e2?.message);
      }
    }

    if (!imageUrl) {
      const fallbackUrl = getSmartFallbackImage(prompt);
      return res.status(200).json({
        imageUrl: fallbackUrl,
        aspectRatio: selectedAspectRatio,
        isFallback: true,
        message: '고화질 스마트 프리뷰 이미지가 렌더링되었습니다.',
      });
    }

    return res.status(200).json({
      imageUrl,
      aspectRatio: selectedAspectRatio,
      isFallback: false,
    });
  } catch (error: any) {
    console.warn('Image generation error, fallback preview applied:', error?.message);
    const fallbackUrl = getSmartFallbackImage(prompt);
    return res.status(200).json({
      imageUrl: fallbackUrl,
      aspectRatio: selectedAspectRatio,
      isFallback: true,
      warning: error?.message || '실시간 생성 실패로 고화질 프리뷰가 표시되었습니다.',
    });
  }
}
