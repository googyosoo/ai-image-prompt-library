export type UseCaseCategory =
  | 'All'
  | '교과 삽화'
  | '포스터'
  | '학습지 그림'
  | '캐릭터'
  | 'Profile / Avatar'
  | 'Social Media Post'
  | 'Product Marketing'
  | 'E-commerce Main'
  | 'Infographic / Edu'
  | 'YouTube Thumbnail'
  | 'Comic / Storyboard'
  | 'Game Asset'
  | 'Poster / Flyer'
  | 'App / Web UI'
  | '3D Icon & Object'
  | 'Wallpaper & Sci-Fi';

export type PromptStyle =
  | 'All'
  | 'Photography'
  | 'Cinematic / Film'
  | 'Anime / Manga'
  | '3D Render / Pixar'
  | 'Cyberpunk / Sci-Fi'
  | 'Pixel Art'
  | 'Watercolor / Ink'
  | 'Oil Painting'
  | 'Isometric'
  | 'Minimalism'
  | 'Claymation'
  | 'Vintage / Retro';

export type AIModelType =
  | 'All'
  | 'Nano Banana (Gemini)'
  | 'Midjourney v6'
  | 'DALL-E 3'
  | 'Flux.1'
  | 'Stable Diffusion XL';

export interface PromptVariable {
  key: string;
  label: string;
  placeholder: string;
  defaultValue: string;
  options?: string[];
}

export interface PromptItem {
  id: string;
  title: string;
  koreanTitle: string;
  category: UseCaseCategory;
  style: PromptStyle;
  fullPrompt: string;
  koreanDescription: string;
  sampleImageUrl: string;
  targetModels: string[];
  recommendedAspectRatio: '1:1' | '16:9' | '9:16' | '4:3' | '3:4' | '4:5';
  tags: string[];
  variables: PromptVariable[];
  negativePrompt?: string;
  lighting?: string;
  camera?: string;
  copiedCount: number;
  featured?: boolean;
}

export interface CompareSlot {
  id: 'A' | 'B';
  title: string;
  prompt: string;
  negativePrompt: string;
  style: PromptStyle;
  aspectRatio: '1:1' | '16:9' | '9:16' | '4:3';
  sampleImageUrl?: string;
  generatedImageUrl?: string;
  isGenerating?: boolean;
  error?: string;
}

export type ActiveTab = 'library' | 'wizard' | 'builder' | 'compare' | 'remix' | 'vision';

export interface ImageAnalysisResult {
  enhancedPrompt: string;
  koreanTitle: string;
  koreanDescription: string;
  style: PromptStyle;
  category: UseCaseCategory;
  aspectRatio: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
  lighting: string;
  camera: string;
  composition: string;
  colorPalette: string[];
  suggestedLegoBlockIds: string[];
  negativePrompt: string;
  midjourneyParameters?: string;
  keyTags: string[];
  detectedSubject?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  title: string;
  description?: string;
}

export type DataSourceMode = 'curated' | 'github';

export interface GitHubCategoryMeta {
  slug: string;
  title: string;
  file: string;
  count: number;
  koreanTitle?: string;
}

export interface GitHubManifestData {
  updatedAt: string;
  totalPrompts: number;
  categories: GitHubCategoryMeta[];
  popularKeywords?: { label: string; query: string }[];
}

export interface AuthUser {
  email: string;
  name: string;
  picture?: string;
  isAuthenticated: boolean;
}

export const ALLOWED_EMAIL_HASHES: readonly string[] = [
  '287fe2e072f918f9c0e0c64b07aa1841b900991ca921e50b504d9d1bad0246e5',
  '3a1b3dfcc87ce6b2734a25f1d76ebf25076eafab342c57001248897a066c8fd3',
  '0c79759c94241ea7b2d6794a920e5a5b69bcf0c3360073fa768b5c39954cbc79',
] as const;



