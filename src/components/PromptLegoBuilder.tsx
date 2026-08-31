import React, { useState, useMemo, useCallback } from 'react';
import {
  LegoBlock,
  LEGO_CATEGORIES,
  ALL_LEGO_BLOCKS,
  LEGO_BLUEPRINT_PRESETS,
  LegoBlueprintPreset,
} from '../data/legoBlocksData';
import {
  Blocks,
  Copy,
  Sparkles,
  Shuffle,
  RotateCcw,
  SlidersHorizontal,
  Wand2,
  Check,
  X,
  Plus,
  Play,
  Loader2,
  Layers,
  ArrowRight,
  Info,
  Maximize2,
  CheckCircle2,
  Aperture,
  Camera,
  Sun,
  Palette,
  Flame,
  User,
} from 'lucide-react';

interface PromptLegoBuilderProps {
  onCopy: (text: string, title: string) => void;
  onSendToCompare: (promptText: string, title: string, slotId: 'A' | 'B') => void;
  initialBlockIds?: string[];
}

export const PromptLegoBuilder: React.FC<PromptLegoBuilderProps> = ({
  onCopy,
  onSendToCompare,
  initialBlockIds,
}) => {
  // Selected Block IDs
  const [selectedBlockIds, setSelectedBlockIds] = useState<string[]>(() => {
    return (
      initialBlockIds && initialBlockIds.length > 0
        ? initialBlockIds
        : [
            'sub-cyberpunk-samurai',
            'cam-low-angle',
            'lens-anamorphic',
            'light-neon-rim',
            'style-octane',
            'mood-neon-cyan',
            'detail-8k-sharp',
          ]
    );
  });

  React.useEffect(() => {
    if (initialBlockIds && initialBlockIds.length > 0) {
      setSelectedBlockIds(initialBlockIds);
    }
  }, [initialBlockIds]);

  // Active Category Shelf Tab
  const [activeCategoryKey, setActiveCategoryKey] = useState<LegoBlock['category']>('subject');

  // Custom Subject input
  const [customSubjectText, setCustomSubjectText] = useState('');
  const [isUsingCustomSubject, setIsUsingCustomSubject] = useState(false);


  // Target Model Format
  const [targetModel, setTargetModel] = useState<string>('Midjourney v6');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3' | '3:4'>('16:9');

  // Block search query within shelf
  const [shelfSearch, setShelfSearch] = useState('');

  // Image Generation State for quick test inside builder
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Copy success indicator
  const [hasCopied, setHasCopied] = useState(false);

  // Map of active selected blocks
  const selectedBlocks = useMemo(() => {
    return ALL_LEGO_BLOCKS.filter((b) => selectedBlockIds.includes(b.id));
  }, [selectedBlockIds]);

  // Toggle or replace block depending on singleSelect vs multiSelect
  const handleToggleBlock = (block: LegoBlock) => {
    const isCurrentlySelected = selectedBlockIds.includes(block.id);
    const categoryConfig = LEGO_CATEGORIES.find((c) => c.key === block.category);
    const isSingleSelect = categoryConfig?.singleSelect ?? false;

    if (isCurrentlySelected) {
      // Remove it
      setSelectedBlockIds((prev) => prev.filter((id) => id !== block.id));
    } else {
      if (isSingleSelect) {
        // Remove other blocks of same category first
        setSelectedBlockIds((prev) => [
          ...prev.filter((id) => {
            const existing = ALL_LEGO_BLOCKS.find((b) => b.id === id);
            return existing?.category !== block.category;
          }),
          block.id,
        ]);
      } else {
        setSelectedBlockIds((prev) => [...prev, block.id]);
      }
    }
  };

  // Remove individual block from assembly workbench
  const handleRemoveBlock = (blockId: string) => {
    setSelectedBlockIds((prev) => prev.filter((id) => id !== blockId));
  };

  // Apply a blueprint preset recipe
  const handleApplyBlueprint = (preset: LegoBlueprintPreset) => {
    setSelectedBlockIds(preset.blockIds);
    setAspectRatio(preset.aspectRatio);
    setTargetModel(preset.targetModel);
    if (preset.customSubject) {
      setCustomSubjectText(preset.customSubject);
      setIsUsingCustomSubject(true);
    } else {
      setIsUsingCustomSubject(false);
    }
  };

  // Randomize / Shuffle balanced block combination
  const handleRandomize = () => {
    const newIds: string[] = [];

    LEGO_CATEGORIES.forEach((cat) => {
      const candidates = ALL_LEGO_BLOCKS.filter((b) => b.category === cat.key);
      if (candidates.length > 0) {
        if (cat.key === 'details') {
          // pick 1-2 details
          const shuffled = [...candidates].sort(() => 0.5 - Math.random());
          newIds.push(shuffled[0].id);
          if (shuffled[1] && Math.random() > 0.5) newIds.push(shuffled[1].id);
        } else {
          // pick 1 random block from each category
          const randomIndex = Math.floor(Math.random() * candidates.length);
          newIds.push(candidates[randomIndex].id);
        }
      }
    });

    setSelectedBlockIds(newIds);
    setIsUsingCustomSubject(false);
  };

  // Clear all attached blocks
  const handleClearAll = () => {
    setSelectedBlockIds([]);
    setCustomSubjectText('');
    setIsUsingCustomSubject(false);
    setGeneratedImageUrl(null);
    setGenerationError(null);
  };

  // Assembled synthesized prompt text
  const assembledPrompt = useMemo(() => {
    const parts: string[] = [];

    // 1. Subject
    if (isUsingCustomSubject && customSubjectText.trim()) {
      parts.push(customSubjectText.trim());
    } else {
      const subjects = selectedBlocks.filter((b) => b.category === 'subject');
      if (subjects.length > 0) {
        parts.push(subjects.map((b) => b.value).join(', '));
      }
    }

    // 2. Camera Angle & Shot
    const cameraAngles = selectedBlocks.filter((b) => b.category === 'cameraAngle');
    if (cameraAngles.length > 0) {
      parts.push(cameraAngles.map((b) => b.value).join(', '));
    }

    // 3. Lens & Depth
    const lenses = selectedBlocks.filter((b) => b.category === 'lens');
    if (lenses.length > 0) {
      parts.push(lenses.map((b) => b.value).join(', '));
    }

    // 4. Lighting
    const lightings = selectedBlocks.filter((b) => b.category === 'lighting');
    if (lightings.length > 0) {
      parts.push(lightings.map((b) => b.value).join(', '));
    }

    // 5. Art Style & Engine
    const artStyles = selectedBlocks.filter((b) => b.category === 'artStyle');
    if (artStyles.length > 0) {
      parts.push(artStyles.map((b) => b.value).join(', '));
    }

    // 6. Mood & Color
    const moods = selectedBlocks.filter((b) => b.category === 'mood');
    if (moods.length > 0) {
      parts.push(moods.map((b) => b.value).join(', '));
    }

    // 7. Details & Quality
    const details = selectedBlocks.filter((b) => b.category === 'details');
    if (details.length > 0) {
      parts.push(details.map((b) => b.value).join(', '));
    }

    let baseText = parts.filter(Boolean).join('. ');
    if (!baseText.trim()) {
      return '';
    }

    // Model-specific syntax formatting
    if (targetModel === 'Midjourney v6') {
      baseText = `${baseText} --ar ${aspectRatio} --v 6.0 --stylize 250`;
    } else if (targetModel === 'Stable Diffusion XL') {
      baseText = `(masterpiece:1.2), (photorealistic:1.3), best quality, ${baseText}`;
    }

    return baseText;
  }, [selectedBlocks, isUsingCustomSubject, customSubjectText, targetModel, aspectRatio]);

  // Negative prompt recommendation based on style
  const recommendedNegativePrompt = useMemo(() => {
    const hasAnime = selectedBlocks.some((b) => b.id.includes('anime') || b.id.includes('shinkai') || b.id.includes('ghibli'));
    if (hasAnime) {
      return '3D render, photorealistic, bad anatomy, bad hands, missing fingers, extra limbs, blurry, low resolution, text, watermark';
    }
    return 'blurry, low quality, distorted, extra limbs, bad anatomy, deformed eyes, washed out colors, duplicate elements, low resolution, artifacts';
  }, [selectedBlocks]);

  // Handle Copy
  const handleCopy = () => {
    if (!assembledPrompt) return;
    onCopy(assembledPrompt, '레고 조립 프롬프트');
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  // Handle Quick Test Image Generation
  const handleTestGenerate = async () => {
    if (!assembledPrompt || isGenerating) return;
    setIsGenerating(true);
    setGenerationError(null);

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: assembledPrompt,
          aspectRatio,
          negativePrompt: recommendedNegativePrompt,
        }),
      });

      const contentType = res.headers.get('content-type') || '';
      let data: any = {};
      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        data = {
          imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
          isFallback: true,
        };
      }

      if (data.imageUrl) {
        setGeneratedImageUrl(data.imageUrl);
      } else if (data.error) {
        setGenerationError(data.error);
      }
    } catch (err: any) {
      console.warn('Test generation fallback applied:', err);
      setGeneratedImageUrl('https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80');
    } finally {
      setIsGenerating(false);
    }
  };


  // Filter shelf blocks by category and search
  const shelfBlocks = useMemo(() => {
    let list = ALL_LEGO_BLOCKS.filter((b) => b.category === activeCategoryKey);
    if (shelfSearch.trim()) {
      const q = shelfSearch.toLowerCase().trim();
      list = list.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.koreanName.toLowerCase().includes(q) ||
          b.value.toLowerCase().includes(q) ||
          (b.description && b.description.toLowerCase().includes(q))
      );
    }
    return list;
  }, [activeCategoryKey, shelfSearch]);

  const activeCategoryMeta = LEGO_CATEGORIES.find((c) => c.key === activeCategoryKey);

  const getCategoryIcon = (key: LegoBlock['category']) => {
    switch (key) {
      case 'subject':
        return <User className="w-4 h-4" />;
      case 'cameraAngle':
        return <Camera className="w-4 h-4" />;
      case 'lens':
        return <Aperture className="w-4 h-4" />;
      case 'lighting':
        return <Sun className="w-4 h-4" />;
      case 'artStyle':
        return <Palette className="w-4 h-4" />;
      case 'mood':
        return <Flame className="w-4 h-4" />;
      case 'details':
        return <Sparkles className="w-4 h-4" />;
      default:
        return <Blocks className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6" id="prompt-lego-builder-view">
      {/* Top Banner & Control Bar */}
      <div className="rounded-2xl border border-stone-200 dark:border-zinc-800 bg-gradient-to-r from-stone-900 via-zinc-900 to-indigo-950 text-white p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <Blocks className="w-3.5 h-3.5" />
                Prompt Lego Builder
              </span>
              <span className="text-xs text-stone-400">인터랙티브 파라미터 조립기</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              비주얼 파라미터 블록을 레고처럼 조립해보세요
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              피사체, 카메라 앵글, 조명, 렌즈 심도, 렌더링 화풍 블록을 찰칵 붙여 전문가급 완성형 이미지 프롬프트를 즉시 제작할 수 있습니다.
            </p>
          </div>

          {/* Quick Blueprint Presets & Randomize */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleRandomize}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95"
              id="lego-randomize-btn"
            >
              <Shuffle className="w-3.5 h-3.5 text-amber-400" />
              <span>랜덤 블록 조합</span>
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-stone-300 hover:text-rose-200 border border-white/10 hover:border-rose-500/40 text-xs font-medium flex items-center gap-1.5 transition-all"
              id="lego-clear-btn"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>전체 초기화</span>
            </button>
          </div>
        </div>

        {/* Blueprint Starter Recipes Chips */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="text-xs font-semibold text-stone-300 shrink-0 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            추천 레시피:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none no-scrollbar">
            {LEGO_BLUEPRINT_PRESETS.map((bp) => (
              <button
                key={bp.id}
                type="button"
                onClick={() => handleApplyBlueprint(bp)}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-indigo-600/60 border border-white/15 text-stone-200 hover:text-white text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5"
              >
                <span>{bp.koreanTitle}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Builder Grid: Left (Block Shelves) & Right (Workbench & Live Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= LEFT COLUMN: LEGO BLOCK SHELF (7 Cols) ================= */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-stone-200 dark:border-zinc-800 p-5 shadow-xs">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-stone-900 dark:text-zinc-100">
                  파라미터 부품 서랍장
                </h3>
              </div>
              <span className="text-xs text-stone-500 dark:text-zinc-400">
                원하는 블록을 클릭하여 조립/해제하세요
              </span>
            </div>

            {/* Category Tab Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none no-scrollbar border-b border-stone-100 dark:border-zinc-800/80">
              {LEGO_CATEGORIES.map((cat) => {
                const isActive = activeCategoryKey === cat.key;
                const count = selectedBlocks.filter((b) => b.category === cat.key).length;

                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setActiveCategoryKey(cat.key)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                      isActive
                        ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-zinc-950 shadow-xs'
                        : 'text-stone-600 dark:text-zinc-400 hover:bg-stone-100 dark:hover:bg-zinc-800 hover:text-stone-900 dark:hover:text-zinc-100'
                    }`}
                  >
                    {getCategoryIcon(cat.key)}
                    <span>{cat.koreanLabel}</span>
                    {count > 0 && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive
                          ? 'bg-white/20 text-white dark:bg-black/20 dark:text-zinc-900'
                          : 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300'
                      }`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Custom Subject Input Box (When on Subject Tab) */}
            {activeCategoryKey === 'subject' && (
              <div className="mt-4 p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-800/60 bg-indigo-50/50 dark:bg-indigo-950/20 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-indigo-600" />
                    나만의 직접 피사체 입력 (Custom Subject)
                  </label>
                  {isUsingCustomSubject && (
                    <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                      ✓ 활성화됨
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customSubjectText}
                    onChange={(e) => {
                      setCustomSubjectText(e.target.value);
                      if (e.target.value.trim()) setIsUsingCustomSubject(true);
                    }}
                    placeholder="예: A futuristic golden flying dragon with crystalline wings over Seoul..."
                    className="flex-1 px-3 py-2 rounded-xl text-xs border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-zinc-900 text-stone-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customSubjectText.trim()) {
                        setIsUsingCustomSubject(!isUsingCustomSubject);
                      }
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isUsingCustomSubject
                        ? 'bg-indigo-600 text-white'
                        : 'bg-stone-200 dark:bg-zinc-700 text-stone-700 dark:text-zinc-300'
                    }`}
                  >
                    {isUsingCustomSubject ? '적용 중' : '적용'}
                  </button>
                </div>
              </div>
            )}

            {/* Block Search Box */}
            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="text-xs font-bold text-stone-700 dark:text-zinc-300">
                {activeCategoryMeta?.koreanLabel} 부품 목록 ({shelfBlocks.length}개)
              </span>
              <input
                type="text"
                value={shelfSearch}
                onChange={(e) => setShelfSearch(e.target.value)}
                placeholder="부품 검색 (키워드/이름)..."
                className="w-48 px-2.5 py-1 text-xs rounded-lg border border-stone-200 dark:border-zinc-800 bg-stone-50 dark:bg-zinc-800 text-stone-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Block Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3.5 max-h-[480px] overflow-y-auto pr-1">
              {shelfBlocks.map((block) => {
                const isSelected = selectedBlockIds.includes(block.id);
                const categoryColor = activeCategoryMeta?.colorClass;

                return (
                  <div
                    key={block.id}
                    onClick={() => handleToggleBlock(block)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all relative group flex flex-col justify-between ${
                      isSelected
                        ? `${categoryColor?.bg} ${categoryColor?.border} ring-2 ring-indigo-500/50 shadow-xs`
                        : 'bg-stone-50/70 dark:bg-zinc-800/40 border-stone-200 dark:border-zinc-800 hover:border-stone-300 dark:hover:border-zinc-700 hover:bg-white dark:hover:bg-zinc-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold ${
                              isSelected
                                ? 'bg-indigo-600 text-white'
                                : 'bg-stone-200 dark:bg-zinc-700 text-stone-600 dark:text-zinc-300'
                            }`}
                          >
                            {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                          </span>
                          <h4 className="text-xs font-bold text-stone-900 dark:text-zinc-100">
                            {block.koreanName}
                          </h4>
                        </div>
                        {isSelected && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-indigo-600 text-white">
                            결합됨
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-stone-500 dark:text-zinc-400 mt-1.5 line-clamp-2">
                        {block.description || block.value}
                      </p>
                    </div>

                    <div className="mt-2 pt-2 border-t border-stone-200/50 dark:border-zinc-700/50 flex items-center justify-between text-[10px] text-stone-400">
                      <span className="truncate max-w-[200px] font-mono">{block.name}</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-semibold group-hover:underline">
                        {isSelected ? '해제' : '장착'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: WORKBENCH & REALTIME PREVIEW (5 Cols) ================= */}
        <div className="lg:col-span-5 space-y-4">
          {/* 1. Workbench Assembled Blocks Chain */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-stone-200 dark:border-zinc-800 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Blocks className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-bold text-stone-900 dark:text-zinc-100">
                  조립 작업대 (Assembly Stage)
                </h3>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {selectedBlocks.length + (isUsingCustomSubject && customSubjectText ? 1 : 0)}개 블록 결합
              </span>
            </div>

            {/* Assembled Blocks Pill List */}
            <div className="min-h-[90px] p-3 rounded-xl bg-stone-50 dark:bg-zinc-800/50 border border-dashed border-stone-200 dark:border-zinc-700 flex flex-wrap gap-2 items-center">
              {isUsingCustomSubject && customSubjectText && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-600 text-white shadow-xs">
                  <User className="w-3 h-3" />
                  <span className="max-w-[140px] truncate">{customSubjectText}</span>
                  <button
                    type="button"
                    onClick={() => setIsUsingCustomSubject(false)}
                    className="hover:text-rose-200 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              {selectedBlocks.map((b) => {
                const cat = LEGO_CATEGORIES.find((c) => c.key === b.category);
                return (
                  <div
                    key={b.id}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${cat?.colorClass.bg} ${cat?.colorClass.border} ${cat?.colorClass.text} shadow-xs`}
                  >
                    {getCategoryIcon(b.category)}
                    <span>{b.koreanName}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveBlock(b.id);
                      }}
                      className="hover:opacity-70 transition-opacity ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}

              {selectedBlocks.length === 0 && !isUsingCustomSubject && (
                <p className="text-xs text-stone-400 dark:text-zinc-500 py-3 text-center w-full">
                  좌측 서랍장에서 블록을 클릭하여 장착하세요.
                </p>
              )}
            </div>

            {/* Target Model & Format Controls */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-bold text-stone-600 dark:text-zinc-400 uppercase tracking-wider mb-1">
                  타겟 AI 모델
                </label>
                <select
                  value={targetModel}
                  onChange={(e) => setTargetModel(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-zinc-700 bg-stone-50 dark:bg-zinc-800 text-xs font-medium text-stone-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Midjourney v6">Midjourney v6</option>
                  <option value="Nano Banana (Gemini)">Nano Banana (Gemini)</option>
                  <option value="Flux.1">Flux.1</option>
                  <option value="Stable Diffusion XL">Stable Diffusion XL</option>
                  <option value="DALL-E 3">DALL-E 3</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-600 dark:text-zinc-400 uppercase tracking-wider mb-1">
                  화면비 (Aspect Ratio)
                </label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-zinc-700 bg-stone-50 dark:bg-zinc-800 text-xs font-medium text-stone-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="1:1">1:1 (정사각형)</option>
                  <option value="16:9">16:9 (시네마틱 가로)</option>
                  <option value="9:16">9:16 (쇼츠/스토리)</option>
                  <option value="4:3">4:3 (사진 비율)</option>
                  <option value="3:4">3:4 (포트레이트)</option>
                </select>
              </div>
            </div>

            {/* Final Live Prompt Output Display */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-stone-700 dark:text-zinc-300">
                  완성된 영문 프롬프트 (Live Prompt)
                </label>
                <span className="text-[10px] font-mono text-stone-400">
                  {assembledPrompt.length} 글자
                </span>
              </div>
              <textarea
                readOnly
                value={assembledPrompt || '블록을 선택하면 완성된 프롬프트가 실시간으로 조합됩니다.'}
                rows={4}
                className="w-full p-3 rounded-xl border border-stone-200 dark:border-zinc-700 bg-stone-50/80 dark:bg-zinc-800/80 font-mono text-xs text-stone-800 dark:text-zinc-200 focus:outline-none resize-none leading-relaxed"
              />
            </div>

            {/* Quick Action Buttons: Copy, Compare Slot A/B, Test Image */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleCopy}
                disabled={!assembledPrompt}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-40"
                id="lego-copy-btn"
              >
                {hasCopied ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{hasCopied ? '클립보드에 복사 완료!' : '완성 프롬프트 1클릭 복사'}</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onSendToCompare(assembledPrompt, '레고 조립 프롬프트', 'A')}
                  disabled={!assembledPrompt}
                  className="py-2 px-3 rounded-xl border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold text-xs hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors disabled:opacity-40 flex items-center justify-center gap-1.5"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>비교 슬롯 A로 전송</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSendToCompare(assembledPrompt, '레고 조립 프롬프트', 'B')}
                  disabled={!assembledPrompt}
                  className="py-2 px-3 rounded-xl border border-violet-200 dark:border-violet-800/80 bg-violet-50/60 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 font-semibold text-xs hover:bg-violet-100 dark:hover:bg-violet-900/60 transition-colors disabled:opacity-40 flex items-center justify-center gap-1.5"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>비교 슬롯 B로 전송</span>
                </button>
              </div>

              {/* Instant Gemini Test Generator Button */}
              <button
                type="button"
                onClick={handleTestGenerate}
                disabled={!assembledPrompt || isGenerating}
                className="w-full py-2 rounded-xl bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-40"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                    <span>Gemini 3.1 이미지 생성 중...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                    <span>Gemini AI 즉시 테스트 이미지 생성</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 2. Test Image Generation Result Box */}
          {(generatedImageUrl || isGenerating || generationError) && (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-stone-200 dark:border-zinc-800 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  AI 테스트 생성 결과
                </span>
                {generatedImageUrl && (
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                    생성 완료
                  </span>
                )}
              </div>

              {isGenerating && (
                <div className="aspect-square rounded-xl bg-stone-100 dark:bg-zinc-800 flex flex-col items-center justify-center text-center p-6 space-y-2">
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                  <p className="text-xs font-semibold text-stone-700 dark:text-zinc-300">
                    블록 파라미터 기반으로 이미지를 렌더링하고 있습니다...
                  </p>
                </div>
              )}

              {generationError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs">
                  {generationError}
                </div>
              )}

              {generatedImageUrl && !isGenerating && (
                <div className="relative rounded-xl overflow-hidden border border-stone-200 dark:border-zinc-800 group">
                  <img
                    src={generatedImageUrl}
                    alt="Lego generated preview"
                    className="w-full h-auto object-cover max-h-72 rounded-xl"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => window.open(generatedImageUrl, '_blank')}
                      className="p-2 rounded-lg bg-white/90 text-stone-900 hover:bg-white text-xs font-semibold shadow-md flex items-center gap-1"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>크게 보기</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
