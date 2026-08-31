import React from 'react';
import {
  Search,
  X,
  Filter,
  Sparkles,
  Layers,
  RotateCcw,
  Github,
  Globe,
  Database,
  RefreshCw,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { CATEGORIES, STYLES, AI_MODELS } from '../data/promptsData';
import {
  UseCaseCategory,
  PromptStyle,
  AIModelType,
  DataSourceMode,
  GitHubManifestData,
} from '../types';

interface SearchBarProps {
  dataSource: DataSourceMode;
  setDataSource: (mode: DataSourceMode) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: UseCaseCategory;
  setSelectedCategory: (cat: UseCaseCategory) => void;
  selectedGitHubCategory: string;
  setSelectedGitHubCategory: (slug: string) => void;
  selectedStyle: PromptStyle;
  setSelectedStyle: (style: PromptStyle) => void;
  selectedModel: AIModelType;
  setSelectedModel: (model: AIModelType) => void;
  sortBy: 'trending' | 'popular' | 'newest';
  setSortBy: (sort: 'trending' | 'popular' | 'newest') => void;
  filteredCount: number;
  totalCount: number;
  onResetFilters: () => void;
  manifestData: GitHubManifestData | null;
  isLoadingGitHub: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onRefreshGitHub: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  dataSource,
  setDataSource,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedGitHubCategory,
  setSelectedGitHubCategory,
  selectedStyle,
  setSelectedStyle,
  selectedModel,
  setSelectedModel,
  sortBy,
  setSortBy,
  filteredCount,
  totalCount,
  onResetFilters,
  manifestData,
  isLoadingGitHub,
  currentPage,
  totalPages,
  onPageChange,
  onRefreshGitHub,
}) => {
  const isFiltered =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'All' ||
    (dataSource === 'github' && selectedGitHubCategory !== 'all') ||
    selectedStyle !== 'All' ||
    selectedModel !== 'All' ||
    sortBy !== 'popular';

  return (
    <div className="space-y-4 mb-8" id="search-filter-section">
      {/* Data Source Selector & GitHub Live Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-2xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-100 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setDataSource('github')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              dataSource === 'github'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100'
            }`}
            id="data-source-github-btn"
          >
            <Github className="w-4 h-4" />
            <span>GitHub 실시간 연동 (15,385+ 프롬프트)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          <button
            type="button"
            onClick={() => setDataSource('curated')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              dataSource === 'curated'
                ? 'bg-white dark:bg-zinc-900 text-stone-900 dark:text-zinc-100 shadow-xs'
                : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100'
            }`}
            id="data-source-curated-btn"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>엄선 추천 프리셋</span>
          </button>
        </div>

        {/* GitHub Live Meta Status */}
        <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-zinc-400 w-full sm:w-auto justify-between sm:justify-end">
          {dataSource === 'github' ? (
            <>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <Globe className="w-3.5 h-3.5" />
                <span>YouMind-OpenLab 실시간 동기화</span>
              </span>
              <a
                href="https://github.com/YouMind-OpenLab/ai-image-prompts-skill"
                target="_blank"
                rel="noreferrer"
                className="hover:text-stone-900 dark:hover:text-zinc-100 underline flex items-center gap-0.5"
              >
                GitHub 원본 <ExternalLink className="w-3 h-3" />
              </a>
              <button
                type="button"
                onClick={onRefreshGitHub}
                disabled={isLoadingGitHub}
                className="p-1 rounded-lg border border-stone-200 dark:border-zinc-800 hover:bg-stone-100 dark:hover:bg-zinc-800"
                title="GitHub 데이터 새로고침"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingGitHub ? 'animate-spin' : ''}`} />
              </button>
            </>
          ) : (
            <span>엄선된 고품질 스타터 템플릿 세트</span>
          )}
        </div>
      </div>

      {/* Main Search Input & Sorters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 dark:text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              dataSource === 'github'
                ? "15,000+ GitHub 프롬프트 실시간 검색 (예: selfie, cyberpunk, anime, food, product, 3d, portrait...)"
                : "프롬프트 검색 (예: 사이버펑크, 미니멀 머그잔, 3D 픽사, 조명, 35mm, Midjourney...)"
            }
            className="w-full pl-10 pr-10 py-3 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-stone-900 dark:text-zinc-100 placeholder-stone-400 dark:placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs"
            id="prompt-search-input"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-zinc-200 p-1"
              id="clear-search-btn"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Style Dropdown & Sort selector */}
        <div className="flex items-center gap-2">
          {/* Style Selector */}
          <div className="relative min-w-[140px] sm:min-w-[160px]">
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value as PromptStyle)}
              className="w-full px-3 py-3 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-stone-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none cursor-pointer pr-8 shadow-xs"
              id="style-select-dropdown"
            >
              {STYLES.map((style) => (
                <option key={style.id} value={style.id}>
                  {style.label}
                </option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 dark:text-zinc-500 pointer-events-none" />
          </div>

          {/* Sort By */}
          <div className="relative min-w-[120px] sm:min-w-[140px]">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'trending' | 'popular' | 'newest')}
              className="w-full px-3 py-3 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-stone-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none cursor-pointer pr-8 shadow-xs"
              id="sort-select-dropdown"
            >
              <option value="popular">인기순 (복사순)</option>
              <option value="trending">추천 / 트렌딩</option>
              <option value="newest">최신 등록순</option>
            </select>
            <Layers className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 dark:text-zinc-500 pointer-events-none" />
          </div>

          {/* Reset Filters */}
          {isFiltered && (
            <button
              type="button"
              onClick={onResetFilters}
              title="필터 초기화"
              className="p-3 rounded-xl border border-stone-200 dark:border-zinc-800 text-stone-600 dark:text-zinc-400 hover:bg-stone-100 dark:hover:bg-zinc-800 hover:text-stone-900 dark:hover:text-zinc-100 transition-colors shrink-0"
              id="reset-filters-btn"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Popular Trending Keywords Quick Chips */}
      {dataSource === 'github' && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none no-scrollbar">
          <span className="text-[11px] font-semibold text-stone-400 dark:text-zinc-500 uppercase tracking-wider shrink-0 pl-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            인기 키워드:
          </span>
          {(manifestData?.popularKeywords || [
            { label: 'Cyberpunk', query: 'cyberpunk' },
            { label: '3D Pixar Cute', query: '3d pixar' },
            { label: 'Photorealistic 8k', query: 'portrait 8k' },
            { label: 'Anime Makoto Shinkai', query: 'anime makoto shinkai' },
            { label: 'Product Studio', query: 'product studio lighting' },
            { label: 'Isometric', query: 'isometric' },
            { label: 'Watercolor', query: 'watercolor' },
          ]).map((kw) => {
            const isActive = searchQuery === kw.query;
            return (
              <button
                key={kw.label}
                type="button"
                onClick={() => setSearchQuery(isActive ? '' : kw.query)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all border shrink-0 ${
                  isActive
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-stone-50 dark:bg-zinc-800/70 text-stone-600 dark:text-zinc-300 border-stone-200/80 dark:border-zinc-700/80 hover:bg-stone-100 dark:hover:bg-zinc-700 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                #{kw.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Dynamic Category Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none no-scrollbar" id="category-pills">
        <span className="text-xs font-semibold text-stone-400 dark:text-zinc-500 uppercase tracking-wider shrink-0 pl-1">
          카테고리:
        </span>

        {dataSource === 'github' ? (
          <>
            {/* GitHub "All" Button */}
            <button
              type="button"
              onClick={() => setSelectedGitHubCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0 flex items-center gap-1.5 ${
                selectedGitHubCategory === 'all'
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'bg-white dark:bg-zinc-900 text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-200 border border-stone-200 dark:border-zinc-800'
              }`}
            >
              <span>전체 카테고리 (15,385+)</span>
            </button>

            {manifestData?.categories.map((cat) => {
              const isSelected = selectedGitHubCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => setSelectedGitHubCategory(cat.slug)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                      : 'bg-white dark:bg-zinc-900 text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-200 border border-stone-200 dark:border-zinc-800'
                  }`}
                  id={`gh-cat-${cat.slug}`}
                >
                  <span>{cat.title}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected
                        ? 'bg-indigo-700 text-indigo-100'
                        : 'bg-stone-100 dark:bg-zinc-800 text-stone-500 dark:text-zinc-400'
                    }`}
                  >
                    {cat.count.toLocaleString()}
                  </span>
                </button>
              );
            })}
          </>
        ) : (
          /* Curated categories */
          CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id as UseCaseCategory)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-zinc-950 font-semibold shadow-xs'
                    : 'bg-white dark:bg-zinc-900 text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-200 border border-stone-200 dark:border-zinc-800'
                }`}
                id={`cat-pill-${cat.id.replace(/[^a-zA-Z0-9]/g, '-')}`}
              >
                {isSelected && <Sparkles className="w-3 h-3 text-amber-400" />}
                <span>{cat.label}</span>
              </button>
            );
          })
        )}
      </div>

      {/* AI Model Filter Chips & Pagination controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar" id="model-pills">
          <span className="text-xs font-semibold text-stone-400 dark:text-zinc-500 uppercase tracking-wider shrink-0 pl-1">
            호환 AI:
          </span>
          {AI_MODELS.map((model) => {
            const isSelected = selectedModel === model.id;
            return (
              <button
                key={model.id}
                type="button"
                onClick={() => setSelectedModel(model.id as AIModelType)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                  isSelected
                    ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                    : 'bg-stone-100 dark:bg-zinc-800/80 text-stone-600 dark:text-zinc-400 hover:bg-stone-200 dark:hover:bg-zinc-800'
                }`}
                id={`model-pill-${model.id.replace(/[^a-zA-Z0-9]/g, '-')}`}
              >
                {model.badge}
              </button>
            );
          })}
        </div>

        {/* Results Count & Pagination Controls (when in GitHub mode) */}
        <div className="flex items-center gap-3 text-xs text-stone-500 dark:text-zinc-400 font-medium">
          <div>
            총 <span className="text-stone-900 dark:text-zinc-100 font-semibold">{filteredCount.toLocaleString()}</span>개 프롬프트
          </div>

          {dataSource === 'github' && totalPages > 1 && (
            <div className="flex items-center gap-1 bg-stone-100 dark:bg-zinc-800 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage <= 1 || isLoadingGitHub}
                className="p-1 rounded hover:bg-white dark:hover:bg-zinc-700 disabled:opacity-30 transition-colors"
                title="이전 페이지"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 text-xs font-semibold text-stone-800 dark:text-zinc-200">
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage >= totalPages || isLoadingGitHub}
                className="p-1 rounded hover:bg-white dark:hover:bg-zinc-700 disabled:opacity-30 transition-colors"
                title="다음 페이지"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
