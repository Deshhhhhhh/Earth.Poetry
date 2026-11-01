import React, { useState } from 'react';
import { Code, Globe, Server, Key, X, Copy, Check, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';

interface EmbedGuideModalProps {
  onClose: () => void;
  isDarkMode?: boolean;
}

export const StanzaEmbedGuideModal: React.FC<EmbedGuideModalProps> = ({ onClose, isDarkMode = true }) => {
  const tc = (dark: string, light: string) => (isDarkMode ? dark : light);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const currentAppUrl = window.location.origin;

  const iframeCode = `<!-- Earth Poetry Stanza AI Travel Curator iFrame -->
<iframe 
  src="${currentAppUrl}" 
  width="100%" 
  height="850px" 
  style="border:none; border-radius:20px; width:100%; max-width:1200px; margin:0 auto; display:block;"
  allow="clipboard-write"
></iframe>`;

  const apiCode = `// Fetch AI Travel Itinerary from your existing website JS / React app
async function generateStanzaItinerary() {
  const response = await fetch('${currentAppUrl}/api/itinerary/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      promptText: '5 days solo travel in Bali on a realistic budget...',
      durationDays: 5,
      currency: 'USD',
      travelerType: 'Solo',
      budgetTier: 'Budget-Conscious'
    })
  });
  const data = await response.json();
  console.log('AI Itinerary Data:', data.itinerary);
}`;

  const otpEnvCode = `# Optional: Set these in your server environment for live SMS & Email OTP
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+18005550199

# SendGrid / SMTP for live Email OTP
SENDGRID_API_KEY=your_sendgrid_api_key
GEMINI_API_KEY=your_gemini_api_key`;

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className={`${tc('bg-[#08121e]', 'bg-white')} ${tc('border-[#1a2d42]', 'border-slate-200')} ${tc('text-[#e2e8f0]', 'text-slate-800')} rounded-3xl w-full max-w-3xl p-6 sm:p-8 shadow-2xl relative space-y-6 my-8 border`}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full ${tc('bg-[#132235]', 'bg-slate-100')} ${tc('hover:bg-[#1a2d42]', 'hover:bg-slate-200')} ${tc('text-[#94a3b8]', 'text-slate-500')} transition-colors cursor-pointer`}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#20d09b]/10 border border-[#20d09b]/30 text-[#20d09b] text-xs font-semibold uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5" /> Website Integration & OTP Setup Guide
          </div>
          <h3 className={`font-serif text-2xl sm:text-3xl font-bold ${tc('text-white', 'text-slate-900')}`}>
            Attach Stanza AI to Your Website
          </h3>
          <p className={`text-xs sm:text-sm ${tc('text-[#94a3b8]', 'text-slate-500')} leading-relaxed`}>
            Follow these 3 simple methods to integrate Earth Poetry Stanza AI into your existing domain (<span className="text-[#20d09b] font-mono">earthpoetry.online</span>) and enable OTP authentication.
          </p>
        </div>

        {/* Option 1: One-Line iFrame Embed */}
        <div className={`p-5 rounded-2xl ${tc('bg-[#132235]', 'bg-slate-100')} border ${tc('border-[#1a2d42]', 'border-slate-200')} space-y-3`}>
          <div className="flex items-center justify-between">
            <h4 className={`font-serif text-sm font-bold ${tc('text-white', 'text-slate-900')} flex items-center gap-2`}>
              <Code className="w-4 h-4 text-[#20d09b]" />
              Method 1: Embed as an iFrame (Instant 1-Minute Setup)
            </h4>
            <button
              onClick={() => handleCopy(iframeCode, 1)}
              className={`px-3 py-1.5 rounded-lg ${tc('bg-[#0b1726]', 'bg-white')} ${tc('hover:bg-[#1a2d42]', 'hover:bg-slate-200')} text-xs font-bold text-[#20d09b] border ${tc('border-[#1a2d42]', 'border-slate-200')} flex items-center gap-1.5 transition-colors cursor-pointer`}
            >
              {copiedIndex === 1 ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedIndex === 1 ? 'Copied HTML!' : 'Copy Code'}</span>
            </button>
          </div>
          <p className={`text-xs ${tc('text-[#94a3b8]', 'text-slate-500')}`}>
            Paste this HTML snippet anywhere inside your existing website's HTML, WordPress, Webflow, or Wix editor:
          </p>
          <pre className={`p-3.5 rounded-xl ${tc('bg-[#08121e]', 'bg-slate-50')} border ${tc('border-[#1a2d42]', 'border-slate-200')} text-[11px] font-mono text-[#20d09b] overflow-x-auto`}>
            {iframeCode}
          </pre>
        </div>

        {/* Option 2: REST API Call */}
        <div className={`p-5 rounded-2xl ${tc('bg-[#132235]', 'bg-slate-100')} border ${tc('border-[#1a2d42]', 'border-slate-200')} space-y-3`}>
          <div className="flex items-center justify-between">
            <h4 className={`font-serif text-sm font-bold ${tc('text-white', 'text-slate-900')} flex items-center gap-2`}>
              <Server className="w-4 h-4 text-sky-400" />
              Method 2: Connect via REST API Endpoint
            </h4>
            <button
              onClick={() => handleCopy(apiCode, 2)}
              className={`px-3 py-1.5 rounded-lg ${tc('bg-[#0b1726]', 'bg-white')} ${tc('hover:bg-[#1a2d42]', 'hover:bg-slate-200')} text-xs font-bold text-sky-400 border ${tc('border-[#1a2d42]', 'border-slate-200')} flex items-center gap-1.5 transition-colors cursor-pointer`}
            >
              {copiedIndex === 2 ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedIndex === 2 ? 'Copied JS!' : 'Copy API Code'}</span>
            </button>
          </div>
          <p className={`text-xs ${tc('text-[#94a3b8]', 'text-slate-500')}`}>
            Send prompt requests directly to this application backend from your custom web frontend:
          </p>
          <pre className={`p-3.5 rounded-xl ${tc('bg-[#08121e]', 'bg-slate-50')} border ${tc('border-[#1a2d42]', 'border-slate-200')} text-[11px] font-mono text-sky-300 overflow-x-auto`}>
            {apiCode}
          </pre>
        </div>

        {/* Option 3: OTP Setup (Twilio / SendGrid) */}
        <div className={`p-5 rounded-2xl ${tc('bg-[#132235]', 'bg-slate-100')} border ${tc('border-[#1a2d42]', 'border-slate-200')} space-y-3`}>
          <div className="flex items-center justify-between">
            <h4 className={`font-serif text-sm font-bold ${tc('text-white', 'text-slate-900')} flex items-center gap-2`}>
              <Key className="w-4 h-4 text-amber-400" />
              Method 3: OTP via Email or Phone Number Configuration
            </h4>
            <button
              onClick={() => handleCopy(otpEnvCode, 3)}
              className={`px-3 py-1.5 rounded-lg ${tc('bg-[#0b1726]', 'bg-white')} ${tc('hover:bg-[#1a2d42]', 'hover:bg-slate-200')} text-xs font-bold text-amber-400 border ${tc('border-[#1a2d42]', 'border-slate-200')} flex items-center gap-1.5 transition-colors cursor-pointer`}
            >
              {copiedIndex === 3 ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedIndex === 3 ? 'Copied Env!' : 'Copy Env Keys'}</span>
            </button>
          </div>
          <p className={`text-xs ${tc('text-[#94a3b8]', 'text-slate-500')}`}>
            The app currently runs in <strong>Smart Simulated OTP Mode</strong> (so you and your users can log in instantly with email/phone & 4-digit codes). To send live SMS or Emails, set these variables in your <code className={`text-[#20d09b] ${tc('bg-[#08121e]', 'bg-slate-100')} px-1.5 py-0.5 rounded`}>.env</code> file:
          </p>
          <pre className={`p-3.5 rounded-xl ${tc('bg-[#08121e]', 'bg-slate-50')} border ${tc('border-[#1a2d42]', 'border-slate-200')} text-[11px] font-mono text-amber-300 overflow-x-auto`}>
            {otpEnvCode}
          </pre>
        </div>

        {/* Subdomain CNAME tip */}
        <div className="p-4 rounded-xl bg-[#20d09b]/10 border border-[#20d09b]/30 text-xs text-[#20d09b] flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Custom Subdomain CNAME Setup (e.g. planner.earthpoetry.online):</p>
            <p className={`${tc('text-white/80', 'text-slate-700')}`}>
              In your domain DNS manager (Cloudflare, GoDaddy, Namecheap), add a CNAME record mapping <code className={`${tc('bg-[#08121e]', 'bg-slate-100')} px-1 rounded text-[#20d09b]`}>planner</code> to your Cloud Run host target: <code className={`${tc('bg-[#08121e]', 'bg-slate-100')} px-1 rounded ${tc('text-white', 'text-slate-900')}`}>{window.location.hostname}</code>.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
