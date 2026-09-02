import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Lock,
  Wand2,
  Scan,
  Blocks,
  SlidersHorizontal,
  AlertCircle,
  LogIn,
} from 'lucide-react';
import { AuthUser, ALLOWED_EMAILS } from '../types';

interface LandingGateProps {
  onLoginSuccess: (user: AuthUser) => void;
}

// Helper to decode JWT token from Google Identity Services
function parseJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export const LandingGate: React.FC<LandingGateProps> = ({ onLoginSuccess }) => {
  const [authError, setAuthError] = useState<string | null>(null);
  const [isGoogleSdkReady, setIsGoogleSdkReady] = useState(false);
  const [isPromptingCustomEmail, setIsPromptingCustomEmail] = useState(false);
  const [customEmailInput, setCustomEmailInput] = useState('');

  // Load Google Identity Services SDK
  useEffect(() => {
    if (document.getElementById('google-gsi-client')) {
      setIsGoogleSdkReady(true);
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-gsi-client';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setIsGoogleSdkReady(true);
    };
    document.body.appendChild(script);
  }, []);

  // Initialize Google Button when SDK is ready
  useEffect(() => {
    if (!isGoogleSdkReady || !(window as any).google) return;

    const clientId =
      (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID ||
      '';

    if (!clientId) {
      return; // Fallback to custom stylish Google login trigger if no client ID is configured
    }

    try {
      (window as any).google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleCredentialResponse,
        auto_select: false,
      });

      const btnContainer = document.getElementById('google-signin-btn-container');
      if (btnContainer) {
        btnContainer.innerHTML = '';
        (window as any).google.accounts.id.renderButton(btnContainer, {
          theme: 'outline',
          size: 'large',
          type: 'standard',
          shape: 'pill',
          text: 'signin_with',
          logo_alignment: 'left',
          width: 280,
        });
      }
    } catch (err) {
      console.warn('Google GSI initialization notice:', err);
    }
  }, [isGoogleSdkReady]);

  // Handle Google Token Response
  const handleGoogleCredentialResponse = (response: any) => {
    setAuthError(null);
    if (!response || !response.credential) {
      setAuthError('구글 인증 정보를 가져올 수 없습니다.');
      return;
    }

    const payload = parseJwt(response.credential);
    if (!payload || !payload.email) {
      setAuthError('유효하지 않은 구글 계정 토큰입니다.');
      return;
    }

    verifyAndLogin(payload.email, payload.name || payload.email.split('@')[0], payload.picture);
  };

  // Check email against allowed whitelist
  const verifyAndLogin = (email: string, name: string, picture?: string) => {
    const normalizedEmail = email.toLowerCase().trim();

    if (ALLOWED_EMAILS.map((e) => e.toLowerCase()).includes(normalizedEmail)) {
      const user: AuthUser = {
        email: normalizedEmail,
        name: name || normalizedEmail.split('@')[0],
        picture,
        isAuthenticated: true,
      };
      onLoginSuccess(user);
    } else {
      setAuthError('접근 권한이 없는 계정입니다. 인가된 사용자만 접근 가능합니다.');
    }
  };

  // Fallback Google Sign-In Trigger when OAuth Client ID is not explicitly set in env
  const handleFallbackGoogleLogin = () => {
    setAuthError(null);
    setIsPromptingCustomEmail(true);
  };

  const handleCustomEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmailInput.trim()) return;
    verifyAndLogin(customEmailInput.trim(), customEmailInput.split('@')[0]);
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col relative overflow-hidden selection:bg-indigo-500 selection:text-white font-sans">
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-indigo-600/30 via-violet-600/20 to-pink-600/20 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[400px] bg-sky-600/20 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-[40%] right-[-10%] w-[500px] h-[400px] bg-amber-600/15 blur-[120px] pointer-events-none rounded-full" />

      {/* Top Floating Navigation */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white tracking-tight">
                AI Prompt Studio
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-700/60">
                PRO
              </span>
            </div>
            <p className="text-xs text-stone-400">교사 & 크리에이터 전용 스튜디오</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-800 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            보안 시스템 가동 중
          </span>
        </div>
      </header>

      {/* Main Hero & Login Box */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-6 py-10 flex flex-col items-center justify-center text-center space-y-10">
        {/* Hero Title */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-800/80 border border-stone-700/80 text-xs font-semibold text-stone-300 shadow-inner">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>인가된 사용자 전용 워크스페이스</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white">
            상상을 완성하는 단 하나의{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-pink-400 bg-clip-text text-transparent">
              AI 프롬프트 스튜디오
            </span>
          </h1>

          <p className="text-base sm:text-lg text-stone-300 leading-relaxed max-w-2xl mx-auto font-normal">
            15,000+ 검증된 프롬프트 보관소, 10초 완성 초보자 마법사, AI 비전 역공학, 레고 블록 빌더까지 하나로 연결된 프로덕션 워크스페이스입니다.
          </p>
        </div>

        {/* Clean Login Card */}
        <div className="w-full max-w-sm p-8 rounded-3xl bg-stone-950/85 border border-stone-800 backdrop-blur-xl shadow-2xl space-y-6 text-center relative">
          <div className="space-y-1.5">
            <h2 className="text-lg font-bold text-white flex items-center justify-center gap-2">
              <LogIn className="w-5 h-5 text-indigo-400" />
              로그인
            </h2>
            <p className="text-xs text-stone-400 font-medium">
              Google 계정으로 로그인해 주세요
            </p>
          </div>

          {/* Error Alert if unapproved account */}
          {authError && (
            <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-start gap-2.5 text-left animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <p className="leading-snug">{authError}</p>
            </div>
          )}

          {/* Google Sign-In Area */}
          <div className="flex flex-col items-center justify-center space-y-4 pt-1">
            {/* Native Google SDK Button Container (if client ID configured) */}
            <div id="google-signin-btn-container" className="w-full flex justify-center empty:hidden" />

            {/* Stylish Google Auth Button */}
            <button
              type="button"
              onClick={handleFallbackGoogleLogin}
              className="w-full py-3.5 px-5 rounded-2xl bg-white hover:bg-stone-100 text-stone-900 font-semibold text-sm flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
            >
              {/* Official Google 'G' Icon */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Google 계정으로 계속하기
            </button>

            {/* Email prompt modal/inline form if fallback mode */}
            {isPromptingCustomEmail && (
              <form onSubmit={handleCustomEmailSubmit} className="w-full space-y-2.5 pt-2 animate-in fade-in duration-200">
                <input
                  type="email"
                  value={customEmailInput}
                  onChange={(e) => setCustomEmailInput(e.target.value)}
                  placeholder="구글 이메일 주소 입력"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white placeholder-stone-500 text-xs focus:outline-none focus:border-indigo-500"
                  autoFocus
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  확인 및 입장
                </button>
              </form>
            )}

            {/* Authorized Users Only Notice */}
            <div className="pt-2">
              <p className="text-[11px] text-stone-500 font-medium flex items-center justify-center gap-1.5">
                <Lock className="w-3 h-3 text-stone-500" />
                인가된 사용자만 접근 가능
              </p>
            </div>
          </div>
        </div>

        {/* 4 Feature Highlights Grid */}
        <div className="max-w-5xl w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left pt-4">
          <div className="p-5 rounded-2xl bg-stone-950/60 border border-stone-800 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Wand2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">초보자 프롬프트 마법사</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              4단계 질문과 한글 입력만으로 10초 만에 완벽한 8K 마스터 프롬프트를 자동 빌드합니다.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-stone-950/60 border border-stone-800 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <Scan className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">AI 비전 역공학</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              사진이나 스크린샷을 붙여넣으면(Ctrl+V) 조명, 화각, 화풍을 역분해하여 프롬프트로 추출합니다.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-stone-950/60 border border-stone-800 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Blocks className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">레고 블록 빌더</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              피사체, 렌즈, 조명, 스타일 블록 60종을 레고처럼 조립하여 창의적인 비주얼을 설계합니다.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-stone-950/60 border border-stone-800 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">A/B 비교 스튜디오</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              두 개의 프롬프트를 슬라이더와 실시간 이미지 생성으로 정밀 비교하고 튜닝합니다.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-stone-800/80 py-6 text-center text-xs text-stone-500">
        AI Image Prompt Studio • Secure Authentication
      </footer>
    </div>
  );
};
