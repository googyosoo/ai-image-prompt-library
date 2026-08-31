import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Layers,
  Copy,
  Check,
  RotateCcw,
  Sliders,
  Download,
  Maximize2,
  Columns,
  Split,
  Eye,
  Loader2,
  AlertCircle,
  HelpCircle,
  Zap,
} from 'lucide-react';
import { CompareSlot, PromptItem, PromptStyle } from '../types';
import { STYLES, PROMPT_PRESETS } from '../data/promptsData';

interface CompareStudioProps {
  slotA: CompareSlot;
  setSlotA: React.Dispatch<React.SetStateAction<CompareSlot>>;
  slotB: CompareSlot;
  setSlotB: React.Dispatch<React.SetStateAction<CompareSlot>>;
  onCopy: (text: string, title: string) => void;
  onSelectPresetToSlot: (prompt: PromptItem, slotId: 'A' | 'B') => void;
}

export const CompareStudio: React.FC<CompareStudioProps> = ({
  slotA,
  setSlotA,
  slotB,
  setSlotB,
  onCopy,
  onSelectPresetToSlot,
}) => {
  const [viewMode, setViewMode] = useState<'side-by-side' | 'slider' | 'diff'>('side-by-side');
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const [copiedA, setCopiedA] = useState(false);
  const [copiedB, setCopiedB] = useState(false);
  const [activeModalImage, setActiveModalImage] = useState<string | null>(null);

  const sliderContainerRef = useRef<HTMLDivElement>(null);

  // Handle Slider Dragging for interactive split comparison
  const handleSliderMove = (clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingSlider) {
        handleSliderMove(e.clientX);
      }
    };
    const handleMouseUp = () => {
      if (isDraggingSlider) {
        setIsDraggingSlider(false);
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isDraggingSlider && e.touches.length > 0) {
        handleSliderMove(e.touches[0].clientX);
      }
    };

    if (isDraggingSlider) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDraggingSlider]);

  // Generate Image via Server API
  const handleGenerateImage = async (slotId: 'A' | 'B') => {
    const targetSlot = slotId === 'A' ? slotA : slotB;
    const setTargetSlot = slotId === 'A' ? setSlotA : setSlotB;

    if (!targetSlot.prompt.trim()) return;

    setTargetSlot((prev) => ({
      ...prev,
      isGenerating: true,
      error: undefined,
    }));

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: targetSlot.prompt,
          aspectRatio: targetSlot.aspectRatio,
          negativePrompt: targetSlot.negativePrompt,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Image generation failed');
      }

      if (data.imageUrl) {
        setTargetSlot((prev) => ({
          ...prev,
          generatedImageUrl: data.imageUrl,
          isGenerating: false,
        }));
      } else if (data.isFallback) {
        // Use slot sample or graceful fallback render
        setTargetSlot((prev) => ({
          ...prev,
          generatedImageUrl: prev.sampleImageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80',
          isGenerating: false,
          error: data.message,
        }));
      }
    } catch (err: any) {
      console.error('Generation error:', err);
      setTargetSlot((prev) => ({
        ...prev,
        isGenerating: false,
        error: err.message || '이미지 생성 중 오류가 발생했습니다. API 설정을 확인해주세요.',
      }));
    }
  };

  // Quick comparison comparison presets
  const loadComparisonPair = (presetAIndex: number, presetBIndex: number) => {
    const pA = PROMPT_PRESETS[presetAIndex % PROMPT_PRESETS.length];
    const pB = PROMPT_PRESETS[presetBIndex % PROMPT_PRESETS.length];

    setSlotA({
      id: 'A',
      title: pA.koreanTitle,
      prompt: pA.fullPrompt,
      negativePrompt: pA.negativePrompt || '',
      style: pA.style,
      aspectRatio: '1:1',
      sampleImageUrl: pA.sampleImageUrl,
      generatedImageUrl: undefined,
    });

    setSlotB({
      id: 'B',
      title: pB.koreanTitle,
      prompt: pB.fullPrompt,
      negativePrompt: pB.negativePrompt || '',
      style: pB.style,
      aspectRatio: '1:1',
      sampleImageUrl: pB.sampleImageUrl,
      generatedImageUrl: undefined,
    });
  };

  const imageA = slotA.generatedImageUrl || slotA.sampleImageUrl || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=900&q=80';
  const imageB = slotB.generatedImageUrl || slotB.sampleImageUrl || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80';

  return (
    <div className="space-y-8" id="compare-studio-section">
      {/* Studio Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-stone-900 dark:text-zinc-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-500" />
              프롬프트 A/B 비교 & 실시간 테스트 스튜디오
            </h2>
          </div>
          <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1">
            두 가지 프롬프트(스타일, 조명, 렌즈 설정 등)를 나란히 수정하고 시각적 차이를 직접 비교해보세요.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-100 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700">
          <button
            type="button"
            onClick={() => setViewMode('side-by-side')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'side-by-side'
                ? 'bg-white dark:bg-zinc-900 text-stone-900 dark:text-zinc-100 shadow-xs'
                : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100'
            }`}
            id="view-mode-side-btn"
          >
            <Columns className="w-3.5 h-3.5" />
            <span>나란히 비교</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('slider')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'slider'
                ? 'bg-white dark:bg-zinc-900 text-stone-900 dark:text-zinc-100 shadow-xs'
                : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100'
            }`}
            id="view-mode-slider-btn"
          >
            <Split className="w-3.5 h-3.5" />
            <span>분할 슬라이더</span>
          </button>
        </div>
      </div>

      {/* Quick Comparison Templates */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
        <span className="text-xs font-semibold text-stone-400 dark:text-zinc-500 uppercase tracking-wider shrink-0 pl-1 flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          빠른 비교 프리셋:
        </span>
        <button
          type="button"
          onClick={() => loadComparisonPair(0, 1)}
          className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-stone-700 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-800 text-xs font-medium shrink-0 transition-colors"
        >
          사이버 사무라이 vs 스튜디오 머그잔
        </button>
        <button
          type="button"
          onClick={() => loadComparisonPair(3, 4)}
          className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-stone-700 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-800 text-xs font-medium shrink-0 transition-colors"
        >
          35mm 느와르 탐정 vs 픽사 아기 여우
        </button>
        <button
          type="button"
          onClick={() => loadComparisonPair(6, 12)}
          className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-stone-700 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-800 text-xs font-medium shrink-0 transition-colors"
        >
          수채화 벚꽃 vs 스위스 미니멀 포스터
        </button>
        <button
          type="button"
          onClick={() => loadComparisonPair(2, 10)}
          className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-stone-700 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-800 text-xs font-medium shrink-0 transition-colors"
        >
          3D 아이소메트릭 카페 vs 16비트 픽셀 아트
        </button>
      </div>

      {/* Interactive Split Slider Mode */}
      {viewMode === 'slider' && (
        <div className="p-6 rounded-2xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-700 dark:text-zinc-300 uppercase tracking-wider">
              드래그하여 A / B 결과 비교하기
            </span>
            <span className="text-xs text-stone-500 font-mono">{Math.round(sliderPosition)}% / {100 - Math.round(sliderPosition)}%</span>
          </div>

          <div
            ref={sliderContainerRef}
            className="relative w-full aspect-16/9 sm:aspect-21/9 max-h-[460px] rounded-2xl overflow-hidden select-none cursor-ew-resize border border-stone-200 dark:border-zinc-800 bg-stone-950"
            onMouseDown={() => setIsDraggingSlider(true)}
            onTouchStart={() => setIsDraggingSlider(true)}
          >
            {/* Slot B Background (Right Image) */}
            <img
              src={imageB}
              alt="Slot B Result"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-violet-600/80 backdrop-blur-md text-white font-bold text-xs shadow-md">
              Slot B: {slotB.title || '프롬프트 B'}
            </div>

            {/* Slot A Foreground with Clip Path (Left Image) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={imageA}
                alt="Slot A Result"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover max-w-none"
                style={{
                  width: sliderContainerRef.current ? `${sliderContainerRef.current.clientWidth}px` : '100%',
                }}
              />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-indigo-600/80 backdrop-blur-md text-white font-bold text-xs shadow-md">
                Slot A: {slotA.title || '프롬프트 A'}
              </div>
            </div>

            {/* Draggable Divider Line & Knob */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl z-20 pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-stone-900 shadow-xl flex items-center justify-center border-2 border-indigo-600">
                <Split className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dual Prompt Editor Slots (Slot A & Slot B) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ================= SLOT A ================= */}
        <div
          className="flex flex-col rounded-2xl border-2 border-indigo-500/40 dark:border-indigo-500/30 bg-white dark:bg-zinc-900 shadow-xs overflow-hidden"
          id="compare-slot-a"
        >
          {/* Slot Header */}
          <div className="p-4 bg-indigo-50/60 dark:bg-indigo-950/40 border-b border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                A
              </span>
              <h3 className="font-bold text-sm text-stone-900 dark:text-zinc-100">
                {slotA.title || '프롬프트 슬롯 A'}
              </h3>
            </div>

            {/* Preset Selector Dropdown */}
            <div className="relative">
              <select
                onChange={(e) => {
                  const found = PROMPT_PRESETS.find((p) => p.id === e.target.value);
                  if (found) onSelectPresetToSlot(found, 'A');
                }}
                defaultValue=""
                className="text-xs px-2.5 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-zinc-900 text-stone-800 dark:text-zinc-200"
              >
                <option value="" disabled>
                  프리셋에서 불러오기...
                </option>
                {PROMPT_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.koreanTitle}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Slot Body: Image Display */}
          <div className="relative aspect-16/10 bg-stone-950 overflow-hidden group">
            <img
              src={imageA}
              alt="Slot A Render"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />

            {/* Loading Overlay */}
            {slotA.isGenerating && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4 text-center">
                <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mb-2" />
                <p className="text-sm font-semibold">Gemini 3.1 Flash Image 생성 중...</p>
                <p className="text-xs text-stone-300 mt-1">프롬프트를 정밀하게 해석하고 있습니다.</p>
              </div>
            )}

            {/* Image Overlay Controls */}
            <div className="absolute top-3 right-3 flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => setActiveModalImage(imageA)}
                className="p-1.5 rounded-lg bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition-colors"
                title="확대 보기"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Slot Content & Prompt Inputs */}
          <div className="p-4 sm:p-5 flex-1 flex flex-col space-y-4">
            {/* Title / Prompt Input */}
            <div className="space-y-1.5 flex-1">
              <label className="text-xs font-bold text-stone-700 dark:text-zinc-300 uppercase tracking-wider flex items-center justify-between">
                <span>프롬프트 (English Prompt)</span>
                <span className="text-[11px] font-normal text-stone-400 dark:text-zinc-500">
                  {slotA.prompt.length} 자
                </span>
              </label>
              <textarea
                value={slotA.prompt}
                onChange={(e) => setSlotA({ ...slotA, prompt: e.target.value })}
                rows={4}
                placeholder="영어 프롬프트를 입력하세요..."
                className="w-full p-3 rounded-xl border border-stone-200 dark:border-zinc-800 bg-stone-50 dark:bg-zinc-950 text-stone-900 dark:text-zinc-100 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                id="slot-a-prompt-input"
              />
            </div>

            {/* Parameter settings: Style & Aspect Ratio */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-stone-500 dark:text-zinc-400 block mb-1">
                  스타일 태그
                </label>
                <select
                  value={slotA.style}
                  onChange={(e) => setSlotA({ ...slotA, style: e.target.value as PromptStyle })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-stone-800 dark:text-zinc-200"
                >
                  {STYLES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-stone-500 dark:text-zinc-400 block mb-1">
                  종횡비 (Aspect Ratio)
                </label>
                <select
                  value={slotA.aspectRatio}
                  onChange={(e) =>
                    setSlotA({ ...slotA, aspectRatio: e.target.value as '1:1' | '16:9' | '9:16' | '4:3' })
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-stone-800 dark:text-zinc-200 font-mono"
                >
                  <option value="1:1">1:1 (정사각형)</option>
                  <option value="16:9">16:9 (와이드)</option>
                  <option value="9:16">9:16 (세로/숏폼)</option>
                  <option value="4:3">4:3 (표준)</option>
                </select>
              </div>
            </div>

            {/* Error Message notice if any */}
            {slotA.error && (
              <div className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                <span>{slotA.error}</span>
              </div>
            )}

            {/* Slot A Action Buttons */}
            <div className="flex items-center gap-2 pt-2 border-t border-stone-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => {
                  onCopy(slotA.prompt, `Slot A: ${slotA.title || '프롬프트'}`);
                  setCopiedA(true);
                  setTimeout(() => setCopiedA(false), 2000);
                }}
                className="flex-1 py-2 px-3 rounded-xl border border-stone-200 dark:border-zinc-800 bg-stone-50 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                id="copy-slot-a-btn"
              >
                {copiedA ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedA ? '복사됨' : '프롬프트 복사'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleGenerateImage('A')}
                disabled={slotA.isGenerating}
                className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-[0.98]"
                id="generate-slot-a-btn"
              >
                {slotA.isGenerating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>생성 중...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI 이미지 생성</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ================= SLOT B ================= */}
        <div
          className="flex flex-col rounded-2xl border-2 border-violet-500/40 dark:border-violet-500/30 bg-white dark:bg-zinc-900 shadow-xs overflow-hidden"
          id="compare-slot-b"
        >
          {/* Slot Header */}
          <div className="p-4 bg-violet-50/60 dark:bg-violet-950/40 border-b border-violet-100 dark:border-violet-900/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-violet-600 text-white font-bold text-xs flex items-center justify-center">
                B
              </span>
              <h3 className="font-bold text-sm text-stone-900 dark:text-zinc-100">
                {slotB.title || '프롬프트 슬롯 B'}
              </h3>
            </div>

            {/* Preset Selector Dropdown */}
            <div className="relative">
              <select
                onChange={(e) => {
                  const found = PROMPT_PRESETS.find((p) => p.id === e.target.value);
                  if (found) onSelectPresetToSlot(found, 'B');
                }}
                defaultValue=""
                className="text-xs px-2.5 py-1.5 rounded-lg border border-violet-200 dark:border-violet-800 bg-white dark:bg-zinc-900 text-stone-800 dark:text-zinc-200"
              >
                <option value="" disabled>
                  프리셋에서 불러오기...
                </option>
                {PROMPT_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.koreanTitle}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Slot Body: Image Display */}
          <div className="relative aspect-16/10 bg-stone-950 overflow-hidden group">
            <img
              src={imageB}
              alt="Slot B Render"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />

            {/* Loading Overlay */}
            {slotB.isGenerating && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4 text-center">
                <Loader2 className="w-8 h-8 text-violet-400 animate-spin mb-2" />
                <p className="text-sm font-semibold">Gemini 3.1 Flash Image 생성 중...</p>
                <p className="text-xs text-stone-300 mt-1">프롬프트를 정밀하게 해석하고 있습니다.</p>
              </div>
            )}

            {/* Image Overlay Controls */}
            <div className="absolute top-3 right-3 flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => setActiveModalImage(imageB)}
                className="p-1.5 rounded-lg bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition-colors"
                title="확대 보기"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Slot Content & Prompt Inputs */}
          <div className="p-4 sm:p-5 flex-1 flex flex-col space-y-4">
            {/* Title / Prompt Input */}
            <div className="space-y-1.5 flex-1">
              <label className="text-xs font-bold text-stone-700 dark:text-zinc-300 uppercase tracking-wider flex items-center justify-between">
                <span>프롬프트 (English Prompt)</span>
                <span className="text-[11px] font-normal text-stone-400 dark:text-zinc-500">
                  {slotB.prompt.length} 자
                </span>
              </label>
              <textarea
                value={slotB.prompt}
                onChange={(e) => setSlotB({ ...slotB, prompt: e.target.value })}
                rows={4}
                placeholder="영어 프롬프트를 입력하세요..."
                className="w-full p-3 rounded-xl border border-stone-200 dark:border-zinc-800 bg-stone-50 dark:bg-zinc-950 text-stone-900 dark:text-zinc-100 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 resize-none"
                id="slot-b-prompt-input"
              />
            </div>

            {/* Parameter settings: Style & Aspect Ratio */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-stone-500 dark:text-zinc-400 block mb-1">
                  스타일 태그
                </label>
                <select
                  value={slotB.style}
                  onChange={(e) => setSlotB({ ...slotB, style: e.target.value as PromptStyle })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-stone-800 dark:text-zinc-200"
                >
                  {STYLES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-stone-500 dark:text-zinc-400 block mb-1">
                  종횡비 (Aspect Ratio)
                </label>
                <select
                  value={slotB.aspectRatio}
                  onChange={(e) =>
                    setSlotB({ ...slotB, aspectRatio: e.target.value as '1:1' | '16:9' | '9:16' | '4:3' })
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-stone-800 dark:text-zinc-200 font-mono"
                >
                  <option value="1:1">1:1 (정사각형)</option>
                  <option value="16:9">16:9 (와이드)</option>
                  <option value="9:16">9:16 (세로/숏폼)</option>
                  <option value="4:3">4:3 (표준)</option>
                </select>
              </div>
            </div>

            {/* Error Message notice if any */}
            {slotB.error && (
              <div className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                <span>{slotB.error}</span>
              </div>
            )}

            {/* Slot B Action Buttons */}
            <div className="flex items-center gap-2 pt-2 border-t border-stone-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => {
                  onCopy(slotB.prompt, `Slot B: ${slotB.title || '프롬프트'}`);
                  setCopiedB(true);
                  setTimeout(() => setCopiedB(false), 2000);
                }}
                className="flex-1 py-2 px-3 rounded-xl border border-stone-200 dark:border-zinc-800 bg-stone-50 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                id="copy-slot-b-btn"
              >
                {copiedB ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedB ? '복사됨' : '프롬프트 복사'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleGenerateImage('B')}
                disabled={slotB.isGenerating}
                className="flex-1 py-2 px-3 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-[0.98]"
                id="generate-slot-b-btn"
              >
                {slotB.isGenerating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>생성 중...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI 이미지 생성</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Zoom Lightbox Modal */}
      {activeModalImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setActiveModalImage(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
            <img
              src={activeModalImage}
              alt="Zoomed comparison"
              referrerPolicy="no-referrer"
              className="max-h-[80vh] w-auto rounded-2xl object-contain shadow-2xl border border-white/20"
            />
            <button
              type="button"
              onClick={() => setActiveModalImage(null)}
              className="mt-4 px-5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold backdrop-blur-md transition-colors"
            >
              닫기 (Close)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
