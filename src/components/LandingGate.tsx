import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Lock,
  Wand2,
  Scan,
  Blocks,
  SlidersHorizontal,
  Compass,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  LogIn,
  KeyRound,
  UserCheck,
  HelpCircle,
  Layers,
  Zap,
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

  // Load Google Identity Services SDK
  useEffect(() => {
    // Check if script already loaded
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

    // Use Vite env client ID if available, otherwise a placeholder for demonstration
    const clientId =
      (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID ||
      'YOUR_GOOGLE_CLIENT_ID_PLACEHOLDER.apps.googleusercontent.com';

    try {
      (window as any).google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleCredentialResponse,
        auto_select: false,
      });

      const btnContainer = document.getElementById('google-signin-btn-container');
      if (btnContainer) {
        (window as any).google.accounts.id.renderButton(btnContainer, {
          theme: 'outline',
          size: 'large',
          type: 'standard',
          shape: 'pill',
          text: 'signin_with',
          logo_alignment: 'left',
          width: 320,
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
      setAuthError(
        `접근 권한이 없는 계정입니다 (${normalizedEmail}). 승인된 교사/관리자 계정으로 로그인해 주세요.`
      );
    }
  };

  // Mock Direct Login for Whitelisted Users (Instant Access)
  const handleDirectWhitelistedLogin = (email: string, displayName: string) => {
    verifyAndLogin(email, displayName);
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
            인증 시스템 보호 중
          </span>
        </div>
      </header>

      {/* Main Hero & Login Box */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-6 py-8 flex flex-col items-center justify-center text-center space-y-10">
        {/* Hero Title */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-800/80 border border-stone-700/80 text-xs font-semibold text-stone-300 shadow-inner">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>승인된 구글 계정 전용 워크스페이스</span>
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

        {/* Login Card with Google SSO and Whitelist Quick Selector */}
        <div className="w-full max-w-md p-7 rounded-3xl bg-stone-950/80 border border-stone-800 backdrop-blur-xl shadow-2xl space-y-6 text-left relative">
          <div className="space-y-1 text-center">
            <h2 className="text-lg font-bold text-white flex items-center justify-center gap-2">
              <LogIn className="w-4 h-4 text-indigo-400" />
              구글 SSO 계정으로 로그인
            </h2>
            <p className="text-xs text-stone-400">
              사전에 등록된 3개의 승인 이메일 계정으로만 입장할 수 있습니다.
            </p>
          </div>

          {/* Error Alert if unapproved account */}
          {authError && (
            <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <p className="leading-snug">{authError}</p>
            </div>
          )}

          {/* Google Official Sign-In Button Container */}
          <div className="flex flex-col items-center justify-center min-h-[44px]">
            <div id="google-signin-btn-container" className="w-full flex justify-center" />
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-stone-800 w-full" />
            <span className="bg-stone-950 px-3 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              또는 승인 계정 선택 로그인
            </span>
          </div>

          {/* Whitelisted Accounts Fast Login Card */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              승인된 화이트리스트 계정 (3명):
            </label>

            <div className="space-y-2">
              {[
                { email: 'kiparang999@gmail.com', name: '기파랑 (관리자)', role: 'Admin' },
                { email: 'hongjinwoo@simin.hs.kr', name: '홍진우 선생님', role: 'Teacher' },
                { email: 'sitech3@simin.hs.kr', name: '시민고 교사 계정', role: 'Teacher' },
              ].map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleDirectWhitelistedLogin(acc.email, acc.name)}
                  className="w-full p-3 rounded-xl border border-stone-800 hover:border-indigo-500/60 bg-stone-900/80 hover:bg-indigo-950/30 text-stone-200 text-xs flex items-center justify-between transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {acc.name[0]}
                    </div>
                    <div className="min-w-0 text-left">
                      <p className="font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                        {acc.name}
                      </p>
                      <p className="text-[11px] text-stone-400 truncate">{acc.email}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-stone-800 text-stone-300 border border-stone-700 group-hover:bg-indigo-600 group-hover:text-white transition-all shrink-0">
                    입장하기 →
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4 Feature Highlights Grid */}
        <div className="max-w-5xl w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left pt-6">
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
        AI Image Prompt Studio • Google SSO Authentication • Authorized for kiparang999, hongjinwoo, sitech3
      </footer>
    </div>
  );
};
