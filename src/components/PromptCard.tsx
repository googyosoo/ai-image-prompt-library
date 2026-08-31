import React, { useState } from 'react';
import {
  Copy,
  Check,
  Bookmark,
  SlidersHorizontal,
  Layers,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Share2
} from 'lucide-react';
import { PromptItem } from '../types';

interface PromptCardProps {
  prompt: PromptItem;
  onCopy: (text: string, title: string) => void;
  onSendToCompare: (prompt: PromptItem, slot: 'A' | 'B') => void;
  onOpenDetail: (prompt: PromptItem) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const PromptCard: React.FC<PromptCardProps> = ({
  prompt,
  onCopy,
  onSendToCompare,
  onOpenDetail,
  isFavorite,
  onToggleFavorite,
}) => {
  const [copied, setCopied] = useState(false);
  const [showVariables, setShowVariables] = useState(false);
  const [customValues, setCustomValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    prompt.variables.forEach((v) => {
      initial[v.key] = v.defaultValue;
    });
    return initial;
  });

  // Calculate synthesized prompt based on current variable selections
  const getSynthesizedPrompt = (): string => {
    let result = prompt.fullPrompt;
    prompt.variables.forEach((v) => {
      const currentVal = customValues[v.key] || v.defaultValue;
      if (currentVal && v.defaultValue && currentVal !== v.defaultValue) {
        // Replace default phrase with customized phrase if changed
        result = result.replace(v.defaultValue, currentVal);
      }
    });
    return result;
  };

  const handleCopyPrompt = (e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = getSynthesizedPrompt();
    onCopy(textToCopy, prompt.koreanTitle);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="group relative flex flex-col rounded-2xl border border-stone-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/90 overflow-hidden shadow-xs hover:shadow-md hover:border-stone-300 dark:hover:border-zinc-700 transition-all duration-200"
      id={`prompt-card-${prompt.id}`}
    >
      {/* Sample Image Preview Banner */}
      <div
        className="relative aspect-16/10 w-full overflow-hidden bg-stone-100 dark:bg-zinc-800 cursor-pointer"
        onClick={() => onOpenDetail(prompt)}
      >
        <img
          src={prompt.sampleImageUrl}
          alt={prompt.title}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient Overlay for badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/60 backdrop-blur-md text-white border border-white/10">
              {prompt.category}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-500/80 backdrop-blur-md text-white">
              {prompt.style}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* Bookmark Favorite Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(prompt.id);
              }}
              className={`p-1.5 rounded-full backdrop-blur-md transition-all ${
                isFavorite
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-black/50 text-white/80 hover:text-white hover:bg-black/70'
              }`}
              id={`fav-btn-${prompt.id}`}
              title={isFavorite ? '즐겨찾기 해제' : '즐겨찾기에 추가'}
              aria-label="즐겨찾기"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isFavorite ? 'fill-white' : ''}`} />
            </button>

            {/* Quick Detail View Trigger */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetail(prompt);
              }}
              className="p-1.5 rounded-full bg-black/50 text-white/80 hover:text-white hover:bg-black/70 backdrop-blur-md transition-colors"
              title="크게 보기"
              aria-label="상세보기"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom Banner Title Overlay */}
        <div className="absolute bottom-2.5 left-3 right-3 text-white pointer-events-none">
          <h3 className="text-sm sm:text-base font-bold leading-tight drop-shadow-xs line-clamp-1">
            {prompt.koreanTitle}
          </h3>
          <p className="text-[11px] text-white/80 line-clamp-1 font-mono tracking-tight">
            {prompt.title}
          </p>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="flex-1 flex flex-col p-4 sm:p-5">
        {/* Short Korean Description */}
        <p className="text-xs text-stone-600 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-3">
          {prompt.koreanDescription}
        </p>

        {/* Prompt Code Container */}
        <div className="relative mb-3 flex-1">
          <div className="p-3 rounded-xl bg-stone-50 dark:bg-zinc-950/70 border border-stone-200 dark:border-zinc-800 text-stone-800 dark:text-zinc-300 font-mono text-xs leading-relaxed max-h-28 overflow-y-auto select-all">
            {getSynthesizedPrompt()}
          </div>
        </div>

        {/* Variables Customizer Accordion (if prompt has variables) */}
        {prompt.variables && prompt.variables.length > 0 && (
          <div className="mb-3">
            <button
              type="button"
              onClick={() => setShowVariables(!showVariables)}
              className="flex items-center justify-between w-full py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
              id={`toggle-vars-${prompt.id}`}
            >
              <span className="flex items-center gap-1.5">
                <SlidersHorizontal className="w-3 h-3" />
                변수 커스텀 ({prompt.variables.length}개)
              </span>
              {showVariables ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {showVariables && (
              <div className="mt-2 space-y-2 p-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800/80 text-xs">
                {prompt.variables.map((v) => (
                  <div key={v.key} className="space-y-1">
                    <label className="text-[11px] font-medium text-stone-500 dark:text-zinc-400 block">
                      {v.label}
                    </label>
                    {v.options ? (
                      <select
                        value={customValues[v.key] || v.defaultValue}
                        onChange={(e) =>
                          setCustomValues({ ...customValues, [v.key]: e.target.value })
                        }
                        className="w-full px-2 py-1.5 rounded-lg border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-stone-800 dark:text-zinc-200 text-xs"
                      >
                        {v.options.map((opt, idx) => (
                          <option key={idx} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={customValues[v.key] || v.defaultValue}
                        onChange={(e) =>
                          setCustomValues({ ...customValues, [v.key]: e.target.value })
                        }
                        className="w-full px-2 py-1 rounded-lg border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-stone-800 dark:text-zinc-200 text-xs"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Model Compatibility Badges & Ratio */}
        <div className="flex items-center justify-between gap-1 mb-4 text-[11px] text-stone-500 dark:text-zinc-400">
          <div className="flex items-center gap-1 overflow-hidden">
            <span className="font-semibold text-stone-400 dark:text-zinc-500">추천:</span>
            <span className="px-1.5 py-0.5 rounded-md bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300 font-mono">
              {prompt.recommendedAspectRatio}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-stone-400 dark:text-zinc-500">
              복사 {prompt.copiedCount.toLocaleString()}회
            </span>
          </div>
        </div>

        {/* Action Button Row: One-Click Copy & Compare Send */}
        <div className="flex items-center gap-2 pt-2 border-t border-stone-100 dark:border-zinc-800">
          {/* Primary One-Click Copy Button */}
          <button
            type="button"
            onClick={handleCopyPrompt}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
              copied
                ? 'bg-emerald-600 text-white shadow-xs scale-[0.98]'
                : 'bg-stone-900 dark:bg-stone-100 text-white dark:text-zinc-950 hover:bg-stone-800 dark:hover:bg-white shadow-xs active:scale-[0.98]'
            }`}
            id={`copy-btn-${prompt.id}`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>복사 완료!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>프롬프트 복사</span>
              </>
            )}
          </button>

          {/* Send to Compare Studio Slot Picker */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSendToCompare(prompt, 'A');
              }}
              title="비교 슬롯 A로 보내기"
              className="px-2.5 py-2.5 rounded-xl border border-stone-200 dark:border-zinc-800 bg-stone-50 dark:bg-zinc-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-stone-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 dark:hover:border-indigo-800 text-xs font-semibold transition-colors flex items-center gap-1"
              id={`send-compare-a-${prompt.id}`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>A</span>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSendToCompare(prompt, 'B');
              }}
              title="비교 슬롯 B로 보내기"
              className="px-2.5 py-2.5 rounded-xl border border-stone-200 dark:border-zinc-800 bg-stone-50 dark:bg-zinc-800/60 hover:bg-violet-50 dark:hover:bg-violet-950/60 text-stone-700 dark:text-zinc-300 hover:text-violet-600 dark:hover:text-violet-400 hover:border-violet-200 dark:hover:border-violet-800 text-xs font-semibold transition-colors flex items-center gap-1"
              id={`send-compare-b-${prompt.id}`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>B</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
