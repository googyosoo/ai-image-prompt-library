import React, { useState, useEffect } from 'react';
import { KeyRound, X, Check, ExternalLink, ShieldCheck, AlertCircle, Trash2 } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveKey: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveKey,
}) => {
  const [inputKey, setInputKey] = useState('');
  const [showSavedToast, setShowSavedToast] = useState(false);

  useEffect(() => {
    setInputKey(apiKey || '');
  }, [apiKey, isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = inputKey.trim();
    onSaveKey(cleanKey);
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
      onClose();
    }, 1200);
  };

  const handleDelete = () => {
    setInputKey('');
    onSaveKey('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-2xl space-y-5"
        role="dialog"
        aria-modal="true"
        aria-labelledby="api-key-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 id="api-key-modal-title" className="text-base font-bold text-stone-900 dark:text-zinc-100">
                Gemini API 키 설정 (BYOK)
              </h2>
              <p className="text-xs text-stone-500 dark:text-zinc-400">
                본인 전용 API 키를 직접 등록하여 사용합니다
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-zinc-200 hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="닫기"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Security Notice */}
        <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-xs text-indigo-950 dark:text-indigo-200 space-y-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-indigo-700 dark:text-indigo-300">
            <ShieldCheck className="w-4 h-4" />
            <span>BYOK (Bring Your Own Key) 보안 안내</span>
          </div>
          <p className="text-[11px] leading-relaxed text-indigo-800/80 dark:text-indigo-300/80">
            입력하신 API 키는 서버 데이터베이스에 영구 저장되지 않으며, 오직 본인 브라우저(로컬 스토리지)에만 안전하게 보관됩니다.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300 flex items-center justify-between">
              <span>Google Gemini API Key</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
              >
                무료 키 발급받기 <ExternalLink className="w-3 h-3" />
              </a>
            </label>
            <input
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-zinc-800 bg-stone-50 dark:bg-zinc-950 text-stone-900 dark:text-zinc-100 placeholder-stone-400 dark:placeholder-zinc-600 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              autoComplete="off"
            />
            <p className="text-[10px] text-stone-400 dark:text-zinc-500">
              * 키를 등록하지 않으셔도 스마트 프리뷰 데모 모드로 프롬프트 생성과 비교를 자유롭게 체험하실 수 있습니다.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2">
            {apiKey && (
              <button
                type="button"
                onClick={handleDelete}
                className="p-2.5 rounded-xl border border-stone-200 dark:border-zinc-800 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold transition-colors flex items-center gap-1.5"
                title="등록된 키 삭제"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>삭제</span>
              </button>
            )}

            <button
              type="submit"
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                showSavedToast
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-stone-900 dark:bg-stone-100 text-white dark:text-zinc-950 hover:bg-stone-800 dark:hover:bg-white'
              }`}
            >
              {showSavedToast ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>키가 저장되었습니다!</span>
                </>
              ) : (
                <span>API 키 저장하기</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
