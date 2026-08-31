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

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { idea = '', style = '', category = '', targetModel = 'Nano Banana (Gemini)' } = req.body || {};

  try {
    const ai = getGeminiClient();
    if (!ai) {
      const enhancedEnglish = `Masterpiece detailed visual of ${idea}, professional studio lighting, rich volumetric depth, 8k resolution, award-winning composition, shot on 35mm prime lens, clean photorealistic rendering`;
      const koreanDesc = `입력하신 아이디어 "${idea}"를 기반으로 ${style || '시네마틱'} 스타일과 전문 조명/카메라 설정을 결합한 고품질 프롬프트입니다.`;
      return res.status(200).json({
        enhancedPrompt: enhancedEnglish,
        koreanTitle: `AI 리믹스: ${idea.slice(0, 20)}`,
        koreanDescription: koreanDesc,
        suggestedAspectRatio: '16:9',
        lighting: 'Volumetric cinematic lighting with soft edge rim light',
        camera: '35mm f/1.4 prime lens',
        negativePrompt: 'blurry, low quality, oversaturated, distorted anatomy, watermark',
      });
    }

    const systemInstruction = `You are an expert AI Image Prompt Engineer.
Convert the user concept into a production-grade image generation prompt.
Always produce strict JSON with:
1. enhancedPrompt: An ultra-detailed, evocative English prompt.
2. koreanTitle: A concise, catchy Korean title.
3. koreanDescription: A 1-2 sentence Korean summary.
4. suggestedAspectRatio: One of '1:1', '16:9', '9:16', '4:3', '3:4'.
5. lighting: Suggested lighting setup.
6. camera: Suggested camera/lens or render engine setting.
7. negativePrompt: Essential negative prompt terms.

Respond strictly in valid JSON format.`;

    const promptText = `Generate a master-level image prompt for:
- User Idea: ${idea}
- Desired Style: ${style || 'Realistic / Cinematic'}
- Category: ${category || 'General'}
- Target Model: ${targetModel}`;

    const candidateModels = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-3.7-flash'];
    let text = '';

    for (const m of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: m,
          contents: promptText,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
          },
        });
        if (response && response.text) {
          text = response.text;
          break;
        }
      } catch (err) {
        console.warn(`Model ${m} attempt note:`, err);
      }
    }

    if (!text) {
      throw new Error('No text returned from Gemini models');
    }

    const parsed = JSON.parse(text);
    return res.status(200).json(parsed);
  } catch (error: any) {
    console.error('Prompt enhance fallback:', error);
    return res.status(200).json({
      enhancedPrompt: `Masterpiece visual of ${idea || 'concept'}, highly detailed, professional studio lighting, 8k resolution, ${style || 'cinematic'} aesthetic`,
      koreanTitle: `AI 리믹스: ${(idea || '프롬프트').slice(0, 20)}`,
      koreanDescription: `아이디어를 바탕으로 ${style || '시네마틱'} 스타일과 전문 조명을 결합한 고품질 프롬프트입니다.`,
      suggestedAspectRatio: '16:9',
      lighting: 'Volumetric studio lighting with soft edge rim light',
      camera: '35mm prime lens f/1.4',
      negativePrompt: 'blurry, low quality, oversaturated, distorted anatomy',
    });
  }
}
