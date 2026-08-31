import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md transition-colors ${
                isSuccess
                  ? 'bg-white/95 dark:bg-zinc-900/95 border-emerald-500/30 text-stone-900 dark:text-zinc-100 shadow-emerald-500/5'
                  : isError
                  ? 'bg-white/95 dark:bg-zinc-900/95 border-rose-500/30 text-stone-900 dark:text-zinc-100 shadow-rose-500/5'
                  : 'bg-white/95 dark:bg-zinc-900/95 border-stone-200 dark:border-zinc-800 text-stone-900 dark:text-zinc-100'
              }`}
              id={`toast-${toast.id}`}
            >
              <div className="mt-0.5 shrink-0">
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                {isError && <AlertCircle className="w-5 h-5 text-rose-500" />}
                {!isSuccess && !isError && <Info className="w-5 h-5 text-indigo-500" />}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold leading-tight">{toast.title}</p>
                {toast.description && (
                  <p className="text-xs text-stone-600 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                    {toast.description}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => onDismiss(toast.id)}
                className="text-stone-400 hover:text-stone-600 dark:text-zinc-500 dark:hover:text-zinc-300 p-1 rounded-lg transition-colors shrink-0"
                id={`toast-close-${toast.id}`}
                aria-label="닫기"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
