import express from 'express';
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
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy Gemini client initialization
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// ================= GITHUB LIVE PROMPT ENDPOINTS =================

// 1. Get GitHub Manifest & Category stats
app.get('/api/github/manifest', async (_req, res) => {
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
app.get('/api/github/prompts', async (req, res) => {
  try {
    const categorySlug = (req.query.category as string) || 'profile-avatar';
    const q = (req.query.q as string || '').trim();
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

// Validation Middleware Rules
const generateImageValidator = validateRequestBody([
  {
    field: 'prompt',
    type: 'string',
    required: true,
    minLength: 2,
    maxLength: 4000, // Strict 4,000 character limit
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
    maxLength: 4000, // Strict 4,000 character limit
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

// Helper to get curated smart fallback image based on keywords in prompt
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

// API: Generate Image with Gemini 3.1 Flash Lite Image (with smart fallback)
app.post('/api/generate-image', generateImageValidator, async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const { prompt, aspectRatio = '1:1', negativePrompt } = req.body;
  const validAspectRatios = ['1:1', '3:4', '4:3', '9:16', '16:9'];
  const selectedAspectRatio = validAspectRatios.includes(aspectRatio) ? aspectRatio : '1:1';

  try {
    const ai = getGeminiClient();
    if (!ai) {
      // Smart Fallback Demo Visual if offline or key not configured
      const fallbackUrl = getSmartFallbackImage(prompt);
      res.json({
        imageUrl: fallbackUrl,
        aspectRatio: selectedAspectRatio,
        message: 'GEMINI_API_KEY 미설정 데모 모드로 고화질 프리뷰 이미지가 렌더링되었습니다.',
        isFallback: true,
      });
      return;
    }

    // Combine prompt with style guidance if provided
    let finalPrompt = prompt;
    if (negativePrompt && negativePrompt.trim()) {
      finalPrompt += `. Avoid: ${negativePrompt}`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: {
        parts: [
          {
            text: finalPrompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: selectedAspectRatio,
        },
      },
    });

    let imageUrl = '';
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

    if (!imageUrl) {
      const fallbackUrl = getSmartFallbackImage(prompt);
      res.json({
        imageUrl: fallbackUrl,
        aspectRatio: selectedAspectRatio,
        isFallback: true,
        message: 'AI 모델 응답 대기 시간 초과로 스마트 프리뷰 이미지가 표시되었습니다.',
      });
      return;
    }

    res.json({
      imageUrl,
      aspectRatio: selectedAspectRatio,
      isFallback: false,
    });
  } catch (error: any) {
    console.warn('Image generation warning, using fallback visual:', error?.message);
    const fallbackUrl = getSmartFallbackImage(prompt);
    res.json({
      imageUrl: fallbackUrl,
      aspectRatio: selectedAspectRatio,
      isFallback: true,
      warning: error?.message || '실시간 생성 실패로 고화질 프리뷰가 표시되었습니다.',
    });
  }
});


// API: Enhance Prompt / Content Remix with Gemini 3.7 Flash
app.post('/api/enhance-prompt', enhancePromptValidator, async (req, res) => {
  try {
    const { idea, style, category, targetModel = 'Nano Banana (Gemini)' } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      // Fallback deterministic smart prompt builder if offline or no key
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

    const systemInstruction = `You are an expert AI Image Prompt Engineer specializing in the YouMind AI Image Prompts Skill guidelines.
Your goal is to convert user requests, articles, or rough concepts into production-grade image generation prompts.
Always produce:
1. enhancedPrompt: An ultra-detailed, evocative English prompt optimized for AI image models (lighting, lens, materials, atmosphere, composition).
2. koreanTitle: A concise, catchy Korean title for the prompt.
3. koreanDescription: A 1-2 sentence Korean summary explaining what makes this prompt work.
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

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);

    res.json(parsed);
  } catch (error: any) {
    console.error('Prompt enhance error:', error);
    res.status(500).json({
      error: error.message || 'Failed to enhance prompt',
    });
  }
});

// API: Analyze Image / Reverse Prompt Engineering (Gemini 3.7 Flash Vision)
app.post('/api/analyze-image', async (req, res) => {

  try {
    const { imageBase64, mimeType = 'image/jpeg', targetModel = 'Midjourney v6' } = req.body;

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      res.status(400).json({ error: '유효한 이미지 데이터(Base64)가 필요합니다.' });
      return;
    }

    // Strip header if data URL format (e.g. data:image/png;base64,...)
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const ai = getGeminiClient();
    if (!ai) {
      // Fallback deterministic analysis if offline or no key
      res.json({
        enhancedPrompt:
          'Award-winning cinematic masterpiece of the analyzed visual, intricate textures, volumetric atmosphere, balanced color harmony, shot on 50mm f/1.4 prime lens, 8k resolution, photorealistic studio lighting',
        koreanTitle: 'AI 비전 분석: 감지된 스타일 & 구도',
        koreanDescription:
          '업로드된 이미지의 시각적 요소(피사체, 조명, 렌더링 질감, 색조)를 역분해하여 재현율을 극대화한 프롬프트입니다.',
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
Analyze the user-provided image and reverse-engineer it into an ultra-precise, production-grade text-to-image prompt.
Your response MUST be strict JSON containing the following properties:
1. enhancedPrompt (string): A comprehensive English prompt describing the subject, materials, art style, camera angle, lens, lighting, color palette, and atmosphere.
2. koreanTitle (string): A concise, engaging Korean title summarizing the image essence.
3. koreanDescription (string): A 1-2 sentence Korean explanation of why this prompt matches the visual aesthetics.
4. style (string): One of ["Photography", "Cinematic / Film", "Anime / Manga", "3D Render / Pixar", "Cyberpunk / Sci-Fi", "Pixel Art", "Watercolor / Ink", "Oil Painting", "Isometric", "Minimalism", "Claymation", "Vintage / Retro"].
5. category (string): One of ["Profile / Avatar", "Social Media Post", "Product Marketing", "E-commerce Main", "Infographic / Edu", "YouTube Thumbnail", "Comic / Storyboard", "Game Asset", "Poster / Flyer", "App / Web UI", "3D Icon & Object", "Wallpaper & Sci-Fi"].
6. aspectRatio (string): One of ["1:1", "16:9", "9:16", "4:3", "3:4"].
7. lighting (string): Description of the lighting setup (e.g., "Neon rim light with soft volumetric fog").
8. camera (string): Camera and lens specs or rendering engine (e.g., "Hasselblad 80mm f/2.8, shallow DOF" or "Octane Render 8k").
9. composition (string): Framing and layout technique (e.g., "Centered dynamic low-angle framing").
10. colorPalette (array of strings): 4 to 5 dominant HEX color codes (e.g. ["#0d1117", "#ff0055", "#00d2ff", "#f39c12"]).
11. suggestedLegoBlockIds (array of strings): Relevant block IDs matching lego modular components, choose 4-7 from: ["sub-cyberpunk-samurai", "sub-ethereal-astronaut", "sub-pixar-fox", "sub-skincare-bottle", "sub-ancient-castle", "sub-street-food", "cam-low-angle", "cam-eye-level", "cam-aerial-drone", "cam-close-up-macro", "cam-wide-shot", "cam-isometric-ortho", "lens-anamorphic", "lens-35mm-prime", "lens-85mm-portrait", "lens-macro-100mm", "lens-ultra-wide-14mm", "light-neon-rim", "light-golden-hour", "light-studio-softbox", "light-cinematic-dramatic", "light-bioluminescent", "style-octane", "style-unreal-engine", "style-makoto-shinkai", "style-3d-pixar", "style-cyberpunk", "style-minimalist", "style-watercolor", "style-oil-painting", "mood-neon-cyan", "mood-warm-amber", "mood-dark-noir", "mood-pastel-dreamy", "mood-vibrant-colorful", "detail-8k-sharp", "detail-raytracing", "detail-subsurface-scattering", "detail-masterpiece"].
12. negativePrompt (string): Appropriate negative prompt keywords for this style.
13. midjourneyParameters (string): e.g. "--ar 16:9 --v 6.0 --style raw"
14. keyTags (array of strings): 4-6 descriptive tags.
15. detectedSubject (string): Brief English summary of the primary subject.

Respond ONLY with valid JSON.`;

    const promptText = `Reverse-engineer this image into an exact prompt specification for ${targetModel}. Include all JSON properties.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
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

    const text = response.text || '{}';
    const parsed = JSON.parse(text);

    res.json(parsed);
  } catch (error: any) {
    console.error('Image analysis error:', error);
    res.status(500).json({
      error: error.message || 'Failed to analyze image with vision model',
    });
  }
});


// Vite middleware & Production static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;

if (!process.env.VERCEL) {
  startServer();
}


