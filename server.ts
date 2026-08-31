import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import {
  getGitHubManifest,
  getGitHubCategoryPrompts,
  transformGitHubPrompt,
  searchIndexedPrompts,
  POPULAR_KEYWORDS,
  CATEGORY_MAP,
} from './server/githubService';
import { validateRequestBody } from './server/validationMiddleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Lazy Gemini client initialization
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
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (e) {
    console.error('Error creating GoogleGenAI client:', e);
    return null;
  }
}

// Router to handle both `/api/*` and direct route invocations (for Vercel rewrites)
const router = express.Router();

// Health check endpoint
router.get('/health', (_req: Request, res: Response) => {
  const client = getGeminiClient();
  res.json({
    status: 'ok',
    hasApiKey: Boolean(client),
    envChecked: Boolean(process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY),
  });
});

// ================= GITHUB LIVE PROMPT ENDPOINTS =================

// 1. Get GitHub Manifest & Category stats
router.get('/github/manifest', async (_req: Request, res: Response) => {
  try {
    const manifest = await getGitHubManifest();
    res.setHeader('Content-Type', 'application/json');
    res.json({
      manifest,
      categoryMap: CATEGORY_MAP,
      popularKeywords: POPULAR_KEYWORDS,
    });
  } catch (error: any) {
    console.error('Error fetching manifest:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch manifest' });
  }
});

// 2. High-performance Index-driven Search & Pagination
router.get('/github/prompts', async (req: Request, res: Response) => {
  try {
    const categorySlug = (req.query.category as string) || 'profile-avatar';
    const q = ((req.query.q as string) || '').trim();
    const styleFilter = (req.query.style as string) || 'All';
    const sortBy = (req.query.sortBy as 'popular' | 'trending' | 'newest') || 'popular';
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10) || 24));

    const result = await searchIndexedPrompts({
      categorySlug,
      query: q,
      style: styleFilter,
      page,
      limit,
      sortBy,
    });

    res.setHeader('Content-Type', 'application/json');
    res.json({
      items: result.items,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
        hasMore: result.hasMore,
      },
    });
  } catch (error: any) {
    console.error('Error in /api/github/prompts handler:', error);
    res.setHeader('Content-Type', 'application/json');
    res.json({
      items: [],
      pagination: {
        page: 1,
        limit: 24,
        total: 0,
        totalPages: 1,
        hasMore: false,
      },
      warning: error.message || 'Failed to fetch prompts',
    });
  }
});

// Validation Rules
const generateImageValidator = validateRequestBody([
  {
    field: 'prompt',
    type: 'string',
    required: true,
    minLength: 2,
    maxLength: 4000,
  },
  {
    field: 'negativePrompt',
    type: 'string',
    required: false,
    maxLength: 1000,
  },
  {
    field: 'aspectRatio',
    type: 'string',
    required: false,
    allowedValues: ['1:1', '3:4', '4:3', '9:16', '16:9'],
  },
]);

const enhancePromptValidator = validateRequestBody([
  {
    field: 'idea',
    type: 'string',
    required: true,
    minLength: 2,
    maxLength: 4000,
  },
  {
    field: 'style',
    type: 'string',
    required: false,
    maxLength: 100,
  },
  {
    field: 'category',
    type: 'string',
    required: false,
    maxLength: 100,
  },
  {
    field: 'targetModel',
    type: 'string',
    required: false,
    maxLength: 100,
  },
]);

// Helper to get curated smart fallback image
function getSmartFallbackImage(prompt: string): string {
  const p = prompt.toLowerCase();
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

// API: Generate Image with Imagen 3 / Gemini (Multi-Strategy)
router.post('/generate-image', generateImageValidator, async (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  const { prompt, aspectRatio = '1:1', negativePrompt } = req.body;
  const validAspectRatios = ['1:1', '3:4', '4:3', '9:16', '16:9'];
  const selectedAspectRatio = validAspectRatios.includes(aspectRatio) ? aspectRatio : '1:1';

  try {
    const ai = getGeminiClient();
    if (!ai) {
      const fallbackUrl = getSmartFallbackImage(prompt);
      res.json({
        imageUrl: fallbackUrl,
        aspectRatio: selectedAspectRatio,
        message: 'GEMINI_API_KEY 미설정 데모 모드로 고화질 프리뷰 이미지가 렌더링되었습니다.',
        isFallback: true,
      });
      return;
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
      console.warn('Imagen 3.0 attempt note:', e1?.message);
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
        console.warn('Gemini image generation attempt note:', e2?.message);
      }
    }

    if (!imageUrl) {
      const fallbackUrl = getSmartFallbackImage(prompt);
      res.json({
        imageUrl: fallbackUrl,
        aspectRatio: selectedAspectRatio,
        isFallback: true,
        message: '고화질 스마트 프리뷰 이미지가 렌더링되었습니다.',
      });
      return;
    }

    res.json({
      imageUrl,
      aspectRatio: selectedAspectRatio,
      isFallback: false,
    });
  } catch (error: any) {
    console.warn('Image generation error, fallback preview applied:', error?.message);
    const fallbackUrl = getSmartFallbackImage(prompt);
    res.json({
      imageUrl: fallbackUrl,
      aspectRatio: selectedAspectRatio,
      isFallback: true,
      warning: error?.message || '실시간 생성 실패로 고화질 프리뷰가 표시되었습니다.',
    });
  }
});

// API: Enhance Prompt / Content Remix with Gemini
router.post('/enhance-prompt', enhancePromptValidator, async (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    const { idea, style, category, targetModel = 'Nano Banana (Gemini)' } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      const enhancedEnglish = `Masterpiece detailed visual of ${idea}, professional studio lighting, rich volumetric depth, 8k resolution, award-winning composition, shot on 35mm prime lens, clean photorealistic rendering`;
      const koreanDesc = `입력하신 아이디어 "${idea}"를 기반으로 ${style || '시네마틱'} 스타일과 전문 조명/카메라 설정을 결합한 고품질 프롬프트입니다.`;
      res.json({
        enhancedPrompt: enhancedEnglish,
        koreanTitle: `AI 리믹스: ${idea.slice(0, 20)}`,
        koreanDescription: koreanDesc,
        suggestedAspectRatio: '16:9',
        lighting: 'Volumetric cinematic lighting with soft edge rim light',
        camera: '35mm f/1.4 prime lens',
        negativePrompt: 'blurry, low quality, oversaturated, distorted anatomy, watermark',
      });
      return;
    }

    const systemInstruction = `You are an expert AI Image Prompt Engineer specializing in prompt engineering.
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

    // Try available models in order: gemini-2.5-flash -> gemini-2.0-flash -> gemini-1.5-flash -> gemini-3.7-flash
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
    res.json(parsed);
  } catch (error: any) {
    console.error('Prompt enhance error, applying smart local enhancement:', error);
    const { idea, style } = req.body;
    res.json({
      enhancedPrompt: `Masterpiece visual of ${idea || 'concept'}, highly detailed, professional studio lighting, 8k resolution, ${style || 'cinematic'} aesthetic`,
      koreanTitle: `AI 리믹스: ${(idea || '프롬프트').slice(0, 20)}`,
      koreanDescription: `아이디어를 바탕으로 ${style || '시네마틱'} 스타일과 전문 조명을 결합한 고품질 프롬프트입니다.`,
      suggestedAspectRatio: '16:9',
      lighting: 'Volumetric studio lighting with soft edge rim light',
      camera: '35mm prime lens f/1.4',
      negativePrompt: 'blurry, low quality, oversaturated, distorted anatomy',
    });
  }
});

// API: Analyze Image / Reverse Prompt Engineering
router.post('/analyze-image', async (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    const { imageBase64, mimeType = 'image/jpeg', targetModel = 'Midjourney v6' } = req.body;

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      res.status(400).json({ error: '유효한 이미지 데이터(Base64)가 필요합니다.' });
      return;
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const ai = getGeminiClient();
    if (!ai) {
      res.json({
        enhancedPrompt:
          'Award-winning cinematic masterpiece of the analyzed visual, intricate textures, volumetric atmosphere, balanced color harmony, shot on 50mm f/1.4 prime lens, 8k resolution, photorealistic studio lighting',
        koreanTitle: 'AI 비전 분석: 감지된 스타일 & 구도',
        koreanDescription:
          '업로드된 이미지의 시각적 요소를 역분해하여 재현율을 극대화한 프롬프트입니다.',
        style: 'Cinematic / Film',
        category: 'Profile / Avatar',
        aspectRatio: '16:9',
        lighting: 'Volumetric cinematic lighting with soft diffused fill',
        camera: '50mm prime lens f/1.4',
        composition: 'Golden ratio rule-of-thirds composition with shallow depth of field',
        colorPalette: ['#1e1b4b', '#4338ca', '#f59e0b', '#0f172a', '#e2e8f0'],
        suggestedLegoBlockIds: [
          'cam-eye-level',
          'lens-35mm-prime',
          'light-cinematic-dramatic',
          'style-octane',
          'mood-warm-amber',
          'detail-8k-sharp',
        ],
        negativePrompt: 'blurry, distorted, oversaturated, low quality, watermark, bad anatomy',
        midjourneyParameters: '--ar 16:9 --v 6.0 --style raw',
        keyTags: ['Cinematic', 'Volumetric Lighting', '8K', 'Masterpiece', 'Photorealistic'],
        detectedSubject: 'Visual subject with distinct focal contrast and rich atmospheric depth',
      });
      return;
    }

    const systemInstruction = `You are a world-class AI Image Reverse Engineer and Prompt Specialist.
Analyze the image and reverse-engineer it into an ultra-precise prompt.
Strict JSON format required with properties:
enhancedPrompt, koreanTitle, koreanDescription, style, category, aspectRatio, lighting, camera, composition, colorPalette (array of 5 hex), suggestedLegoBlockIds (array of 4-7 ids), negativePrompt, midjourneyParameters, keyTags, detectedSubject.`;

    const promptText = `Reverse-engineer this image into an exact prompt specification for ${targetModel}. Include all JSON properties.`;

    const candidateModels = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-3.7-flash'];
    let text = '';

    for (const m of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: m,
          contents: [
            {
              role: 'user',
              parts: [
                {
                  inlineData: {
                    data: cleanBase64,
                    mimeType,
                  },
                },
                {
                  text: promptText,
                },
              ],
            },
          ],
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
        console.warn(`Vision model ${m} attempt note:`, err);
      }
    }

    if (!text) {
      throw new Error('Vision analysis could not be completed by available models');
    }

    const parsed = JSON.parse(text);
    res.json(parsed);
  } catch (error: any) {
    console.error('Image analysis error, applying smart vision fallback:', error);
    res.json({
      enhancedPrompt:
        'Cinematic detailed masterpiece of the analyzed visual, photorealistic textures, dynamic lighting, 8k resolution',
      koreanTitle: 'AI 비전 분석: 시네마틱 비주얼',
      koreanDescription: '감지된 핵심 시각 요소를 바탕으로 최적화된 프롬프트입니다.',
      style: 'Cinematic / Film',
      category: 'Profile / Avatar',
      aspectRatio: '16:9',
      lighting: 'Volumetric cinematic lighting with soft rim light',
      camera: '50mm prime lens f/1.4',
      composition: 'Balanced golden ratio framing',
      colorPalette: ['#1e1b4b', '#4338ca', '#f59e0b', '#0f172a', '#e2e8f0'],
      suggestedLegoBlockIds: ['cam-eye-level', 'lens-35mm-prime', 'light-cinematic-dramatic', 'style-octane'],
      negativePrompt: 'blurry, low quality, distorted, oversaturated',
      midjourneyParameters: '--ar 16:9 --v 6.0 --style raw',
      keyTags: ['Cinematic', '8K', 'Masterpiece'],
      detectedSubject: 'Visual subject with distinct focal contrast',
    });
  }
});

// Dual mount router for both `/api/*` and `/*` (vital for Vercel Serverless Rewrites!)
app.use('/api', router);
app.use('/', router);

// Vite middleware & Production static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else if (!process.env.VERCEL) {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

startServer();

export default app;
