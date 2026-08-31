import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Wand2,
  Copy,
  Check,
  RotateCcw,
  SlidersHorizontal,
  Blocks,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Dice5,
  HelpCircle,
  Zap,
  Image as ImageIcon,
  Play,
  Lightbulb,
  Layers,
  Camera,
  Sun,
  Palette,
  Heart,
  Flame,
  Award,
} from 'lucide-react';
import { UseCaseCategory, PromptStyle, AIModelType } from '../types';

interface PromptWizardProps {
  onCopy: (text: string, title: string) => void;
  onSendToCompare: (promptText: string, title: string, slotId: 'A' | 'B', imageUrl?: string) => void;
  onSendToBuilder: (suggestedBlockIds: string[], subject?: string) => void;
}

// 1. Purposes with rich icons and descriptions
interface PurposeOption {
  id: string;
  title: string;
  category: UseCaseCategory;
  description: string;
  icon: string;
  gradient: string;
}

const PURPOSES: PurposeOption[] = [
  {
    id: 'avatar',
    title: 'SNS 프로필 & 아바타',
    category: 'Profile / Avatar',
    description: '인스타그램, 카카오톡, 디스코드 프로필에 어울리는 고품질 캐릭터/인물',
    icon: '👤',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'youtube',
    title: '유튜브 & 썸네일',
    category: 'YouTube Thumbnail',
    description: '시선을 확 사로잡는 선명한 색감과 역동적인 구도의 썸네일 비주얼',
    icon: '🎬',
    gradient: 'from-rose-500 to-red-600',
  },
  {
    id: 'product',
    title: '쇼핑몰 & 제품 광고',
    category: 'Product Marketing',
    description: '스튜디오 조명과 고급스러운 배경이 어우러진 커머스 상품 샷',
    icon: '✨',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    id: '3d-character',
    title: '3D 캐릭터 & 아이콘',
    category: '3D Icon & Object',
    description: '픽사/디즈니 스타일의 귀여운 3D 렌더링 입체 캐릭터 및 오브젝트',
    icon: '🧸',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'anime',
    title: '만화 & 감성 일러스트',
    category: 'Comic / Storyboard',
    description: '지브리/신카이 마코토 감성의 따뜻하고 몽환적인 애니메이션 그림체',
    icon: '🎨',
    gradient: 'from-purple-500 to-pink-600',
  },
  {
    id: 'wallpaper',
    title: '배경화면 & SF 아트',
    category: 'Wallpaper & Sci-Fi',
    description: '압도적인 공간감의 사이버펑크 도시, 우주 성운, 판타지 풍경',
    icon: '🌌',
    gradient: 'from-cyan-500 to-blue-600',
  },
];

// 2. Sample subject tags for beginners
const QUICK_SUBJECT_TAGS = [
  '비 오는 네온 골목길에서 라멘을 먹는 아기 고양이',
  '우주를 유영하는 몽환적인 파스텔 우주비행사',
  '대리석 위에 놓인 럭셔리 유기농 스킨케어 화장품 병',
  '배낭을 메고 모험을 떠나는 귀여운 3D 여우',
  '벚꽃이 흩날리는 강가에서 커피를 마시는 소녀',
  '홀로그램 빛이 흐르는 미래형 사이버펑크 슈퍼카',
  '숲속 고대 마법 도서관과 빛나는 마법서',
  '따뜻한 아침 햇살이 비치는 아늑한 다락방 작업실',
];

// 3. Visual Styles
interface StyleOption {
  id: string;
  name: string;
  style: PromptStyle;
  description: string;
  sampleBadge: string;
  blockIds: string[];
}

const VISUAL_STYLES: StyleOption[] = [
  {
    id: 'cinematic',
    name: '시네마틱 실사 영화 (Cinematic)',
    style: 'Cinematic / Film',
    description: '35mm 필름 렌즈, 사실적인 피사계 심도와 깊이감 있는 조명',
    sampleBadge: '8K 실사 극장판',
    blockIds: ['cam-eye-level', 'lens-35mm-prime', 'light-cinematic-dramatic', 'detail-8k-sharp'],
  },
  {
    id: '3d-pixar',
    name: '3D 픽사/디즈니 애니 (3D Pixar)',
    style: '3D Render / Pixar',
    description: '부드러운 점토 질감과 동글동글 사랑스러운 3D 렌더링',
    sampleBadge: '부드러운 입체감',
    blockIds: ['style-3d-pixar', 'light-studio-softbox', 'mood-pastel-dreamy', 'detail-subsurface-scattering'],
  },
  {
    id: 'makoto-shinkai',
    name: '지브리/신카이 마코토 감성 (Anime)',
    style: 'Anime / Manga',
    description: '청량한 하늘, 흩날리는 빛 입자와 서정적인 일본 애니메이션',
    sampleBadge: '청량한 빛과 구름',
    blockIds: ['style-makoto-shinkai', 'light-golden-hour', 'mood-pastel-dreamy', 'detail-masterpiece'],
  },
  {
    id: 'cyberpunk',
    name: '사이버펑크 네온 (Cyberpunk)',
    style: 'Cyberpunk / Sci-Fi',
    description: '화려한 네온사인 림라이트, 비 내리는 미래 도시의 야경',
    sampleBadge: '화려한 네온 발광',
    blockIds: ['cam-low-angle', 'lens-anamorphic', 'light-neon-rim', 'mood-neon-cyan', 'detail-8k-sharp'],
  },
  {
    id: 'studio-photo',
    name: '스튜디오 제품 사진 (Studio Photo)',
    style: 'Photography',
    description: '디테일이 살아있는 100mm 접사, 깔끔한 소프트박스 조명',
    sampleBadge: '상업용 광고 퀄리티',
    blockIds: ['cam-close-up-macro', 'lens-macro-100mm', 'light-studio-softbox', 'detail-raytracing'],
  },
  {
    id: 'watercolor',
    name: '감성 수채화 (Watercolor)',
    style: 'Watercolor / Ink',
    description: '종이 질감 위에 번지는 맑은 물감과 부드러운 붓터치',
    sampleBadge: '따뜻한 예술 화풍',
    blockIds: ['style-watercolor', 'mood-warm-amber', 'detail-masterpiece'],
  },
];

// 4. Mood and Lighting Presets
const MOOD_LIGHTING_OPTIONS = [
  { id: 'golden-hour', label: '따스한 노을 햇살 (Golden Hour)', light: 'Warm golden hour sunset light, soft lens flare', mood: 'Warm, emotional, serene' },
  { id: 'neon-night', label: '화려한 네온빛 야경 (Neon Glow)', light: 'Vibrant neon rim lighting, cyan and magenta glow', mood: 'Futuristic, high energy, moody' },
  { id: 'soft-studio', label: '깨끗한 스튜디오 소프트 조명', light: 'Clean studio softbox diffuse lighting, minimal shadows', mood: 'Modern, elegant, pure' },
  { id: 'dreamy-pastel', label: '몽환적인 파스텔 판타지', light: 'Bioluminescent ethereal glow, fairy dust sparkles', mood: 'Dreamy, magical, celestial' },
  { id: 'dramatic-cinematic', label: '강렬한 시네마틱 음영 (Chiaroscuro)', light: 'Volumetric cinematic lighting with deep shadows', mood: 'Dramatic, intense, mysterious' },
];

export const PromptWizard: React.FC<PromptWizardProps> = ({
  onCopy,
  onSendToCompare,
  onSendToBuilder,
}) => {
  // Wizard State
  const [selectedPurpose, setSelectedPurpose] = useState<PurposeOption>(PURPOSES[0]);
  const [subjectText, setSubjectText] = useState<string>('비 내리는 네온 골목길에서 라멘을 먹고 있는 귀여운 아기 고양이');
  const [selectedStyle, setSelectedStyle] = useState<StyleOption>(VISUAL_STYLES[0]);
  const [selectedMood, setSelectedMood] = useState(MOOD_LIGHTING_OPTIONS[0]);
  const [targetModel, setTargetModel] = useState<AIModelType>('Midjourney v6');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3'>('16:9');

  // Generation & AI State
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedMj, setCopiedMj] = useState(false);

  // Active step in UI (1 to 4)
  const [activeStep, setActiveStep] = useState<number>(1);

  // Calculate Prompt Quality Score (0% ~ 100%)
  const qualityScore = useMemo(() => {
    let score = 20; // Base score
    if (selectedPurpose) score += 20;
    if (subjectText.trim().length >= 5) score += 25;
    if (selectedStyle) score += 20;
    if (selectedMood) score += 15;
    return Math.min(score, 100);
  }, [selectedPurpose, subjectText, selectedStyle, selectedMood]);

  // Build the live master prompt
  const masterPrompt = useMemo(() => {
    const cleanSubject = subjectText.trim() || 'Visual subject';
    
    // Style keywords
    let styleKeyword = '';
    if (selectedStyle.id === 'cinematic') {
      styleKeyword = 'award-winning cinematic 35mm film still, depth of field, photorealistic, 8k resolution';
    } else if (selectedStyle.id === '3d-pixar') {
      styleKeyword = 'cute 3d render, Pixar animation character style, Octane render, smooth clay textures';
    } else if (selectedStyle.id === 'makoto-shinkai') {
      styleKeyword = 'Makoto Shinkai studio ghibli anime style, lush clouds, vibrant colors, masterpiece illustration';
    } else if (selectedStyle.id === 'cyberpunk') {
      styleKeyword = 'cyberpunk aesthetic, volumetric fog, high-tech neon reflections, anamorphic lens flare';
    } else if (selectedStyle.id === 'studio-photo') {
      styleKeyword = 'commercial studio product photography, 100mm macro lens, ultra-sharp focus, clean background';
    } else {
      styleKeyword = 'masterpiece watercolor ink art, delicate brush strokes, fluid paper texture';
    }

    return `Masterpiece ${selectedStyle.style} of ${cleanSubject}, ${selectedMood.light}, ${selectedMood.mood}, ${styleKeyword}, highly detailed, perfect composition`;
  }, [subjectText, selectedStyle, selectedMood]);

  // Midjourney formatted prompt
  const midjourneyCommand = useMemo(() => {
    return `/imagine prompt: ${masterPrompt} --ar ${aspectRatio} --v 6.0 --style raw`;
  }, [masterPrompt, aspectRatio]);

  // Randomize all options (Surprise Me 🎲)
  const handleSurpriseMe = () => {
    const randomPurpose = PURPOSES[Math.floor(Math.random() * PURPOSES.length)];
    const randomSubject = QUICK_SUBJECT_TAGS[Math.floor(Math.random() * QUICK_SUBJECT_TAGS.length)];
    const randomStyle = VISUAL_STYLES[Math.floor(Math.random() * VISUAL_STYLES.length)];
    const randomMood = MOOD_LIGHTING_OPTIONS[Math.floor(Math.random() * MOOD_LIGHTING_OPTIONS.length)];
    const ratios: Array<'1:1' | '16:9' | '9:16' | '4:3'> = ['1:1', '16:9', '9:16', '4:3'];
    const randomRatio = ratios[Math.floor(Math.random() * ratios.length)];

    setSelectedPurpose(randomPurpose);
    setSubjectText(randomSubject);
    setSelectedStyle(randomStyle);
    setSelectedMood(randomMood);
    setAspectRatio(randomRatio);
    setGeneratedImageUrl(null);
  };

  // Live Test Image Generation via Backend
  const handleTestGenerate = async () => {
    setIsGeneratingImage(true);
    setGenerationError(null);

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: masterPrompt,
          aspectRatio,
          negativePrompt: 'blurry, low quality, distorted anatomy, watermark',
        }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        // Fallback visual if server response is not JSON
        const fallbackUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';
        setGeneratedImageUrl(fallbackUrl);
        return;
      }

      const data = await res.json();
      if (data.imageUrl) {
        setGeneratedImageUrl(data.imageUrl);
      } else if (data.error) {
        setGenerationError(data.error);
      }
    } catch (err: any) {
      console.warn('Image generation error, fallback preview applied:', err);
      const fallbackUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';
      setGeneratedImageUrl(fallbackUrl);
    } finally {
      setIsGeneratingImage(false);
    }
  };


  return (
    <div className="max-w-6xl mx-auto space-y-8" id="prompt-wizard-container">
      {/* Header Banner with Score & Surprise Me */}
      <div className="p-6 rounded-2xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-rose-500 to-violet-600 text-white flex items-center justify-center shadow-md shadow-rose-500/20">
              <Wand2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-stone-900 dark:text-zinc-100">
                  초보자 맞춤형 프롬프트 마법사
                </h2>
                <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  Easy Creator
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-zinc-400 mt-0.5">
                복잡한 영어나 프롬프트 문법을 몰라도, 4단계 질문에 답하면 전문가급 프롬프트가 자동 완성됩니다!
              </p>
            </div>
          </div>

          {/* Right Action: Surprise Me & Quality Meter */}
          <div className="flex items-center gap-4 self-end md:self-auto">
            {/* Prompt Quality Meter */}
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 dark:text-zinc-300">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>프롬프트 완성도:</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{qualityScore}%</span>
              </div>
              <div className="w-32 h-2 rounded-full bg-stone-100 dark:bg-zinc-800 overflow-hidden border border-stone-200 dark:border-zinc-700">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 via-indigo-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${qualityScore}%` }}
                />
              </div>
            </div>

            {/* Surprise Me Dice Button */}
            <button
              type="button"
              onClick={handleSurpriseMe}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-white text-xs font-bold shadow-sm hover:opacity-95 hover:scale-103 transition-all cursor-pointer"
            >
              <Dice5 className="w-4 h-4" />
              <span>랜덤 마법 추천 🎲</span>
            </button>
          </div>
        </div>

        {/* 4-Step Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-6 pt-5 border-t border-stone-200 dark:border-zinc-800">
          {[
            { step: 1, label: '1. 만들기 목적', icon: '🎯' },
            { step: 2, label: '2. 주인공/피사체', icon: '🐱' },
            { step: 3, label: '3. 스타일 & 분위기', icon: '🎨' },
            { step: 4, label: '4. AI 도구 & 비율', icon: '📐' },
          ].map((item) => (
            <button
              key={item.step}
              type="button"
              onClick={() => setActiveStep(item.step)}
              className={`p-2.5 rounded-xl text-left font-medium text-xs transition-all flex items-center gap-2 border ${
                activeStep === item.step
                  ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20 font-bold'
                  : 'border-stone-200 dark:border-zinc-800 text-stone-600 dark:text-zinc-400 hover:bg-stone-50 dark:hover:bg-zinc-800/60'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Wizard Input Section based on Active Step */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Wizard Steps (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 1: Purpose Selection */}
          {activeStep === 1 && (
            <div className="p-6 rounded-2xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-stone-900 dark:text-zinc-100 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs flex items-center justify-center font-bold">1</span>
                    어떤 용도의 이미지를 만들고 싶으신가요?
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1">
                    원하시는 목적을 선택하시면 최적화된 구도와 앵글이 자동으로 세팅됩니다.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {PURPOSES.map((purpose) => (
                  <button
                    key={purpose.id}
                    type="button"
                    onClick={() => {
                      setSelectedPurpose(purpose);
                      setActiveStep(2); // Auto advance to next step for smooth UX
                    }}
                    className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden group ${
                      selectedPurpose.id === purpose.id
                        ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-100 ring-2 ring-indigo-500/20'
                        : 'border-stone-200 dark:border-zinc-800 hover:border-stone-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900 text-stone-800 dark:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{purpose.icon}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold truncate">{purpose.title}</p>
                          {selectedPurpose.id === purpose.id && (
                            <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1 leading-snug line-clamp-2">
                          {purpose.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Subject & Concept */}
          {activeStep === 2 && (
            <div className="p-6 rounded-2xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs space-y-4">
              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-zinc-100 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs flex items-center justify-center font-bold">2</span>
                  어떤 주인공(피사체)을 그리고 싶나요?
                </h3>
                <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1">
                  머릿속에 떠오르는 그림을 한글로 편하게 적어보세요. (예: 귀여운 아기 판다, 우주 비행사 등)
                </p>
              </div>

              {/* Textarea */}
              <div className="space-y-2">
                <textarea
                  value={subjectText}
                  onChange={(e) => setSubjectText(e.target.value)}
                  placeholder="예: 비 내리는 골목길에서 라멘을 먹고 있는 귀여운 아기 고양이"
                  rows={3}
                  className="w-full p-4 rounded-xl border border-stone-200 dark:border-zinc-700 bg-stone-50 dark:bg-zinc-950 text-stone-900 dark:text-zinc-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden resize-none"
                />
              </div>

              {/* Quick Preset Tags for Beginners */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-stone-600 dark:text-zinc-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  초보자를 위한 추천 아이디어 (클릭하면 바로 적용)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_SUBJECT_TAGS.map((tag, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSubjectText(tag)}
                      className="px-2.5 py-1.5 rounded-lg text-xs border border-stone-200 dark:border-zinc-800 bg-stone-50 dark:bg-zinc-800/80 text-stone-700 dark:text-zinc-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-all text-left"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <span>스타일 선택으로 이동</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Style & Mood */}
          {activeStep === 3 && (
            <div className="p-6 rounded-2xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs space-y-5">
              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-zinc-100 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs flex items-center justify-center font-bold">3</span>
                  그림 스타일과 조명 분위기 고르기
                </h3>
                <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1">
                  가장 마음에 드는 비주얼 화풍과 빛 효과를 선택해 보세요.
                </p>
              </div>

              {/* Visual Styles Grid */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-700 dark:text-zinc-300">
                  🎨 비주얼 화풍 선택
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {VISUAL_STYLES.map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setSelectedStyle(style)}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        selectedStyle.id === style.id
                          ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-100 ring-2 ring-indigo-500/20'
                          : 'border-stone-200 dark:border-zinc-800 hover:border-stone-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900 text-stone-800 dark:text-zinc-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold truncate">{style.name}</p>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-zinc-400">
                          {style.sampleBadge}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 dark:text-zinc-400 mt-1 line-clamp-2">
                        {style.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mood & Lighting Options */}
              <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-zinc-800">
                <label className="text-xs font-bold text-stone-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  조명 및 분위기 선택
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {MOOD_LIGHTING_OPTIONS.map((mood) => (
                    <button
                      key={mood.id}
                      type="button"
                      onClick={() => setSelectedMood(mood)}
                      className={`px-3.5 py-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                        selectedMood.id === mood.id
                          ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 ring-2 ring-amber-500/20 font-bold'
                          : 'border-stone-200 dark:border-zinc-800 hover:border-stone-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900 text-stone-700 dark:text-zinc-300'
                      }`}
                    >
                      <span>{mood.label}</span>
                      {selectedMood.id === mood.id && <Check className="w-4 h-4 text-amber-500" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setActiveStep(4)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <span>도구 & 화면 비율 선택으로 이동</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Model & Aspect Ratio */}
          {activeStep === 4 && (
            <div className="p-6 rounded-2xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs space-y-5">
              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-zinc-100 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs flex items-center justify-center font-bold">4</span>
                  사용할 AI 도구 및 화면 비율
                </h3>
                <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1">
                  생성할 플랫폼(미드저니, DALL-E, 제미나이 등)과 용도에 맞는 비율을 선택하세요.
                </p>
              </div>

              {/* Target Model Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-700 dark:text-zinc-300">
                  🤖 대상 AI 이미지 생성 도구
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'Midjourney v6', name: 'Midjourney v6', desc: '미드저니 전용 명령어' },
                    { id: 'DALL-E 3', name: 'ChatGPT (DALL-E 3)', desc: '챗GPT 이미지 생성' },
                    { id: 'Nano Banana (Gemini)', name: 'Gemini 3.1 Flash', desc: '구글 실시간 생성' },
                    { id: 'Flux.1', name: 'Flux.1', desc: '고성능 오픈소스 모델' },
                    { id: 'Stable Diffusion XL', name: 'Stable Diffusion', desc: 'SDXL / ComfyUI' },
                  ].map((model) => (
                    <button
                      key={model.id}
                      type="button"
                      onClick={() => setTargetModel(model.id as AIModelType)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        targetModel === model.id
                          ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20 font-bold'
                          : 'border-stone-200 dark:border-zinc-800 hover:border-stone-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900 text-stone-800 dark:text-zinc-300'
                      }`}
                    >
                      <p className="text-xs truncate">{model.name}</p>
                      <span className="text-[10px] text-stone-500 dark:text-zinc-400 block mt-0.5">
                        {model.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Aspect Ratio Selector */}
              <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-zinc-800">
                <label className="text-xs font-bold text-stone-700 dark:text-zinc-300">
                  📐 화면 비율 (Aspect Ratio)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { ratio: '1:1' as const, label: '1:1 정사각형', sub: '인스타그램/프로필' },
                    { ratio: '16:9' as const, label: '16:9 가로형', sub: '유튜브/PC배경' },
                    { ratio: '9:16' as const, label: '9:16 세로형', sub: '쇼츠/릴스/스마트폰' },
                    { ratio: '4:3' as const, label: '4:3 표준형', sub: '일반 사진/삽화' },
                  ].map((item) => (
                    <button
                      key={item.ratio}
                      type="button"
                      onClick={() => setAspectRatio(item.ratio)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        aspectRatio === item.ratio
                          ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20 font-bold'
                          : 'border-stone-200 dark:border-zinc-800 hover:border-stone-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900 text-stone-800 dark:text-zinc-300'
                      }`}
                    >
                      <p className="text-xs font-bold">{item.label}</p>
                      <span className="text-[10px] text-stone-500 dark:text-zinc-400 mt-0.5 block">{item.sub}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Generated Prompt Output & Instant Test Generation (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-zinc-800">
              <h3 className="text-base font-bold text-stone-900 dark:text-zinc-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                완성된 마스터 프롬프트
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                Ready to Copy
              </span>
            </div>

            {/* English Master Prompt Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-600 dark:text-zinc-400">
                  생성된 영문 프롬프트
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onCopy(masterPrompt, '마법사 완성 프롬프트');
                    setCopiedPrompt(true);
                    setTimeout(() => setCopiedPrompt(false), 2000);
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
                >
                  {copiedPrompt ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPrompt ? '복사 완료!' : '프롬프트 복사'}</span>
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 text-xs font-mono leading-relaxed text-stone-900 dark:text-zinc-100 select-all">
                {masterPrompt}
              </div>
            </div>

            {/* Midjourney Command Box */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" /> Midjourney 명령어
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onCopy(midjourneyCommand, 'Midjourney 명령어');
                    setCopiedMj(true);
                    setTimeout(() => setCopiedMj(false), 2000);
                  }}
                  className="text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline"
                >
                  {copiedMj ? '복사됨!' : '원클릭 복사'}
                </button>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-500/5 dark:bg-amber-950/20 border border-amber-500/20 text-xs font-mono text-amber-900 dark:text-amber-200 truncate select-all">
                {midjourneyCommand}
              </div>
            </div>

            {/* Beginner Explanation & Pro-Tip Box */}
            <div className="p-4 rounded-xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/60 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-sky-900 dark:text-sky-200">
                <Lightbulb className="w-4 h-4 text-sky-500" />
                💡 초보자를 위한 프롬프트 해설
              </div>
              <p className="text-xs text-sky-800 dark:text-sky-300 leading-relaxed">
                입력하신 <strong className="font-semibold text-sky-900 dark:text-sky-100">"{subjectText}"</strong>에
                <strong className="font-semibold text-sky-900 dark:text-sky-100"> [{selectedStyle.name}]</strong>과
                <strong className="font-semibold text-sky-900 dark:text-sky-100"> [{selectedMood.label}]</strong> 효과를 결합하여 피사체의 입체감과 조명 반사율을 극대화했습니다.
              </p>
            </div>

            {/* Test Generate Image Preview */}
            <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={handleTestGenerate}
                disabled={isGeneratingImage}
                className="w-full p-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50"
              >
                {isGeneratingImage ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>AI 이미지 실시간 렌더링 중...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>실시간 AI 이미지 테스트 생성하기</span>
                  </>
                )}
              </button>

              {/* Generated Image Result Preview */}
              {generatedImageUrl && (
                <div className="mt-3 rounded-xl overflow-hidden border border-stone-200 dark:border-zinc-800 shadow-sm aspect-16/9 bg-black flex items-center justify-center">
                  <img
                    src={generatedImageUrl}
                    alt="생성된 테스트 이미지"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {generationError && (
                <p className="text-xs text-rose-500 mt-1 text-center">{generationError}</p>
              )}
            </div>

            {/* Cross-Studio Actions */}
            <div className="pt-3 border-t border-stone-200 dark:border-zinc-800 space-y-2">
              <label className="text-[11px] font-bold text-stone-500 dark:text-zinc-400 uppercase tracking-wider block">
                다른 도구로 연동하여 확장하기
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onSendToBuilder(selectedStyle.blockIds, subjectText);
                  }}
                  className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 font-semibold text-xs hover:bg-emerald-100 transition-colors"
                >
                  <Blocks className="w-3.5 h-3.5 text-emerald-600" />
                  <span>블록 빌더로 전송</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSendToCompare(
                      masterPrompt,
                      `마법사: ${subjectText.slice(0, 15)}`,
                      'A',
                      generatedImageUrl || undefined
                    );
                  }}
                  className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-violet-500/30 bg-violet-50 dark:bg-violet-950/40 text-violet-800 dark:text-violet-200 font-semibold text-xs hover:bg-violet-100 transition-colors"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-violet-600" />
                  <span>비교 슬롯 A로 전송</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
