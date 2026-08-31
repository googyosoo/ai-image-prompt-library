import React from 'react';
import { Sparkles, SlidersHorizontal, Wand2, Sun, Moon, Bookmark, Compass, Blocks, Scan } from 'lucide-react';
import { ActiveTab } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  favoritesCount: number;
  showFavoritesOnly: boolean;
  setShowFavoritesOnly: (val: boolean) => void;
  totalPromptsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isDarkMode,
  setIsDarkMode,
  favoritesCount,
  showFavoritesOnly,
  setShowFavoritesOnly,
  totalPromptsCount,
}) => {
  return (
    <header
      className="sticky top-0 z-40 border-b border-stone-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md transition-colors"
      id="main-header"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo and title */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setActiveTab('library');
                setShowFavoritesOnly(false);
              }}
              className="flex items-center gap-3 text-left group"
              id="header-logo-btn"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-bold tracking-tight text-stone-900 dark:text-zinc-100">
                    AI Prompt Studio
                  </h1>
                  <span className="hidden sm:inline-flex px-2 py-0.5 text-[11px] font-semibold rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
                    YouMind Skill
                  </span>
                </div>
                <p className="text-xs text-stone-500 dark:text-zinc-400 hidden sm:block">
                  원클릭 복사 & A/B 프롬프트 비교 스튜디오
                </p>
              </div>
            </button>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2" id="main-navigation">
            <button
              type="button"
              onClick={() => setActiveTab('library')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'library'
                  ? 'bg-stone-100 dark:bg-zinc-800 text-stone-900 dark:text-zinc-100 font-semibold shadow-xs'
                  : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 hover:bg-stone-50 dark:hover:bg-zinc-900'
              }`}
              id="nav-library-btn"
            >
              <Compass className="w-4 h-4 text-indigo-500" />
              <span>프롬프트 보관소</span>
              <span className="hidden md:inline-flex text-[11px] px-1.5 py-0.5 rounded-full bg-stone-200 dark:bg-zinc-700 text-stone-700 dark:text-zinc-300 font-semibold">
                {totalPromptsCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('wizard')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'wizard'
                  ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-semibold border border-amber-300 dark:border-amber-700 shadow-xs'
                  : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 hover:bg-stone-50 dark:hover:bg-zinc-900'
              }`}
              id="nav-wizard-btn"
            >
              <Wand2 className="w-4 h-4 text-amber-500" />
              <span className="font-bold">프롬프트 마법사</span>
              <span className="hidden md:inline-flex text-[10px] px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold shadow-xs">
                초보자 추천
              </span>
            </button>


            <button
              type="button"
              onClick={() => setActiveTab('vision')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'vision'
                  ? 'bg-stone-100 dark:bg-zinc-800 text-stone-900 dark:text-zinc-100 font-semibold shadow-xs'
                  : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 hover:bg-stone-50 dark:hover:bg-zinc-900'
              }`}
              id="nav-vision-btn"
            >
              <Scan className="w-4 h-4 text-sky-500" />
              <span className="hidden sm:inline">비전 역공학</span>
              <span className="sm:hidden">비전</span>
              <span className="hidden lg:inline-flex text-[10px] px-1.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 font-semibold border border-sky-200 dark:border-sky-800">
                AI Vision
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('builder')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'builder'
                  ? 'bg-stone-100 dark:bg-zinc-800 text-stone-900 dark:text-zinc-100 font-semibold shadow-xs'
                  : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 hover:bg-stone-50 dark:hover:bg-zinc-900'
              }`}
              id="nav-builder-btn"
            >
              <Blocks className="w-4 h-4 text-emerald-500" />
              <span>블록 빌더</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('compare')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-all relative ${
                activeTab === 'compare'
                  ? 'bg-stone-100 dark:bg-zinc-800 text-stone-900 dark:text-zinc-100 font-semibold shadow-xs'
                  : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 hover:bg-stone-50 dark:hover:bg-zinc-900'
              }`}
              id="nav-compare-btn"
            >
              <SlidersHorizontal className="w-4 h-4 text-violet-500" />
              <span>비교/테스트</span>
              <span className="inline-flex w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('remix')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'remix'
                  ? 'bg-stone-100 dark:bg-zinc-800 text-stone-900 dark:text-zinc-100 font-semibold shadow-xs'
                  : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 hover:bg-stone-50 dark:hover:bg-zinc-900'
              }`}
              id="nav-remix-btn"
            >
              <Wand2 className="w-4 h-4 text-amber-500" />
              <span className="hidden sm:inline">AI 리믹서</span>
              <span className="sm:hidden">리믹스</span>
            </button>
          </nav>


          {/* Right Action Controls: Favorites Filter & Dark/Light Mode Toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (activeTab !== 'library') {
                  setActiveTab('library');
                }
                setShowFavoritesOnly(!showFavoritesOnly);
              }}
              title="즐겨찾기한 프롬프트 모아보기"
              className={`p-2 rounded-xl border text-sm font-medium transition-all flex items-center gap-1.5 ${
                showFavoritesOnly
                  ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300'
                  : 'border-stone-200 dark:border-zinc-800 text-stone-600 dark:text-zinc-400 hover:bg-stone-100 dark:hover:bg-zinc-900'
              }`}
              id="header-favorites-btn"
              aria-label="즐겨찾기 필터"
            >
              <Bookmark className={`w-4 h-4 ${showFavoritesOnly ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span className="hidden md:inline text-xs">{favoritesCount}</span>
            </button>

            {/* Dark/Light mode toggle button */}
            <button
              type="button"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-xl border border-stone-200 dark:border-zinc-800 bg-stone-50 dark:bg-zinc-900 text-stone-700 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors"
              id="dark-mode-toggle-btn"
              title={isDarkMode ? '밝은 모드로 전환 (Light Mode)' : '다크 모드로 전환 (Dark Mode)'}
              aria-label="테마 전환"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-stone-700" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
