import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Bookmark,
  Layers,
  Sparkles,
  Camera,
  SunMedium,
  ShieldAlert,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import { PromptItem } from '../types';

interface PromptDetailModalProps {
  prompt: PromptItem | null;
  onClose: () => void;
  onCopy: (text: string, title: string) => void;
  onSendToCompare: (prompt: PromptItem, slot: 'A' | 'B') => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const PromptDetailModal: React.FC<PromptDetailModalProps> = ({
  prompt,
  onClose,
  onCopy,
  onSendToCompare,
  isFavorite,
  onToggleFavorite,
}) => {
  if (!prompt) return null;

  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedNegative, setCopiedNegative] = useState(false);
  const [includeMidjourneyFlags, setIncludeMidjourneyFlags] = useState(false);
  const [customValues, setCustomValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    prompt.variables.forEach((v) => {
      initial[v.key] = v.defaultValue;
    });
    return initial;
  });

  const getSynthesizedPrompt = (): string => {
    let result = prompt.fullPrompt;
    prompt.variables.forEach((v) => {
      const currentVal = customValues[v.key] || v.defaultValue;
      if (currentVal && v.defaultValue && currentVal !== v.defaultValue) {
        result = result.replace(v.defaultValue, currentVal);
      }
    });

    if (includeMidjourneyFlags) {
      result += ` --ar ${prompt.recommendedAspectRatio.replace(':', ':')} --v 6.0 --stylize 250`;
    }

    return result;
  };

  const handleCopyPrompt = () => {
    const text = getSynthesizedPrompt();
    onCopy(text, prompt.koreanTitle);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleCopyNegative = () => {
    if (prompt.negativePrompt) {
      onCopy(prompt.negativePrompt, `${prompt.koreanTitle} (Negative Prompt)`);
      setCopiedNegative(true);
      setTimeout(() => setCopiedNegative(false), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto"
      id="prompt-detail-modal-overlay"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-stone-900 dark:text-zinc-100 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        id="prompt-detail-modal"
      >
        {/* Header Modal Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-zinc-800 bg-stone-50/60 dark:bg-zinc-950/60">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
              {prompt.category}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300">
              {prompt.style}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleFavorite(prompt.id)}
              className={`p-2 rounded-xl border transition-colors ${
                isFavorite
                  ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400'
                  : 'border-stone-200 dark:border-zinc-800 text-stone-500 hover:bg-stone-100 dark:hover:bg-zinc-800'
              }`}
              id="modal-favorite-btn"
              title="즐겨찾기"
            >
              <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-amber-500 text-amber-500' : ''}`} />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl border border-stone-200 dark:border-zinc-800 text-stone-500 hover:bg-stone-100 dark:hover:bg-zinc-800 hover:text-stone-900 dark:hover:text-zinc-100 transition-colors"
              id="modal-close-btn"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main Grid: Image & Key Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Image Preview */}
            <div className="rounded-2xl overflow-hidden border border-stone-200 dark:border-zinc-800 bg-stone-100 dark:bg-zinc-950">
              <img
                src={prompt.sampleImageUrl}
                alt={prompt.title}
                referrerPolicy="no-referrer"
                className="w-full h-auto object-cover max-h-[380px]"
              />
              <div className="p-3 bg-stone-50 dark:bg-zinc-950/80 text-[11px] text-stone-500 dark:text-zinc-400 flex items-center justify-between border-t border-stone-200 dark:border-zinc-800">
                <span>추천 종횡비: <strong className="font-mono text-stone-800 dark:text-zinc-200">{prompt.recommendedAspectRatio}</strong></span>
                <span>복사 횟수: {prompt.copiedCount.toLocaleString()}회</span>
              </div>
            </div>

            {/* Prompt Header & Korean Description */}
            <div className="space-y-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-zinc-100">
                  {prompt.koreanTitle}
                </h2>
                <p className="text-xs text-stone-500 dark:text-zinc-400 font-mono mt-1">
                  {prompt.title}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 dark:bg-zinc-950/60 border border-stone-200 dark:border-zinc-800/80 text-sm text-stone-700 dark:text-zinc-300 leading-relaxed">
                <p className="font-medium text-stone-900 dark:text-zinc-100 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  프롬프트 설명
                </p>
                {prompt.koreanDescription}
              </div>

              {/* Technical Spec Chips */}
              <div className="grid grid-cols-1 gap-2.5 text-xs">
                {prompt.lighting && (
                  <div className="p-3 rounded-xl border border-stone-200 dark:border-zinc-800/80 bg-stone-50/50 dark:bg-zinc-950/40 flex items-start gap-2.5">
                    <SunMedium className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block text-stone-800 dark:text-zinc-200">조명 기법</span>
                      <span className="text-stone-600 dark:text-zinc-400">{prompt.lighting}</span>
                    </div>
                  </div>
                )}

                {prompt.camera && (
                  <div className="p-3 rounded-xl border border-stone-200 dark:border-zinc-800/80 bg-stone-50/50 dark:bg-zinc-950/40 flex items-start gap-2.5">
                    <Camera className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block text-stone-800 dark:text-zinc-200">카메라 / 렌즈 설정</span>
                      <span className="text-stone-600 dark:text-zinc-400">{prompt.camera}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Model compatibility */}
              <div>
                <span className="text-xs font-semibold text-stone-400 dark:text-zinc-500 uppercase tracking-wider block mb-2">
                  호환 AI 모델:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {prompt.targetModels.map((m, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md text-xs font-medium bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Variable Tuning Section */}
          {prompt.variables && prompt.variables.length > 0 && (
            <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/30 dark:bg-indigo-950/20 space-y-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h4 className="text-sm font-bold text-stone-900 dark:text-zinc-100">
                  변수 실시간 커스텀
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {prompt.variables.map((v) => (
                  <div key={v.key} className="space-y-1">
                    <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300">
                      {v.label}
                    </label>
                    {v.options ? (
                      <select
                        value={customValues[v.key] || v.defaultValue}
                        onChange={(e) =>
                          setCustomValues({ ...customValues, [v.key]: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-stone-800 dark:text-zinc-200 text-xs"
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
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-stone-800 dark:text-zinc-200 text-xs"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full Prompt Text Block */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-700 dark:text-zinc-300 uppercase tracking-wider">
                최종 프롬프트 (Prompt Code)
              </label>

              <label className="flex items-center gap-2 text-xs text-stone-600 dark:text-zinc-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeMidjourneyFlags}
                  onChange={(e) => setIncludeMidjourneyFlags(e.target.checked)}
                  className="rounded border-stone-300 dark:border-zinc-700 text-indigo-600 focus:ring-indigo-500"
                />
                <span>미드저니 파라미터 (--ar --v 6.0) 포함</span>
              </label>
            </div>

            <div className="relative">
              <pre className="p-4 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 text-stone-800 dark:text-zinc-200 font-mono text-xs leading-relaxed whitespace-pre-wrap select-all">
                {getSynthesizedPrompt()}
              </pre>
            </div>
          </div>

          {/* Negative Prompt (if available) */}
          {prompt.negativePrompt && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  네거티브 프롬프트 (Negative Prompt)
                </label>
                <button
                  type="button"
                  onClick={handleCopyNegative}
                  className="text-xs text-stone-500 hover:text-stone-900 dark:text-zinc-400 dark:hover:text-zinc-100 flex items-center gap-1"
                >
                  {copiedNegative ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedNegative ? '복사 완료' : '네거티브 복사'}</span>
                </button>
              </div>

              <div className="p-3 rounded-xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 text-stone-700 dark:text-zinc-300 font-mono text-xs">
                {prompt.negativePrompt}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions: Copy & Send to Compare */}
        <div className="px-6 py-4 border-t border-stone-200 dark:border-zinc-800 bg-stone-50/60 dark:bg-zinc-950/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-stone-500 dark:text-zinc-400">
              비교 스튜디오:
            </span>
            <button
              type="button"
              onClick={() => {
                onSendToCompare(prompt, 'A');
                onClose();
              }}
              className="flex-1 sm:flex-none px-3 py-2 rounded-xl border border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              id="modal-send-a"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>슬롯 A로 보내기</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onSendToCompare(prompt, 'B');
                onClose();
              }}
              className="flex-1 sm:flex-none px-3 py-2 rounded-xl border border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-violet-50 dark:hover:bg-violet-950/60 hover:text-violet-600 dark:hover:text-violet-400 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              id="modal-send-b"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>슬롯 B로 보내기</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopyPrompt}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-xs ${
              copiedPrompt
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-900 dark:bg-stone-100 text-white dark:text-zinc-950 hover:bg-stone-800 dark:hover:bg-white'
            }`}
            id="modal-copy-btn"
          >
            {copiedPrompt ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>복사되었습니다!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>프롬프트 복사하기</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
