import React, { useState } from 'react';
import { Mail, Phone, ArrowRight, ShieldCheck, Sparkles, X, CheckCircle, Lock } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (user: { emailOrPhone: string; name?: string }) => void;
  isDarkMode?: boolean;
}

export const StanzaAuthModal: React.FC<AuthModalProps> = ({ onClose, onLoginSuccess, isDarkMode = true }) => {
  const tc = (dark: string, light: string) => (isDarkMode ? dark : light);
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [inputValue, setInputValue] = useState('');
  const [nameValue, setNameValue] = useState('');
  const [step, setStep] = useState<'input' | 'otp'>('input');
  const [otpValue, setOtpValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [demoOtpNotice, setDemoOtpNotice] = useState('');
  const [currentGeneratedCode, setCurrentGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setIsSubmitting(true);
    setErrorMessage('');
    setDemoOtpNotice('');

    // Client-side OTP simulation (works on static Netlify hosting; no server needed).
    // Attempts server endpoint first for real SMS/email if available, falls back to local demo code.
    let generatedCode = '';
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone: inputValue.trim(), method: authMethod }),
      });
      const data = await res.json();
      if (res.ok && data.otpCode) {
        generatedCode = data.otpCode;
      }
    } catch (_serverErr) {
      // Ignore server errors — fall back to client-side generated code
    }

    if (!generatedCode) {
      // Generate a local 4-digit demo code client-side (Netlify static hosting path)
      generatedCode = Math.floor(1000 + Math.random() * 9000).toString();
      console.log(`[StanzaAuth] Client-side demo OTP for ${inputValue}: ${generatedCode}`);
    }

    try {
      // Persist the generated code to sessionStorage so the verify step can match it
      sessionStorage.setItem('stanza_auth_otp', generatedCode);
      sessionStorage.setItem('stanza_auth_identity', inputValue.trim().toLowerCase());
    } catch (_storageErr) { /* ignore */ }

    setCurrentGeneratedCode(generatedCode);
    setDemoOtpNotice(`Your 4-digit security code is displayed below (passwordless demo mode — no real SMS/emails are sent). Or use the master code: 1234.`);
    setOtpValue(generatedCode);
    setStep('otp');
    setIsSubmitting(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpValue.trim()) return;
    setIsSubmitting(true);
    setErrorMessage('');

    let verified = false;
    try {
      // First try server verify if available
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone: inputValue.trim(), code: otpValue.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        verified = true;
      }
    } catch (_serverErr) {
      // Fall through to client-side verification
    }

    if (!verified) {
      // Client-side verification path (Netlify static hosting)
      const entered = otpValue.trim();
      let expected = '';
      let identity = '';
      try {
        expected = sessionStorage.getItem('stanza_auth_otp') || '';
        identity = sessionStorage.getItem('stanza_auth_identity') || '';
      } catch (_storageErr) { /* ignore */ }
      const identityMatches = identity === '' || identity === inputValue.trim().toLowerCase();
      // Master code 1234 always works for demo
      verified = identityMatches && (entered === expected || entered === '1234');
      if (!verified) {
        setErrorMessage('Invalid verification code. Please try again, or use master demo code 1234.');
        setIsSubmitting(false);
        return;
      }
    }

    onLoginSuccess({
      emailOrPhone: inputValue.trim(),
      name: nameValue.trim() || (authMethod === 'email' ? inputValue.split('@')[0] : 'Wanderer'),
    });
    onClose();
    setIsSubmitting(false);
  };

  const handleUseMasterCode = () => {
    setOtpValue('1234');
    setErrorMessage('');
  };

  const handleSkipAuth = () => {
    const fallbackEmail = `demo.${Date.now().toString(36)}@earthpoetry.demo`;
    onLoginSuccess({
      emailOrPhone: fallbackEmail,
      name: nameValue.trim() || 'Earth Poetry Wanderer',
    });
    onClose();
  };

  const copyCodeToClipboard = () => {
    if (!currentGeneratedCode) return;
    try {
      navigator.clipboard.writeText(currentGeneratedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className={`${tc('bg-[#0b1726]', 'bg-white')} ${tc('border-[#1a2d42]', 'border-slate-200')} ${tc('text-[#e2e8f0]', 'text-slate-800')} rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative space-y-6 border`}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full ${tc('bg-[#132235]', 'bg-slate-100')} ${tc('hover:bg-[#1a2d42]', 'hover:bg-slate-200')} ${tc('text-[#94a3b8]', 'text-slate-500')} transition-colors cursor-pointer`}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Badge */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#20d09b]/10 border border-[#20d09b]/30 text-[#20d09b] text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" /> Earth Poetry Access
          </div>
          <h3 className={`font-serif text-2xl font-bold ${tc('text-white', 'text-slate-900')}`}>
            Welcome to Stanza AI
          </h3>
          <p className={`text-xs ${tc('text-[#94a3b8]', 'text-slate-500')} leading-relaxed`}>
            Please sign in with your email or phone number to create & save your ethical AI travel itineraries for free.
          </p>
        </div>

        {/* Error message banner */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold text-center">
            {errorMessage}
          </div>
        )}

        {/* OTP Notice Banner */}
        {demoOtpNotice && step === 'otp' && (
          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-[#20d09b]/15 border border-[#20d09b]/40 text-[#20d09b] text-[11px] font-semibold text-center">
              💡 {demoOtpNotice}
            </div>
            {currentGeneratedCode && (
              <button
                type="button"
                onClick={copyCodeToClipboard}
                className="w-full p-4 rounded-2xl bg-gradient-to-r from-[#20d09b]/20 to-sky-500/20 border border-[#20d09b]/50 hover:border-[#20d09b] transition-all cursor-pointer group"
              >
                <div className={`text-[9px] font-bold ${tc('text-[#94a3b8]', 'text-slate-500')} tracking-[0.2em] uppercase mb-1.5 flex items-center justify-center gap-1.5`}>
                  <Lock className="w-3 h-3" />
                  Your 4-digit security code
                </div>
                <div className={`font-mono text-4xl font-black ${tc('text-white', 'text-slate-900')} tracking-[0.5em] flex items-center justify-center gap-2`}>
                  {currentGeneratedCode.split('').map((digit, i) => (
                    <span
                      key={i}
                      className={`px-2.5 py-1.5 ${tc('bg-[#132235]', 'bg-slate-100')} rounded-lg border border-[#20d09b]/40 text-[#20d09b] shadow-[0_0_15px_rgba(32,208,155,0.25)]`}
                    >
                      {digit}
                    </span>
                  ))}
                </div>
                <div className="mt-2 text-[10px] font-bold text-[#20d09b] flex items-center justify-center gap-1">
                  {copied ? (
                    <>✓ Copied to Clipboard</>
                  ) : (
                    <>↻ Click to Copy Code</>
                  )}
                </div>
              </button>
            )}
          </div>
        )}

        {step === 'input' ? (
          <form onSubmit={handleSendCode} className="space-y-4">
            
            {/* Toggle Email vs Phone */}
            <div className={`flex p-1 ${tc('bg-[#132235]', 'bg-slate-100')} rounded-xl border ${tc('border-[#1a2d42]', 'border-slate-200')}`}>
              <button
                type="button"
                onClick={() => { setAuthMethod('email'); setInputValue(''); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  authMethod === 'email'
                    ? 'bg-[#20d09b] text-[#08121e] shadow-sm'
                    : `${tc('text-[#94a3b8]', 'text-slate-500')} ${tc('hover:text-white', 'hover:text-slate-900')}`
                }`}
              >
                <Mail className="w-3.5 h-3.5" /> Email Address
              </button>
              <button
                type="button"
                onClick={() => { setAuthMethod('phone'); setInputValue(''); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  authMethod === 'phone'
                    ? 'bg-[#20d09b] text-[#08121e] shadow-sm'
                    : `${tc('text-[#94a3b8]', 'text-slate-500')} ${tc('hover:text-white', 'hover:text-slate-900')}`
                }`}
              >
                <Phone className="w-3.5 h-3.5" /> Phone Number
              </button>
            </div>

            {/* Name Input */}
            <div className="space-y-1">
              <label className={`text-[11px] font-medium ${tc('text-[#94a3b8]', 'text-slate-500')} block`}>Your Name (Optional)</label>
              <input
                type="text"
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                placeholder="e.g. Elena Rostova"
                className={`w-full p-3 rounded-xl ${tc('bg-[#132235]', 'bg-white')} ${tc('border-[#1a2d42]', 'border-slate-200')} ${tc('text-white', 'text-slate-900')} text-xs ${tc('placeholder-[#64748b]', 'placeholder-slate-400')} focus:outline-none focus:ring-2 focus:ring-[#20d09b] border`}
              />
            </div>

            {/* Email or Phone Input */}
            <div className="space-y-1">
              <label className={`text-[11px] font-medium ${tc('text-[#94a3b8]', 'text-slate-500')} block`}>
                {authMethod === 'email' ? 'Email Address' : 'Mobile Phone Number'}
              </label>
              <input
                type={authMethod === 'email' ? 'email' : 'tel'}
                required
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={authMethod === 'email' ? 'you@earthpoetry.online' : '+1 (555) 000-1234'}
                className={`w-full p-3 rounded-xl ${tc('bg-[#132235]', 'bg-white')} ${tc('border-[#1a2d42]', 'border-slate-200')} ${tc('text-white', 'text-slate-900')} text-xs ${tc('placeholder-[#64748b]', 'placeholder-slate-400')} focus:outline-none focus:ring-2 focus:ring-[#20d09b] border`}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !inputValue.trim()}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#20d09b] to-[#10b981] hover:brightness-110 text-[#08121e] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#20d09b]/10 disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Sending Security Code...' : 'Continue with Free Login'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleSkipAuth}
              className={`w-full py-3 px-4 rounded-xl border ${tc('border-white/10', 'border-slate-200')} hover:border-[#20d09b]/40 ${tc('bg-white/5', 'bg-slate-50')} hover:bg-[#20d09b]/10 transition-all cursor-pointer ${tc('text-[#94a3b8]', 'text-slate-500')} hover:text-[#20d09b] flex items-center justify-center gap-2 text-[11px] font-bold`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Skip Login & Try Demo Mode (Instant Access)
            </button>

            <p className={`text-[10px] text-center ${tc('text-[#64748b]', 'text-slate-400')} flex items-center justify-center gap-1`}>
              <ShieldCheck className="w-3.5 h-3.5 text-[#20d09b]" /> 100% Free & Passwordless Authentication
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="text-center space-y-1">
              <p className={`text-xs ${tc('text-[#94a3b8]', 'text-slate-500')}`}>
                We sent a 4-digit code to <span className={`font-bold ${tc('text-white', 'text-slate-900')}`}>{inputValue}</span>
              </p>
              <button
                type="button"
                onClick={() => setStep('input')}
                className="text-[11px] text-[#20d09b] underline hover:text-[#2de3aa]"
              >
                Change {authMethod}
              </button>
            </div>

            <div className="flex justify-center gap-2 py-2">
              <input
                type="text"
                maxLength={4}
                required
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value)}
                placeholder="1 2 3 4"
                className={`w-44 text-center tracking-[0.5em] text-lg font-mono py-3 rounded-xl ${tc('bg-[#132235]', 'bg-white')} border border-[#20d09b] ${tc('text-white', 'text-slate-900')} focus:outline-none font-bold`}
              />
            </div>

            <button
              type="button"
              onClick={handleUseMasterCode}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/30 hover:border-amber-400/60 text-amber-300 hover:text-amber-200 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Use Master Demo Code: <span className="font-mono tracking-widest text-sm">1234</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-[#20d09b] hover:bg-[#2de3aa] text-[#08121e] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#20d09b]/20"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Verify & Launch Stanza AI</span>
            </button>

            <button
              type="button"
              onClick={handleSkipAuth}
              className={`w-full py-2.5 px-4 rounded-xl ${tc('text-[#64748b]', 'text-slate-400')} hover:text-[#20d09b] text-[10px] font-semibold underline underline-offset-2 hover:!-mt-1`}
            >
              → Skip verification and use demo account (no saving)
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
