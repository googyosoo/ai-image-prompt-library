import React, { useState } from 'react';
import {
  Wand2,
  Sparkles,
  Copy,
  Check,
  Layers,
  ArrowRight,
  Loader2,
  Sliders,
  Send,
  HelpCircle,
} from 'lucide-react';
import { PromptStyle, UseCaseCategory, AIModelType } from '../types';
import { STYLES, CATEGORIES, AI_MODELS } from '../data/promptsData';

interface PromptRemixerProps {
  onCopy: (text: string, title: string) => void;
  onSendToCompare: (promptText: string, title: string, slot: 'A' | 'B') => void;
}

export const PromptRemixer: React.FC<PromptRemixerProps> = ({
  onCopy,
  onSendToCompare,
}) => {
  const [ideaText, setIdeaText] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<PromptStyle>('Cinematic / Film');
  const [selectedCategory, setSelectedCategory] = useState<UseCaseCategory>('Profile / Avatar');
  const [selectedModel, setSelectedModel] = useState<AIModelType>('Nano Banana (Gemini)');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [generatedResult, setGeneratedResult] = useState<{
    enhancedPrompt: string;
    koreanTitle: string;
    koreanDescription: string;
    suggestedAspectRatio?: string;
    lighting?: string;
    camera?: string;
    negativePrompt?: string;
  } | null>({
    enhancedPrompt:
      'Ultra-detailed 8k cinematic shot of a glowing ethereal astronaut drifting in a pastel pink and violet interstellar nebula, cosmic dust particles catching soft star light, anamorphic lens flare, Hasselblad 50mm f/1.2, photorealistic, octane render.',
    koreanTitle: '파스텔 우주 성운을 유영하는 신비로운 우주비행사',
    koreanDescription: '부드러운 별빛과 파스텔 핑크/바이올렛 성운 입자가 흩날리는 시네마틱 SF 우주비행사 프롬프트입니다.',
    suggestedAspectRatio: '16:9',
    lighting: 'Bioluminescent star dust & soft cosmic rim light',
    camera: 'Hasselblad 50mm f/1.2, anamorphic flare',
    negativePrompt: 'blurry, low quality, cartoonish, oversaturated, deformed anatomy',
  });

  const handleRemix = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaText.trim()) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea: ideaText,
          style: selectedStyle,
          category: selectedCategory,
          targetModel: selectedModel,
        }),
      });

      const data = await response.json();
      if (data && data.enhancedPrompt) {
        setGeneratedResult(data);
      }
    } catch (err) {
      console.error('Enhance error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleIdeas = [
    '비 내리는 네온 골목길에서 라멘을 먹고 있는 귀여운 아기 판다',
    '트래버틴 대리석 위의 럭셔리 유기농 스킨케어 앰플 병',
    '3D 픽사 스타일로 만든 작은 배낭을 멘 모험가 아기 여우',
    '스위스 국제 스타일의 미니멀리즘 기하학 타이포그래피 포스터',
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8" id="prompt-remixer-section">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Wand2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900 dark:text-zinc-100">
              AI 프롬프트 스마트 리믹서 (Content Remix)
            </h2>
            <p className="text-xs text-stone-500 dark:text-zinc-400 mt-0.5">
              원하는 아이디어, 한국어 설명, 또는 기사 내용을 입력하면 YouMind 프롬프트 엔지니어링 규칙에 맞춘 전문가용 영문 프롬프트로 변환합니다.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Form Panel */}
        <div className="lg:col-span-6 rounded-2xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-5 shadow-xs">
          <form onSubmit={handleRemix} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-stone-700 dark:text-zinc-300 uppercase tracking-wider block mb-2">
                아이디어 / 묘사 입력 (한국어 또는 영어)
              </label>
              <textarea
                value={ideaText}
                onChange={(e) => setIdeaText(e.target.value)}
                rows={4}
                placeholder="예: 비 내리는 서울 야경을 배경으로 빛나는 바이저를 쓴 사이버펑크 고양이 전사..."
                className="w-full p-3.5 rounded-xl border border-stone-200 dark:border-zinc-800 bg-stone-50 dark:bg-zinc-950 text-stone-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none shadow-xs"
                id="remix-idea-input"
              />
            </div>

            {/* Quick Inspiration Chips */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-stone-400 dark:text-zinc-500">
                추천 아이디어 예시 클릭:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {sampleIdeas.map((idea, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setIdeaText(idea)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300 hover:bg-stone-200 dark:hover:bg-zinc-700 transition-colors text-left"
                  >
                    {idea}
                  </button>
                ))}
              </div>
            </div>

            {/* Parameter Selectors */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-xs font-medium text-stone-600 dark:text-zinc-400 block mb-1">
                  스타일 선택
                </label>
                <select
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value as PromptStyle)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-stone-800 dark:text-zinc-200"
                >
                  {STYLES.filter((s) => s.id !== 'All').map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-stone-600 dark:text-zinc-400 block mb-1">
                  카테고리
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as UseCaseCategory)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-stone-800 dark:text-zinc-200"
                >
                  {CATEGORIES.filter((c) => c.id !== 'All').map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Remix Button */}
            <button
              type="submit"
              disabled={isLoading || !ideaText.trim()}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 disabled:opacity-50 text-white font-semibold text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
              id="submit-remix-btn"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Gemini가 프롬프트를 리믹스하고 있습니다...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>전문가용 프롬프트 리믹스 생성</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Output Result Card */}
        <div className="lg:col-span-6 space-y-4">
          {generatedResult && (
            <div className="rounded-2xl border-2 border-amber-500/30 dark:border-amber-500/20 bg-white dark:bg-zinc-900 p-6 space-y-5 shadow-md">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-zinc-800">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                  ✨ AI 리믹스 완성
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      onSendToCompare(generatedResult.enhancedPrompt, generatedResult.koreanTitle, 'A');
                    }}
                    className="px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-zinc-800 text-xs font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>비교 A</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onSendToCompare(generatedResult.enhancedPrompt, generatedResult.koreanTitle, 'B');
                    }}
                    className="px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-zinc-800 text-xs font-semibold hover:bg-violet-50 dark:hover:bg-violet-950/60 hover:text-violet-600 dark:hover:text-violet-400 transition-colors flex items-center gap-1"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>비교 B</span>
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-zinc-100">
                  {generatedResult.koreanTitle}
                </h3>
                <p className="text-xs text-stone-600 dark:text-zinc-400 mt-1 leading-relaxed">
                  {generatedResult.koreanDescription}
                </p>
              </div>

              {/* Full English Prompt */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 dark:text-zinc-300 uppercase tracking-wider">
                  생성된 영문 프롬프트 (English Prompt)
                </label>
                <div className="p-4 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 text-stone-800 dark:text-zinc-200 font-mono text-xs leading-relaxed select-all">
                  {generatedResult.enhancedPrompt}
                </div>
              </div>

              {/* Specs */}
              {(generatedResult.lighting || generatedResult.camera) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {generatedResult.lighting && (
                    <div className="p-2.5 rounded-lg bg-stone-50 dark:bg-zinc-950/60 border border-stone-200 dark:border-zinc-800">
                      <span className="font-semibold block text-stone-700 dark:text-zinc-300">조명 설정:</span>
                      <span className="text-stone-500 dark:text-zinc-400">{generatedResult.lighting}</span>
                    </div>
                  )}
                  {generatedResult.camera && (
                    <div className="p-2.5 rounded-lg bg-stone-50 dark:bg-zinc-950/60 border border-stone-200 dark:border-zinc-800">
                      <span className="font-semibold block text-stone-700 dark:text-zinc-300">카메라/엔진:</span>
                      <span className="text-stone-500 dark:text-zinc-400">{generatedResult.camera}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Copy Button */}
              <button
                type="button"
                onClick={() => {
                  onCopy(generatedResult.enhancedPrompt, generatedResult.koreanTitle);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className={`w-full py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-900 dark:bg-stone-100 text-white dark:text-zinc-950 hover:bg-stone-800 dark:hover:bg-white'
                }`}
                id="copy-remix-result-btn"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>클립보드에 복사 완료!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>프롬프트 원클릭 복사</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
