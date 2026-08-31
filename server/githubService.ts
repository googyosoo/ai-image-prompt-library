import { UseCaseCategory, PromptItem, PromptVariable, PromptStyle } from '../src/types';

export interface GitHubManifestCategory {
  slug: string;
  title: string;
  file: string;
  count: number;
}

export interface GitHubManifest {
  updatedAt: string;
  totalPrompts: number;
  categories: GitHubManifestCategory[];
}

export interface RawGitHubPrompt {
  id: number | string;
  title?: string;
  description?: string;
  content: string;
  sourceMedia?: string[];
  needReferenceImages?: boolean;
}

export interface IndexedGitHubPrompt {
  item: RawGitHubPrompt;
  categorySlug: string;
  transformed: PromptItem;
  // Normalized tokens for fast search
  searchTokens: string[];
}

const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/YouMind-OpenLab/ai-image-prompts-skill/main/references';

// Memory cache & In-memory search index
let manifestCache: { data: GitHubManifest; fetchedAt: number } | null = null;
const categoryFilesCache: Map<string, { data: RawGitHubPrompt[]; fetchedAt: number }> = new Map();
const categoryIndexedCache: Map<string, IndexedGitHubPrompt[]> = new Map();
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour cache

// Map category slugs to Korean readable titles and categories
export const CATEGORY_MAP: Record<string, { name: string; korean: string; category: UseCaseCategory }> = {
  'profile-avatar': { name: 'Profile / Avatar', korean: '프로필 & 아바타', category: 'Profile / Avatar' },
  'social-media-post': { name: 'Social Media Post', korean: '소셜 미디어 포스트', category: 'Social Media Post' },
  'infographic-edu-visual': { name: 'Infographic / Edu Visual', korean: '인포그래픽 & 교육 비주얼', category: 'Infographic / Edu' },
  'youtube-thumbnail': { name: 'YouTube Thumbnail', korean: '유튜브 썸네일', category: 'YouTube Thumbnail' },
  'comic-storyboard': { name: 'Comic / Storyboard', korean: '만화 & 스토리보드', category: 'Comic / Storyboard' },
  'product-marketing': { name: 'Product Marketing', korean: '제품 마케팅 & 광고', category: 'Product Marketing' },
  'ecommerce-main-image': { name: 'E-commerce Main Image', korean: '이커머스 대표 이미지', category: 'E-commerce Main' },
  'game-asset': { name: 'Game Asset', korean: '게임 에셋 & 캐릭터', category: 'Game Asset' },
  'poster-flyer': { name: 'Poster / Flyer', korean: '포스터 & 전단지', category: 'Poster / Flyer' },
  'app-web-design': { name: 'App / Web Design', korean: '앱 & 웹 UI 디자인', category: 'App / Web UI' },
  'others': { name: 'Uncategorized', korean: '기타 크리에이티브', category: 'Wallpaper & Sci-Fi' },
};

// Popular searchable keywords for instant suggestion/pills
export const POPULAR_KEYWORDS = [
  { label: 'Cyberpunk', query: 'cyberpunk' },
  { label: 'Photorealistic Portrait', query: 'portrait 8k photo' },
  { label: '3D Pixar Cute', query: '3d pixar cute' },
  { label: 'Anime Makoto Shinkai', query: 'anime makoto shinkai' },
  { label: 'Product Studio Lighting', query: 'product studio lighting' },
  { label: 'Retro 80s Synthwave', query: 'retro 80s synthwave' },
  { label: 'Isometric Room', query: 'isometric' },
  { label: 'Watercolor Ink', query: 'watercolor' },
  { label: 'Cinematic Movie Shot', query: 'cinematic 35mm film' },
  { label: 'Minimalist Poster', query: 'minimalist bauhaus' },
];

/**
 * Fetch GitHub manifest with timeout
 */
export async function getGitHubManifest(): Promise<GitHubManifest> {
  const now = Date.now();
  if (manifestCache && now - manifestCache.fetchedAt < CACHE_TTL_MS) {
    return manifestCache.data;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(`${GITHUB_RAW_BASE}/manifest.json`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Failed to fetch manifest: ${res.statusText}`);
    }
    const data: GitHubManifest = await res.json();
    manifestCache = { data, fetchedAt: now };
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    console.warn('Error fetching manifest from GitHub, using fallback:', error);
    const fallbackManifest: GitHubManifest = {
      updatedAt: new Date().toISOString(),
      totalPrompts: 15385,
      categories: [
        { slug: 'profile-avatar', title: 'Profile / Avatar', file: 'profile-avatar.json', count: 2024 },
        { slug: 'social-media-post', title: 'Social Media Post', file: 'social-media-post.json', count: 9612 },
        { slug: 'product-marketing', title: 'Product Marketing', file: 'product-marketing.json', count: 5607 },
        { slug: 'poster-flyer', title: 'Poster / Flyer', file: 'poster-flyer.json', count: 963 },
        { slug: 'game-asset', title: 'Game Asset', file: 'game-asset.json', count: 705 },
        { slug: 'comic-storyboard', title: 'Comic / Storyboard', file: 'comic-storyboard.json', count: 663 },
        { slug: 'infographic-edu-visual', title: 'Infographic / Edu Visual', file: 'infographic-edu-visual.json', count: 596 },
        { slug: 'ecommerce-main-image', title: 'E-commerce Main Image', file: 'ecommerce-main-image.json', count: 569 },
        { slug: 'app-web-design', title: 'App / Web Design', file: 'app-web-design.json', count: 235 },
        { slug: 'youtube-thumbnail', title: 'YouTube Thumbnail', file: 'youtube-thumbnail.json', count: 218 },
        { slug: 'others', title: 'Uncategorized', file: 'others.json', count: 1094 },
      ],
    };
    manifestCache = { data: fallbackManifest, fetchedAt: now };
    return fallbackManifest;
  }
}

/**
 * Tokenize and normalize text for search indexing
 */
function tokenizeText(text: string): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s\u3131-\uD79D]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 2);
}

/**
 * Fetch prompts from a category JSON file in GitHub
 */
export async function getGitHubCategoryPrompts(categorySlug: string): Promise<RawGitHubPrompt[]> {
  const now = Date.now();
  const cached = categoryFilesCache.get(categorySlug);
  if (cached && now - cached.fetchedAt < CACHE_TTL_MS) {
    return cached.data;
  }

  const manifest = await getGitHubManifest();
  const targetCategory = manifest.categories.find((c) => c.slug === categorySlug);
  const fileName = targetCategory ? targetCategory.file : `${categorySlug}.json`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(`${GITHUB_RAW_BASE}/${fileName}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Failed to fetch category ${fileName}: ${res.statusText}`);
    }
    const data: RawGitHubPrompt[] = await res.json();
    categoryFilesCache.set(categorySlug, { data, fetchedAt: now });
    
    // Build index for this category
    const indexedItems: IndexedGitHubPrompt[] = data.map((item) => {
      const transformed = transformGitHubPrompt(item, categorySlug);
      const combinedText = `${item.title || ''} ${item.description || ''} ${item.content || ''} ${transformed.koreanTitle} ${transformed.koreanDescription} ${transformed.style} ${transformed.tags.join(' ')}`;
      return {
        item,
        categorySlug,
        transformed,
        searchTokens: tokenizeText(combinedText),
      };
    });
    categoryIndexedCache.set(categorySlug, indexedItems);

    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    console.warn(`Could not fetch category ${fileName} from GitHub raw:`, error);
    if (cached) return cached.data;
    return [];
  }
}

/**
 * Get indexed prompt records for category (or build on the fly)
 */
export async function getIndexedCategoryPrompts(categorySlug: string): Promise<IndexedGitHubPrompt[]> {
  if (categoryIndexedCache.has(categorySlug)) {
    return categoryIndexedCache.get(categorySlug)!;
  }
  const rawList = await getGitHubCategoryPrompts(categorySlug);
  if (categoryIndexedCache.has(categorySlug)) {
    return categoryIndexedCache.get(categorySlug)!;
  }

  const indexedItems: IndexedGitHubPrompt[] = rawList.map((item) => {
    const transformed = transformGitHubPrompt(item, categorySlug);
    const combinedText = `${item.title || ''} ${item.description || ''} ${item.content || ''} ${transformed.koreanTitle} ${transformed.koreanDescription} ${transformed.style} ${transformed.tags.join(' ')}`;
    return {
      item,
      categorySlug,
      transformed,
      searchTokens: tokenizeText(combinedText),
    };
  });
  categoryIndexedCache.set(categorySlug, indexedItems);
  return indexedItems;
}

/**
 * Extract argument variables from `{argument name="..." default="..."}` syntax
 */
export function extractVariables(content: string): PromptVariable[] {
  const variables: PromptVariable[] = [];
  const regex = /\{argument\s+name=["']([^"']+)["']\s+default=["']([^"']*)["']\}/g;
  let match;
  const seenKeys = new Set<string>();

  while ((match = regex.exec(content)) !== null) {
    const name = match[1];
    const defaultValue = match[2];
    const key = name.toLowerCase().replace(/[^a-z0-9]/g, '_');

    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      variables.push({
        key,
        label: name.charAt(0).toUpperCase() + name.slice(1),
        placeholder: defaultValue || name,
        defaultValue: defaultValue || '',
      });
    }
  }

  return variables;
}

/**
 * Parse markdown section headers such as ### Lighting, ### Camera, ### Negative prompts
 */
export function parseSections(content: string) {
  let lighting = '';
  let camera = '';
  let negativePrompt = '';
  let cleanPrompt = content;

  // Extract negative prompt if section exists
  const negativeMatch = content.match(/### Negative prompts?\s*([\s\S]*?)(?=###|$)/i);
  if (negativeMatch && negativeMatch[1]) {
    negativePrompt = negativeMatch[1].trim().replace(/^\*\s*/gm, '').replace(/\n+/g, ', ');
  }

  // Extract lighting if section exists
  const lightingMatch = content.match(/### Lighting\s*([\s\S]*?)(?=###|$)/i);
  if (lightingMatch && lightingMatch[1]) {
    lighting = lightingMatch[1].trim().replace(/^\*\s*/gm, '').replace(/\n+/g, ' | ');
  }

  // Extract camera if section exists
  const cameraMatch = content.match(/### Camera\s*([\s\S]*?)(?=###|$)/i);
  if (cameraMatch && cameraMatch[1]) {
    camera = cameraMatch[1].trim().replace(/^\*\s*/gm, '').replace(/\n+/g, ' | ');
  }

  // Detect style
  let style: PromptStyle = 'Cinematic / Film';
  const lower = content.toLowerCase();
  if (lower.includes('anime') || lower.includes('manga') || lower.includes('makoto shinkai') || lower.includes('ghibli')) {
    style = 'Anime / Manga';
  } else if (lower.includes('3d') || lower.includes('pixar') || lower.includes('blender') || lower.includes('octane render') || lower.includes('claymation')) {
    style = '3D Render / Pixar';
  } else if (lower.includes('cyberpunk') || lower.includes('sci-fi') || lower.includes('neon')) {
    style = 'Cyberpunk / Sci-Fi';
  } else if (lower.includes('pixel') || lower.includes('16-bit') || lower.includes('8-bit')) {
    style = 'Pixel Art';
  } else if (lower.includes('watercolor') || lower.includes('ink wash') || lower.includes('sumi-e')) {
    style = 'Watercolor / Ink';
  } else if (lower.includes('oil painting') || lower.includes('canvas') || lower.includes('impasto')) {
    style = 'Oil Painting';
  } else if (lower.includes('isometric') || lower.includes('orthographic')) {
    style = 'Isometric';
  } else if (lower.includes('minimalist') || lower.includes('minimalism') || lower.includes('bauhaus') || lower.includes('swiss style')) {
    style = 'Minimalism';
  } else if (lower.includes('photo') || lower.includes('35mm') || lower.includes('hasselblad') || lower.includes('dslr') || lower.includes('kodak')) {
    style = 'Photography';
  }

  // Detect Aspect Ratio
  let aspectRatio: '1:1' | '16:9' | '9:16' | '4:3' | '3:4' | '4:5' = '1:1';
  if (content.includes('16:9') || content.includes('--ar 16:9')) aspectRatio = '16:9';
  else if (content.includes('9:16') || content.includes('--ar 9:16')) aspectRatio = '9:16';
  else if (content.includes('4:3') || content.includes('--ar 4:3')) aspectRatio = '4:3';
  else if (content.includes('3:4') || content.includes('--ar 3:4')) aspectRatio = '3:4';
  else if (content.includes('4:5') || content.includes('--ar 4:5')) aspectRatio = '4:5';

  return {
    lighting,
    camera,
    negativePrompt,
    style,
    aspectRatio,
    cleanPrompt,
  };
}

/**
 * Transform a raw GitHub prompt item into a full PromptItem
 */
export function transformGitHubPrompt(raw: RawGitHubPrompt, categorySlug: string): PromptItem {
  const catInfo = CATEGORY_MAP[categorySlug] || {
    name: 'Uncategorized',
    korean: '기타 프롬프트',
    category: 'Wallpaper & Sci-Fi',
  };

  const parsed = parseSections(raw.content);
  const variables = extractVariables(raw.content);

  // Generate a clean synthesized prompt by replacing {argument name="..." default="..."} with default value
  const synthesizedPrompt = raw.content.replace(/\{argument\s+name=["'][^"']+["']\s+default=["']([^"']*)["']\}/g, '$1');

  // Sample image URL fallback logic
  let sampleImageUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80';
  if (raw.sourceMedia && raw.sourceMedia.length > 0 && raw.sourceMedia[0].startsWith('http')) {
    sampleImageUrl = raw.sourceMedia[0];
  } else {
    // Style-based fallback imagery
    if (parsed.style === 'Anime / Manga') {
      sampleImageUrl = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=900&q=80';
    } else if (parsed.style === 'Cyberpunk / Sci-Fi') {
      sampleImageUrl = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=900&q=80';
    } else if (parsed.style === '3D Render / Pixar') {
      sampleImageUrl = 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=900&q=80';
    } else if (parsed.style === 'Photography') {
      sampleImageUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80';
    }
  }

  const title = raw.title || `GitHub Prompt #${raw.id}`;
  const koreanTitle = raw.title ? `${raw.title}` : `${catInfo.korean} #${raw.id}`;
  const koreanDesc = raw.description || `GitHub 공식 리포지토리에서 제공하는 ${catInfo.korean} 전문 프롬프트 템플릿입니다.`;

  return {
    id: `gh-${categorySlug}-${raw.id}`,
    title,
    koreanTitle,
    category: catInfo.category,
    style: parsed.style,
    fullPrompt: synthesizedPrompt,
    koreanDescription: koreanDesc,
    sampleImageUrl,
    targetModels: ['Nano Banana (Gemini)', 'Midjourney v6', 'Flux.1', 'DALL-E 3', 'SDXL'],
    recommendedAspectRatio: parsed.aspectRatio,
    tags: [catInfo.name, parsed.style, 'GitHub Sync', 'YouMind'],
    variables,
    negativePrompt: parsed.negativePrompt,
    lighting: parsed.lighting || undefined,
    camera: parsed.camera || undefined,
    copiedCount: Math.floor(Math.random() * 400) + 120,
    featured: Boolean(raw.sourceMedia && raw.sourceMedia.length > 0),
  };
}

/**
 * Advanced Search & Rank Engine across indexed categories
 */
export async function searchIndexedPrompts(options: {
  categorySlug: string;
  query: string;
  style: string;
  page: number;
  limit: number;
  sortBy: 'popular' | 'trending' | 'newest';
}) {
  const { categorySlug, query, style, page, limit, sortBy } = options;

  let pool: IndexedGitHubPrompt[] = [];

  if (categorySlug === 'all') {
    const mainCategories = [
      'profile-avatar',
      'product-marketing',
      'poster-flyer',
      'game-asset',
      'comic-storyboard',
      'infographic-edu-visual',
      'youtube-thumbnail',
      'ecommerce-main-image',
      'app-web-design',
      'others',
    ];
    const results = await Promise.all(
      mainCategories.map((cat) => getIndexedCategoryPrompts(cat))
    );
    for (const group of results) {
      pool.push(...group);
    }
  } else {
    pool = await getIndexedCategoryPrompts(categorySlug);
  }

  // If query exists, calculate relevance score (TF/IDF style multi-token fuzzy matching)
  let matchedList: { indexed: IndexedGitHubPrompt; score: number }[] = [];

  if (query.trim()) {
    const qTokens = tokenizeText(query);
    const qLower = query.toLowerCase().trim();

    for (const item of pool) {
      let score = 0;
      const titleLower = (item.item.title || '').toLowerCase();
      const descLower = (item.item.description || '').toLowerCase();
      const contentLower = (item.item.content || '').toLowerCase();
      const koreanTitleLower = (item.transformed.koreanTitle || '').toLowerCase();

      // Exact phrase match bonus
      if (titleLower.includes(qLower) || koreanTitleLower.includes(qLower)) score += 50;
      if (descLower.includes(qLower)) score += 25;
      if (contentLower.includes(qLower)) score += 15;

      // Token overlap score
      for (const token of qTokens) {
        if (titleLower.includes(token)) score += 15;
        if (koreanTitleLower.includes(token)) score += 15;
        if (descLower.includes(token)) score += 8;
        if (item.transformed.style.toLowerCase().includes(token)) score += 10;
        if (item.searchTokens.includes(token)) score += 5;
      }

      if (score > 0) {
        matchedList.push({ indexed: item, score });
      }
    }

    // Sort by relevance score primarily
    matchedList.sort((a, b) => b.score - a.score);
  } else {
    matchedList = pool.map((indexed) => ({ indexed, score: 1 }));
  }

  // Filter by style
  let filtered = matchedList;
  if (style !== 'All') {
    filtered = filtered.filter((entry) => entry.indexed.transformed.style === style);
  }

  // Sort by requested sorting criteria if no specific search score was prioritized
  if (!query.trim()) {
    if (sortBy === 'popular') {
      filtered.sort((a, b) => b.indexed.transformed.copiedCount - a.indexed.transformed.copiedCount);
    } else if (sortBy === 'trending') {
      filtered.sort((a, b) => (b.indexed.transformed.featured ? 1 : 0) - (a.indexed.transformed.featured ? 1 : 0));
    }
  }

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit).map((e) => e.indexed.transformed);

  return {
    items: paginated,
    total,
    totalPages,
    page,
    limit,
    hasMore: page < totalPages,
  };
}
