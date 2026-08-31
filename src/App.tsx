import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { PROMPT_PRESETS } from './data/promptsData';
import {
  PromptItem,
  UseCaseCategory,
  PromptStyle,
  AIModelType,
  ActiveTab,
  CompareSlot,
  ToastMessage,
  DataSourceMode,
  GitHubManifestData,
} from './types';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { PromptCard } from './components/PromptCard';
import { PromptDetailModal } from './components/PromptDetailModal';
import { CompareStudio } from './components/CompareStudio';
import { PromptRemixer } from './components/PromptRemixer';
import { PromptLegoBuilder } from './components/PromptLegoBuilder';
import { ImageToPromptVision } from './components/ImageToPromptVision';
import { Toast } from './components/Toast';
import { Sparkles, Frown, Compass, SlidersHorizontal, Wand2, Loader2, Github, Globe, Blocks, Scan } from 'lucide-react';


export default function App() {
  // Theme state: dark mode & light mode toggle
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('ai_prompt_studio_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ai_prompt_studio_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ai_prompt_studio_theme', 'light');
    }
  }, [isDarkMode]);

  // Tab State
  const [activeTab, setActiveTab] = useState<ActiveTab>('library');

  // Data Source Mode: 'github' (Live 15,385+ prompts) vs 'curated' (Curated set)
  const [dataSource, setDataSource] = useState<DataSourceMode>('github');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<UseCaseCategory>('All');
  const [selectedGitHubCategory, setSelectedGitHubCategory] = useState<string>('profile-avatar');
  const [selectedStyle, setSelectedStyle] = useState<PromptStyle>('All');
  const [selectedModel, setSelectedModel] = useState<AIModelType>('All');
  const [sortBy, setSortBy] = useState<'trending' | 'popular' | 'newest'>('popular');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // GitHub Data State
  const [manifestData, setManifestData] = useState<GitHubManifestData | null>(null);
  const [gitHubPrompts, setGitHubPrompts] = useState<PromptItem[]>([]);
  const [isLoadingGitHub, setIsLoadingGitHub] = useState(false);
  const [gitHubPage, setGitHubPage] = useState(1);
  const [gitHubTotalPages, setGitHubTotalPages] = useState(1);
  const [gitHubTotalCount, setGitHubTotalCount] = useState(15385);

  // Favorites state
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('ai_prompt_studio_favorites');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return ['cyberpunk-neon-samurai', 'cute-3d-pixar-fox'];
  });

  const toggleFavorite = (id: string) => {
    setFavoriteIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem('ai_prompt_studio_favorites', JSON.stringify(next));
      return next;
    });
  };

  // Toast Notification Stack
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'info' | 'error', title: string, description?: string) => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Copy handler with feedback
  const handleCopyPrompt = (text: string, title: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      addToast('success', '클립보드에 복사되었습니다!', `${title} 프롬프트가 복사되었습니다.`);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      addToast('success', '클립보드에 복사되었습니다!', `${title} 프롬프트가 복사되었습니다.`);
    }
  };

  // Fetch GitHub Manifest
  const fetchManifest = useCallback(async () => {
    try {
      const res = await fetch('/api/github/manifest');
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.manifest) {
          setManifestData(data.manifest);
          if (data.manifest.totalPrompts) {
            setGitHubTotalCount(data.manifest.totalPrompts);
          }
        }
      }
    } catch (e) {
      console.warn('Could not fetch manifest from backend:', e);
    }
  }, []);

  // Fetch GitHub Prompts based on category, search query, style, page and sortBy
  const fetchGitHubPrompts = useCallback(async () => {
    setIsLoadingGitHub(true);
    try {
      const params = new URLSearchParams();
      params.append('category', selectedGitHubCategory);
      params.append('page', gitHubPage.toString());
      params.append('limit', '24');
      params.append('sortBy', sortBy);
      if (searchQuery.trim()) {
        params.append('q', searchQuery.trim());
      }
      if (selectedStyle !== 'All') {
        params.append('style', selectedStyle);
      }

      const res = await fetch(`/api/github/prompts?${params.toString()}`);
      const contentType = res.headers.get('content-type');

      if (!res.ok || !contentType || !contentType.includes('application/json')) {
        // Fallback gracefully without crashing
        console.warn('API returned non-JSON or status was not OK, using preset fallback');
        setGitHubPrompts(PROMPT_PRESETS);
        return;
      }

      const data = await res.json();
      if (data.items && data.items.length > 0) {
        setGitHubPrompts(data.items);
        if (data.pagination) {
          setGitHubTotalPages(data.pagination.totalPages || 1);
          setGitHubTotalCount(data.pagination.total || data.items.length);
        }
      } else {
        // If empty result for filter, keep empty
        setGitHubPrompts(data.items || []);
        if (data.pagination) {
          setGitHubTotalPages(data.pagination.totalPages || 1);
          setGitHubTotalCount(data.pagination.total || 0);
        }
      }
    } catch (error) {
      console.warn('Error loading GitHub prompts:', error);
      setGitHubPrompts(PROMPT_PRESETS);
    } finally {
      setIsLoadingGitHub(false);
    }
  }, [selectedGitHubCategory, gitHubPage, searchQuery, selectedStyle, sortBy]);

  // Initial Manifest Load
  useEffect(() => {
    fetchManifest();
  }, [fetchManifest]);

  // Trigger GitHub Fetch when in GitHub mode
  useEffect(() => {
    if (dataSource === 'github') {
      fetchGitHubPrompts();
    }
  }, [dataSource, fetchGitHubPrompts]);

  // Reset page when filter or category changes in GitHub mode
  useEffect(() => {
    setGitHubPage(1);
  }, [selectedGitHubCategory, searchQuery, selectedStyle]);

  // Detail Modal State
  const [selectedDetailPrompt, setSelectedDetailPrompt] = useState<PromptItem | null>(null);

  // Compare Studio Slots State
  const [slotA, setSlotA] = useState<CompareSlot>(() => {
    const pA = PROMPT_PRESETS[0];
    return {
      id: 'A',
      title: pA.koreanTitle,
      prompt: pA.fullPrompt,
      negativePrompt: pA.negativePrompt || '',
      style: pA.style,
      aspectRatio: '1:1',
      sampleImageUrl: pA.sampleImageUrl,
    };
  });

  const [slotB, setSlotB] = useState<CompareSlot>(() => {
    const pB = PROMPT_PRESETS[1];
    return {
      id: 'B',
      title: pB.koreanTitle,
      prompt: pB.fullPrompt,
      negativePrompt: pB.negativePrompt || '',
      style: pB.style,
      aspectRatio: '1:1',
      sampleImageUrl: pB.sampleImageUrl,
    };
  });

  // Lego Builder dynamic initial blocks state
  const [legoBuilderInitialBlocks, setLegoBuilderInitialBlocks] = useState<string[]>([
    'sub-cyberpunk-samurai',
    'cam-low-angle',
    'lens-anamorphic',
    'light-neon-rim',
    'style-octane',
    'mood-neon-cyan',
    'detail-8k-sharp',
  ]);

  // Action: Send Vision Extracted Lego Blocks to Builder
  const handleSendVisionToBuilder = (suggestedBlockIds: string[], _subject?: string) => {
    if (suggestedBlockIds && suggestedBlockIds.length > 0) {
      setLegoBuilderInitialBlocks(suggestedBlockIds);
    }
    setActiveTab('builder');
    addToast('success', '블록 빌더로 전송 완료', '추출된 스타일/조명/카메라 블록들이 빌더에 적용되었습니다.');
  };

  // Action: Send Vision Prompt to Compare Slot
  const handleSendVisionToCompare = (promptText: string, title: string, slotId: 'A' | 'B', imageUrl?: string) => {
    const newSlot: CompareSlot = {
      id: slotId,
      title: title || 'AI 비전 분석 프롬프트',
      prompt: promptText,
      negativePrompt: 'blurry, distorted, oversaturated, low quality, watermark',
      style: 'Cinematic / Film',
      aspectRatio: '16:9',
      sampleImageUrl: imageUrl || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
      generatedImageUrl: undefined,
    };

    if (slotId === 'A') {
      setSlotA(newSlot);
    } else {
      setSlotB(newSlot);
    }

    addToast('info', `비교 슬롯 ${slotId}에 적용됨`, `${title || '비전 프롬프트'}가 비교 슬롯에 로드되었습니다.`);
    setActiveTab('compare');
  };

  // Action: Send Vision Subject to Remixer
  const handleSendVisionToRemix = (idea: string, _style?: PromptStyle, _category?: UseCaseCategory) => {
    setActiveTab('remix');
    addToast('info', 'AI 리믹서로 이동', `"${idea}" 아이디어를 리믹스 탭에서 확장해보세요.`);
  };

  // Action: Send Prompt to Comparison Slot
  const handleSendToCompare = (prompt: PromptItem, slotId: 'A' | 'B') => {
    const newSlot: CompareSlot = {
      id: slotId,
      title: prompt.koreanTitle || prompt.title,
      prompt: prompt.fullPrompt,
      negativePrompt: prompt.negativePrompt || '',
      style: prompt.style,
      aspectRatio: '1:1',
      sampleImageUrl: prompt.sampleImageUrl,
      generatedImageUrl: undefined,
    };

    if (slotId === 'A') {
      setSlotA(newSlot);
    } else {
      setSlotB(newSlot);
    }

    addToast('info', `비교 슬롯 ${slotId}에 등록 완료`, `${prompt.koreanTitle || prompt.title}이(가) 등록되었습니다.`);
    setActiveTab('compare');
  };

  const handleSendCustomTextToCompare = (promptText: string, title: string, slotId: 'A' | 'B') => {
    const newSlot: CompareSlot = {
      id: slotId,
      title: title || 'AI 리믹스 프롬프트',
      prompt: promptText,
      negativePrompt: 'blurry, low quality',
      style: 'Cinematic / Film',
      aspectRatio: '1:1',
      sampleImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80',
      generatedImageUrl: undefined,
    };

    if (slotId === 'A') {
      setSlotA(newSlot);
    } else {
      setSlotB(newSlot);
    }

    addToast('info', `비교 슬롯 ${slotId}에 등록 완료`, `${title}이(가) 등록되었습니다.`);
    setActiveTab('compare');
  };


  // Filtered & Sorted prompts calculation for Curated mode
  const filteredCuratedPrompts = useMemo(() => {
    let result = [...PROMPT_PRESETS];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.koreanTitle.toLowerCase().includes(q) ||
          p.title.toLowerCase().includes(q) ||
          p.fullPrompt.toLowerCase().includes(q) ||
          p.koreanDescription.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q) ||
          p.style.toLowerCase().includes(q) ||
          (p.lighting && p.lighting.toLowerCase().includes(q)) ||
          (p.camera && p.camera.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (selectedStyle !== 'All') {
      result = result.filter((p) => p.style === selectedStyle);
    }

    if (selectedModel !== 'All') {
      result = result.filter((p) =>
        p.targetModels.some((m) => m.toLowerCase().includes(selectedModel.toLowerCase()))
      );
    }

    if (showFavoritesOnly) {
      result = result.filter((p) => favoriteIds.includes(p.id));
    }

    if (sortBy === 'popular') {
      result.sort((a, b) => b.copiedCount - a.copiedCount);
    } else if (sortBy === 'trending') {
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [
    searchQuery,
    selectedCategory,
    selectedStyle,
    selectedModel,
    showFavoritesOnly,
    favoriteIds,
    sortBy,
  ]);

  // Active display items depending on dataSource
  const displayPrompts = useMemo(() => {
    if (dataSource === 'github') {
      let list = [...gitHubPrompts];
      if (showFavoritesOnly) {
        list = list.filter((p) => favoriteIds.includes(p.id));
      }
      return list;
    }
    return filteredCuratedPrompts;
  }, [dataSource, gitHubPrompts, filteredCuratedPrompts, showFavoritesOnly, favoriteIds]);

  const activeTotalCount = dataSource === 'github' ? gitHubTotalCount : PROMPT_PRESETS.length;

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedGitHubCategory('profile-avatar');
    setSelectedStyle('All');
    setSelectedModel('All');
    setSortBy('popular');
    setShowFavoritesOnly(false);
    setGitHubPage(1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-zinc-950 text-stone-900 dark:text-zinc-100 transition-colors duration-200" id="app-root">
      {/* Global Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        favoritesCount={favoriteIds.length}
        showFavoritesOnly={showFavoritesOnly}
        setShowFavoritesOnly={setShowFavoritesOnly}
        totalPromptsCount={activeTotalCount}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* ================= TAB 1: PROMPT LIBRARY ================= */}
        {activeTab === 'library' && (
          <div className="space-y-6" id="library-view">
            {/* Search & Filter Bar */}
            <SearchBar
              dataSource={dataSource}
              setDataSource={setDataSource}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedGitHubCategory={selectedGitHubCategory}
              setSelectedGitHubCategory={setSelectedGitHubCategory}
              selectedStyle={selectedStyle}
              setSelectedStyle={setSelectedStyle}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              sortBy={sortBy}
              setSortBy={setSortBy}
              filteredCount={displayPrompts.length}
              totalCount={activeTotalCount}
              onResetFilters={handleResetFilters}
              manifestData={manifestData}
              isLoadingGitHub={isLoadingGitHub}
              currentPage={gitHubPage}
              totalPages={gitHubTotalPages}
              onPageChange={setGitHubPage}
              onRefreshGitHub={fetchGitHubPrompts}
            />

            {/* Loading Indicator for GitHub fetch */}
            {isLoadingGitHub && (
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                <p className="text-sm font-semibold text-stone-700 dark:text-zinc-300">
                  GitHub 실시간 리포지토리에서 프롬프트 데이터를 불러오는 중입니다...
                </p>
                <p className="text-xs text-stone-400 dark:text-zinc-500">
                  총 15,385+ 프롬프트 라이브러리와 동기화 중입니다.
                </p>
              </div>
            )}

            {/* Prompt Cards Grid */}
            {!isLoadingGitHub && displayPrompts.length > 0 ? (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                id="prompts-grid"
              >
                {displayPrompts.map((prompt) => (
                  <PromptCard
                    key={prompt.id}
                    prompt={prompt}
                    onCopy={handleCopyPrompt}
                    onSendToCompare={handleSendToCompare}
                    onOpenDetail={setSelectedDetailPrompt}
                    isFavorite={favoriteIds.includes(prompt.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            ) : !isLoadingGitHub ? (
              /* Empty Search State */
              <div className="text-center py-16 px-4 rounded-2xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 max-w-lg mx-auto shadow-xs">
                <Frown className="w-12 h-12 text-stone-400 dark:text-zinc-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-stone-900 dark:text-zinc-100">
                  일치하는 프롬프트를 찾을 수 없습니다
                </h3>
                <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1 max-w-xs mx-auto">
                  검색어 또는 카테고리/스타일 조건을 변경해보시거나 필터를 초기화해보세요.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-4 px-4 py-2 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-zinc-950 text-xs font-semibold hover:bg-stone-800 dark:hover:bg-white transition-colors"
                >
                  모든 필터 초기화
                </button>
              </div>
            ) : null}

            {/* Bottom Pagination for GitHub browsing */}
            {dataSource === 'github' && gitHubTotalPages > 1 && !isLoadingGitHub && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <button
                  type="button"
                  onClick={() => setGitHubPage((prev) => Math.max(1, prev - 1))}
                  disabled={gitHubPage <= 1}
                  className="px-4 py-2 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-stone-700 dark:text-zinc-300 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-zinc-800 disabled:opacity-30 transition-colors"
                >
                  이전 페이지
                </button>
                <span className="text-xs font-medium text-stone-500 dark:text-zinc-400 px-3">
                  {gitHubPage} / {gitHubTotalPages} 페이지 (총 {gitHubTotalCount.toLocaleString()}개)
                </span>
                <button
                  type="button"
                  onClick={() => setGitHubPage((prev) => Math.min(gitHubTotalPages, prev + 1))}
                  disabled={gitHubPage >= gitHubTotalPages}
                  className="px-4 py-2 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-stone-700 dark:text-zinc-300 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-zinc-800 disabled:opacity-30 transition-colors"
                >
                  다음 페이지
                </button>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: AI VISION INTERROGATE (IMAGE-TO-PROMPT) ================= */}
        {activeTab === 'vision' && (
          <ImageToPromptVision
            onCopy={handleCopyPrompt}
            onSendToBuilder={handleSendVisionToBuilder}
            onSendToCompare={handleSendVisionToCompare}
            onSendToRemix={handleSendVisionToRemix}
          />
        )}

        {/* ================= TAB 3: PROMPT LEGO BUILDER ================= */}
        {activeTab === 'builder' && (
          <PromptLegoBuilder
            onCopy={handleCopyPrompt}
            onSendToCompare={handleSendCustomTextToCompare}
            initialBlockIds={legoBuilderInitialBlocks}
          />
        )}

        {/* ================= TAB 4: PROMPT COMPARE STUDIO ================= */}
        {activeTab === 'compare' && (
          <CompareStudio
            slotA={slotA}
            setSlotA={setSlotA}
            slotB={slotB}
            setSlotB={setSlotB}
            onCopy={handleCopyPrompt}
            onSelectPresetToSlot={(prompt, slotId) => {
              const target = {
                id: slotId,
                title: prompt.koreanTitle || prompt.title,
                prompt: prompt.fullPrompt,
                negativePrompt: prompt.negativePrompt || '',
                style: prompt.style,
                aspectRatio: '1:1' as const,
                sampleImageUrl: prompt.sampleImageUrl,
                generatedImageUrl: undefined,
              };
              if (slotId === 'A') setSlotA(target);
              else setSlotB(target);
              addToast('info', `슬롯 ${slotId}에 적용됨`, prompt.koreanTitle || prompt.title);
            }}
          />
        )}

        {/* ================= TAB 5: AI PROMPT REMIXER ================= */}
        {activeTab === 'remix' && (
          <PromptRemixer
            onCopy={handleCopyPrompt}
            onSendToCompare={handleSendCustomTextToCompare}
          />
        )}

      </main>

      {/* Detail Modal */}
      <PromptDetailModal
        prompt={selectedDetailPrompt}
        onClose={() => setSelectedDetailPrompt(null)}
        onCopy={handleCopyPrompt}
        onSendToCompare={handleSendToCompare}
        isFavorite={selectedDetailPrompt ? favoriteIds.includes(selectedDetailPrompt.id) : false}
        onToggleFavorite={toggleFavorite}
      />

      {/* Global Toast Stack */}
      <Toast toasts={toasts} onDismiss={handleDismissToast} />

      {/* Footer */}
      <footer className="border-t border-stone-200 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-950/60 py-6 mt-12 text-center text-xs text-stone-500 dark:text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AI Image Prompt Studio • Real-time Sync with YouMind-OpenLab/ai-image-prompts-skill</span>
          <span>15,385+ GitHub 라이브 프롬프트 • 원클릭 복사 • A/B 비교 스튜디오</span>
        </div>
      </footer>
    </div>
  );
}
