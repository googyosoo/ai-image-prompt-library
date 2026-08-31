import React, { useState, useEffect, useRef } from 'react';
import {
  Scan,
  UploadCloud,
  Sparkles,
  Copy,
  Check,
  Blocks,
  SlidersHorizontal,
  Wand2,
  Palette,
  Camera,
  Sun,
  Layers,
  RefreshCw,
  CheckCircle2,
  FileText,
  Zap,
} from 'lucide-react';
import { ImageAnalysisResult, PromptStyle, UseCaseCategory } from '../types';

interface ImageToPromptVisionProps {
  onCopy: (text: string, title: string) => void;
  onSendToBuilder: (suggestedBlockIds: string[], subject?: string) => void;
  onSendToCompare: (promptText: string, title: string, slotId: 'A' | 'B', imageUrl?: string) => void;
  onSendToRemix: (idea: string, style?: PromptStyle, category?: UseCaseCategory) => void;
}

// High quality demo preset samples
const SAMPLE_IMAGES = [
  {
    id: 'sample-cyberpunk',
    title: '사이버펑크 사무라이',
    category: 'Cyberpunk',
    url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'sample-3d-fox',
    title: '3D 픽사 아기 여우',
    category: '3D Pixar',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'sample-product-skincare',
    title: '럭셔리 스킨케어 앰플',
    category: 'Product Studio',
    url: 'https://images.unsplash.com/photo-1608248597359-0f0f35338573?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'sample-cinematic-portrait',
    title: '시네마틱 인물 포트레이트',
    category: 'Cinematic',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
  },
];

export const ImageToPromptVision: React.FC<ImageToPromptVisionProps> = ({
  onCopy,
  onSendToBuilder,
  onSendToCompare,
  onSendToRemix,
}) => {
  const [selectedImageBase64, setSelectedImageBase64] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(SAMPLE_IMAGES[0].url);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [targetModel, setTargetModel] = useState<string>('Midjourney v6');

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<ImageAnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedMj, setCopiedMj] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Global Paste Listener (Ctrl+V or Cmd+V anywhere on window or dropzone)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!e.clipboardData) return;
      const items = e.clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            processImageFile(file);
          }
          break;
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  // Process File to Base64
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('이미지 파일(PNG, JPG, WebP)만 업로드할 수 있습니다.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('이미지 파일 크기는 10MB 이하이어야 합니다.');
      return;
    }

    setErrorMessage(null);
    setMimeType(file.type);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setSelectedImageBase64(result);
      setPreviewUrl(result);
      // Auto analyze when new file is uploaded
      analyzeImage(result, file.type);
    };
    reader.readAsDataURL(file);
  };

  // Convert Sample Image URL to Base64 for analysis
  const selectSampleImage = async (url: string) => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    setPreviewUrl(url);

    try {
      // Fetch image from URL and convert to blob/base64
      const response = await fetch(url);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result as string;
        setSelectedImageBase64(base64Data);
        setMimeType(blob.type || 'image/jpeg');
        analyzeImage(base64Data, blob.type || 'image/jpeg');
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      console.warn('CORS or fetch error loading sample, using fallback base64 analysis', err);
      // If CORS blocks direct fetch, perform server-side analysis with dummy indicator
      analyzeImage('', 'image/jpeg');
    }
  };

  // Send request to /api/analyze-image
  const analyzeImage = async (base64Content: string, mime: string) => {
    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Content || 'placeholder',
          mimeType: mime || 'image/jpeg',
          targetModel,
        }),
      });

      if (!res.ok) {
        throw new Error(`분석 중 오류가 발생했습니다 (${res.status})`);
      }

      const data: ImageAnalysisResult = await res.json();
      setAnalysisResult(data);
    } catch (err: any) {
      console.error('Vision analysis error:', err);
      setErrorMessage(err.message || '이미지 분석에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Initial load: analyze first sample
  useEffect(() => {
    if (!analysisResult && !isAnalyzing) {
      selectSampleImage(SAMPLE_IMAGES[0].url);
    }
  }, []);

  // Handle Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8" id="vision-interrogate-section">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Scan className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-stone-900 dark:text-zinc-100">
                  AI 이미지 비전 역공학 (Image-to-Prompt)
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  Gemini 3.7 Vision
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-zinc-400 mt-0.5">
                레퍼런스 이미지를 업로드하거나 붙여넣기(Ctrl+V)하면 조명, 렌즈, 화풍을 역분해하여 마스터 프롬프트로 재구성합니다.
              </p>
            </div>
          </div>

          {/* Model Selector */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs text-stone-500 dark:text-zinc-400 font-medium">타깃 모델:</span>
            <select
              value={targetModel}
              onChange={(e) => {
                setTargetModel(e.target.value);
                if (selectedImageBase64) {
                  analyzeImage(selectedImageBase64, mimeType);
                }
              }}
              className="text-xs px-3 py-1.5 rounded-lg border border-stone-200 dark:border-zinc-700 bg-stone-50 dark:bg-zinc-800 text-stone-800 dark:text-zinc-200 font-medium focus:ring-2 focus:ring-indigo-500 outline-hidden"
            >
              <option value="Midjourney v6">Midjourney v6</option>
              <option value="Nano Banana (Gemini)">Gemini 3.1 Flash Image</option>
              <option value="DALL-E 3">DALL-E 3</option>
              <option value="Flux.1">Flux.1 Schnell/Dev</option>
              <option value="Stable Diffusion XL">Stable Diffusion XL</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Upload & Preview Area (Left) vs Extracted Prompt Specification (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Upload Dropzone & Sample Picker (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Dropzone Container */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-6 text-center transition-all overflow-hidden ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 ring-4 ring-indigo-500/20'
                : 'border-stone-300 dark:border-zinc-700 hover:border-indigo-400 dark:hover:border-indigo-500 bg-stone-50/60 dark:bg-zinc-900/60'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp, image/gif"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  processImageFile(e.target.files[0]);
                }
              }}
            />

            {previewUrl ? (
              <div className="relative rounded-xl overflow-hidden shadow-inner bg-black/5 dark:bg-black/40 aspect-4/3 flex items-center justify-center">
                <img
                  src={previewUrl}
                  alt="분석 대상 이미지"
                  className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-102"
                />

                {/* Scanning overlay effect during analysis */}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-indigo-950/60 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600/80 flex items-center justify-center mb-3 animate-pulse shadow-lg shadow-indigo-500/40">
                      <Scan className="w-6 h-6 animate-spin text-white" />
                    </div>
                    <p className="text-sm font-bold tracking-wide">Gemini 3.7 비전 역공학 분석 중...</p>
                    <p className="text-xs text-indigo-200 mt-1">조명, 렌즈 초점거리, 텍스처, 컬러 팔레트 추출 중</p>
                    {/* Laser scan line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-bounce" />
                  </div>
                )}

                {/* Hover overlay for change image */}
                {!isAnalyzing && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <span className="px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-md text-xs font-semibold flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5" /> 다른 이미지로 변경
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-10 space-y-4">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-bold text-stone-800 dark:text-zinc-200">
                    이미지를 드래그하여 놓거나 클릭하여 업로드
                  </p>
                  <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1">
                    클립보드 스크린샷 붙여넣기(<kbd className="px-1.5 py-0.5 bg-stone-200 dark:bg-zinc-800 rounded font-mono text-[10px]">Ctrl+V</kbd>) 지원
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 text-[11px] text-stone-400 dark:text-zinc-500">
                  <span>PNG, JPG, WebP 지원</span>
                  <span>•</span>
                  <span>최대 10MB</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Sample Image Buttons */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                원클릭 레퍼런스 샘플
              </label>
              <span className="text-[11px] text-stone-400 dark:text-zinc-500">클릭 즉시 분석</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {SAMPLE_IMAGES.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    selectSampleImage(sample.url);
                  }}
                  className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all ${
                    previewUrl === sample.url
                      ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                      : 'border-stone-200 dark:border-zinc-800 hover:border-stone-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900 text-stone-800 dark:text-zinc-200'
                  }`}
                >
                  <img
                    src={sample.url}
                    alt={sample.title}
                    className="w-10 h-10 rounded-lg object-cover shrink-0 shadow-xs"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold truncate">{sample.title}</p>
                    <span className="text-[10px] text-stone-500 dark:text-zinc-400">{sample.category}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Error notice */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs">
              {errorMessage}
            </div>
          )}
        </div>

        {/* Right Column: Analysis Results Dashboard (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {analysisResult ? (
            <div className="p-6 rounded-2xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-6">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200 dark:border-zinc-800">
                <div>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-zinc-100 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    {analysisResult.koreanTitle || '추출된 마스터 프롬프트'}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-zinc-400 mt-0.5">
                    {analysisResult.koreanDescription}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 self-start sm:self-auto">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
                    {analysisResult.style}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300">
                    {analysisResult.aspectRatio}
                  </span>
                </div>
              </div>

              {/* Master Prompt Output Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-500" />
                    추출된 영문 마스터 프롬프트
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      onCopy(analysisResult.enhancedPrompt, analysisResult.koreanTitle);
                      setCopiedPrompt(true);
                      setTimeout(() => setCopiedPrompt(false), 2000);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
                  >
                    {copiedPrompt ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPrompt ? '복사 완료' : '프롬프트 복사'}</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 text-sm font-mono leading-relaxed text-stone-900 dark:text-zinc-100 select-all">
                  {analysisResult.enhancedPrompt}
                </div>
              </div>

              {/* Midjourney Command Box */}
              {analysisResult.midjourneyParameters && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-600 dark:text-zinc-400 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      Midjourney /imagine 실행 명령어
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const mjCommand = `/imagine prompt: ${analysisResult.enhancedPrompt} ${analysisResult.midjourneyParameters}`;
                        onCopy(mjCommand, 'Midjourney 명령어');
                        setCopiedMj(true);
                        setTimeout(() => setCopiedMj(false), 2000);
                      }}
                      className="text-xs font-medium text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                    >
                      {copiedMj ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedMj ? '명령어 복사됨' : '원클릭 복사'}</span>
                    </button>
                  </div>
                  <div className="p-2.5 rounded-lg bg-amber-500/5 dark:bg-amber-950/20 border border-amber-500/20 text-xs font-mono text-amber-900 dark:text-amber-200 truncate select-all">
                    /imagine prompt: {analysisResult.enhancedPrompt} {analysisResult.midjourneyParameters}
                  </div>
                </div>
              )}

              {/* Visual Breakdown Tags & Palette */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Lighting & Camera */}
                <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700 dark:text-zinc-300">
                    <Sun className="w-3.5 h-3.5 text-amber-500" /> 조명 설정
                  </div>
                  <p className="text-xs text-stone-600 dark:text-zinc-400 font-medium">
                    {analysisResult.lighting}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700 dark:text-zinc-300">
                    <Camera className="w-3.5 h-3.5 text-sky-500" /> 카메라 & 렌즈
                  </div>
                  <p className="text-xs text-stone-600 dark:text-zinc-400 font-medium">
                    {analysisResult.camera}
                  </p>
                </div>

                {/* Composition */}
                <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700 dark:text-zinc-300">
                    <Layers className="w-3.5 h-3.5 text-emerald-500" /> 구도 및 앵글
                  </div>
                  <p className="text-xs text-stone-600 dark:text-zinc-400 font-medium">
                    {analysisResult.composition}
                  </p>
                </div>

                {/* Color Palette */}
                <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700 dark:text-zinc-300">
                    <Palette className="w-3.5 h-3.5 text-pink-500" /> 추출된 컬러 팔레트
                  </div>
                  <div className="flex items-center gap-2 pt-0.5">
                    {analysisResult.colorPalette?.map((hex, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => onCopy(hex, `색상 코드 ${hex}`)}
                        title={`${hex} (클릭하여 복사)`}
                        className="w-7 h-7 rounded-lg border border-black/10 dark:border-white/10 shadow-xs hover:scale-115 transition-transform cursor-pointer"
                        style={{ backgroundColor: hex }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Cross-Studio Integration */}
              <div className="pt-2 border-t border-stone-200 dark:border-zinc-800">
                <label className="text-xs font-bold text-stone-700 dark:text-zinc-300 uppercase tracking-wider block mb-3">
                  워크스페이스 연동 액션
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* 1. Send to Lego Builder */}
                  <button
                    type="button"
                    onClick={() => {
                      onSendToBuilder(
                        analysisResult.suggestedLegoBlockIds || [],
                        analysisResult.detectedSubject || analysisResult.koreanTitle
                      );
                    }}
                    className="flex items-center justify-center gap-2 p-3 rounded-xl border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 font-semibold text-xs hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-all shadow-xs"
                  >
                    <Blocks className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>블록 빌더로 전송</span>
                  </button>

                  {/* 2. Send to Compare Studio Slot A/B */}
                  <button
                    type="button"
                    onClick={() => {
                      onSendToCompare(
                        analysisResult.enhancedPrompt,
                        analysisResult.koreanTitle,
                        'A',
                        previewUrl || undefined
                      );
                    }}
                    className="flex items-center justify-center gap-2 p-3 rounded-xl border border-violet-500/30 bg-violet-50 dark:bg-violet-950/40 text-violet-800 dark:text-violet-200 font-semibold text-xs hover:bg-violet-100 dark:hover:bg-violet-900/60 transition-all shadow-xs"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                    <span>비교 슬롯 A로 전송</span>
                  </button>

                  {/* 3. Send to Remixer */}
                  <button
                    type="button"
                    onClick={() => {
                      onSendToRemix(
                        analysisResult.detectedSubject || analysisResult.koreanTitle,
                        analysisResult.style,
                        analysisResult.category
                      );
                    }}
                    className="flex items-center justify-center gap-2 p-3 rounded-xl border border-amber-500/30 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 font-semibold text-xs hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-all shadow-xs"
                  >
                    <Wand2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>AI 리믹서로 전송</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-2xl border border-dashed border-stone-300 dark:border-zinc-800 text-center space-y-3 bg-stone-50/40 dark:bg-zinc-900/40">
              <div className="w-12 h-12 mx-auto rounded-xl bg-stone-100 dark:bg-zinc-800 text-stone-400 flex items-center justify-center">
                <Scan className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-stone-700 dark:text-zinc-300">
                분석할 이미지를 왼쪽에서 선택해 주세요
              </p>
              <p className="text-xs text-stone-500 dark:text-zinc-400">
                샘플 이미지를 클릭하거나 내 사진을 업로드하면 실시간으로 역분해 결과가 표시됩니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
