import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  Play,
  Compass,
  Sparkles,
  Shield,
  Zap,
  Globe,
  Award,
  ChevronRight,
  ArrowRight,
  Cpu,
  Monitor,
  Package,
  Layers,
  CheckCircle,
  HelpCircle,
  Mail,
  Send,
  Gamepad2,
  ExternalLink,
  ShieldAlert,
  Clock,
  Database,
  Sliders,
  Maximize2,
  X,
  FileText,
  Key,
  Star,
  Users,
  Check
} from 'lucide-react';
import Logo from '../../components/common/Logo';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { useAudio } from '../../context/AudioContext';
import { useBranding } from '../../context/BrandingContext';
import RequirementsChecker from './RequirementsChecker';
import PlayerSystemShowcase from './PlayerSystemShowcase';
import AdminPanelShowcase from './AdminPanelShowcase';
import TechnicalArchitectureShowcase from './TechnicalArchitectureShowcase';
import CustomizationDemo from './CustomizationDemo';
import GuidedTour from './GuidedTour';
import api from '../../services/api';

/**
 * Master Interactive Buyer Demo Room (/buyer-demo)
 * The premier B2B software and game product evaluation room.
 * Allows prospective buyers to validate private tokens, experience a 16-section guided tour,
 * inspect the 4 worlds, evaluate 3D gameplay, test white-label reskinning, and submit commercial quotes.
 */
export default function BuyerDemoHubPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { playClick, playPortal } = useAudio();
  const { branding } = useBranding();

  // Mode: 'hub' (main landing/showcase) or 'tour' (guided 16-section walkthrough)
  const [viewMode, setViewMode] = useState('hub');

  // Private Access Token State
  const [tokenInput, setTokenInput] = useState('');
  const [validatingToken, setValidatingToken] = useState(false);
  const [verifiedAccess, setVerifiedAccess] = useState(null);
  const [tokenError, setTokenError] = useState(null);

  // Inquiry Form State
  const [quoteInquiryType, setQuoteInquiryType] = useState('game_purchase');
  const [inquiryData, setInquiryData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    country: '',
    budget_range: '$25k-$50k',
    preferred_contact: 'email',
    message: ''
  });
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [inquiryError, setInquiryError] = useState(null);

  // Evaluation Feedback State
  const [feedbackScore, setFeedbackScore] = useState(5);
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Check URL token parameter on mount
  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setTokenInput(urlToken);
      validateBuyerToken(urlToken);
    }
  }, [searchParams]);

  const validateBuyerToken = async (tokenToTest) => {
    const token = tokenToTest || tokenInput;
    if (!token) return;

    setValidatingToken(true);
    setTokenError(null);

    try {
      const res = await api.post('/buyer-demo/validate-token', { token });
      if (res.data?.data) {
        setVerifiedAccess(res.data.data);
        sessionStorage.setItem('aervyn_buyer_demo_token', token);
        if (res.data.data.company) {
          setInquiryData(prev => ({ ...prev, company: res.data.data.company, name: res.data.data.buyer_name || '' }));
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Token verification failed.';
      setTokenError(msg);
      setVerifiedAccess(null);
    } finally {
      setValidatingToken(false);
    }
  };

  const handleStartGuidedTour = () => {
    playPortal();
    playClick();
    setViewMode('tour');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCustomizationRequest = (customConfig) => {
    setQuoteInquiryType('customization');
    setInquiryData(prev => ({
      ...prev,
      message: `I would like to request a custom white-label build with Title: "${customConfig.gameTitle}", Company: "${customConfig.companyName}", Primary Color: ${customConfig.primaryColor}.`
    }));
    const el = document.getElementById('inquiry-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setSubmittingInquiry(true);
    setInquiryError(null);
    setInquirySuccess(false);

    try {
      await api.post('/inquiries', {
        ...inquiryData,
        inquiry_type: quoteInquiryType
      });
      setInquirySuccess(true);
    } catch (err) {
      setInquiryError(err.response?.data?.message || 'Failed to submit inquiry.');
    } finally {
      setSubmittingInquiry(false);
    }
  };

  const handleFeedbackSubmit = async () => {
    const sessionId = sessionStorage.getItem('aervyn_buyer_demo_session') || ('hub_' + Math.random().toString(36).substring(2, 10));
    try {
      await api.post('/buyer-demo/session/feedback', {
        session_id: sessionId,
        score: feedbackScore,
        notes: feedbackNotes
      });
      setFeedbackSubmitted(true);
    } catch (err) {}
  };

  return (
    <div className="min-h-screen bg-[#050814] text-gray-200 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* If Tour mode is active, render the 16-step Guided Tour full-view */}
      {viewMode === 'tour' ? (
        <div className="max-w-6xl mx-auto px-4 py-8">
          <GuidedTour
            onExit={() => setViewMode('hub')}
            onLaunchPlayableDemo={() => navigate('/demo')}
            onRequestQuote={() => {
              setViewMode('hub');
              setTimeout(() => {
                const el = document.getElementById('inquiry-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
          />
        </div>
      ) : (
        <>
          {/* 1. HERO ENTRY SECTION */}
          <section
            className="relative py-16 px-6 text-center overflow-hidden border-b border-cyan-500/20"
            style={{
              background: 'radial-gradient(circle at 50% 30%, rgba(22, 140, 255, 0.22) 0%, rgba(112, 71, 255, 0.12) 35%, rgba(5, 8, 20, 0.98) 75%)'
            }}
          >
            <div className="max-w-4xl mx-auto relative z-10">
              <div className="mb-4">
                <Logo size="hero" glow={true} showTagline={false} />
              </div>

              <div className="flex justify-center gap-2 mb-3">
                <Badge variant="cyan" size="md" className="font-mono uppercase tracking-wider">
                  INTERACTIVE B2B PRODUCT DEMO ROOM
                </Badge>
                {verifiedAccess && (
                  <Badge variant="green" size="md" className="font-mono uppercase">
                    VIP EVALUATOR ACCESS: {verifiedAccess.buyer_name}
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-wider text-white mb-3">
                Welcome to the AERVYN Interactive Product Showcase
              </h1>

              <p className="text-sm font-semibold text-cyan-400 font-mono tracking-widest uppercase mb-4">
                {branding.tagline || 'CHANGE THE PAST. SURVIVE THE PRESENT. DISCOVER THE FUTURE.'}
              </p>

              <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
                Experience the real, implemented AERVYN product. Explore the single-player 3D game engine, inspect the 4 story worlds, test read-only player and admin suites, evaluate technical architecture, and customize live white-label branding.
              </p>

              {/* 6 Core Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                <Button
                  variant="cyan"
                  size="lg"
                  icon={Sparkles}
                  onClick={handleStartGuidedTour}
                >
                  START GUIDED TOUR
                </Button>

                <Link to="/demo" onClick={playPortal}>
                  <Button variant="outline" size="lg" icon={Play} className="border-cyan-400 text-cyan-300">
                    EXPLORE GAME DEMO
                  </Button>
                </Link>

                <a href="#player-showcase" onClick={playClick}>
                  <Button variant="ghost" size="lg" icon={Users} className="border border-purple-500/40 text-purple-300">
                    EXPLORE PLAYER SYSTEM
                  </Button>
                </a>

                <a href="#admin-showcase" onClick={playClick}>
                  <Button variant="ghost" size="lg" icon={Sliders} className="border border-amber-500/40 text-amber-300">
                    EXPLORE ADMIN SHOWCASE
                  </Button>
                </a>

                <a href="#tech-showcase" onClick={playClick}>
                  <Button variant="ghost" size="lg" icon={Cpu} className="border border-gray-700 text-gray-300">
                    VIEW TECHNICAL DETAILS
                  </Button>
                </a>

                <a href="#inquiry-section" onClick={playClick}>
                  <Button variant="cyan" size="lg" icon={Send} className="bg-gradient-to-r from-cyan-600 to-purple-600">
                    REQUEST A QUOTE
                  </Button>
                </a>
              </div>

              {/* Private Token Verification Card */}
              <div className="max-w-xl mx-auto p-4 rounded-xl bg-gray-900/80 border border-gray-800 text-left">
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-300">
                  <Key className="w-4 h-4 text-cyan-400" />
                  <span>Private Buyer Access Token (Optional)</span>
                </div>
                
                {verifiedAccess ? (
                  <div className="p-3 rounded bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between">
                    <div>
                      <strong>Verified Access:</strong> {verifiedAccess.buyer_name} ({verifiedAccess.company || 'Private Buyer'})
                      <div className="text-[11px] text-gray-400 mt-0.5">
                        Tier: {verifiedAccess.access_tier.toUpperCase()} • Sessions: {verifiedAccess.access_count} of {verifiedAccess.access_limit || '∞'}
                      </div>
                    </div>
                    <Badge variant="green" size="sm">ACTIVE</Badge>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Paste your private demo token (e.g. aervyn_demo_...)"
                        value={tokenInput}
                        onChange={(e) => setTokenInput(e.target.value)}
                        className="flex-1 px-3 py-2 rounded bg-gray-950 border border-gray-700 text-xs text-white outline-none focus:border-cyan-500 font-mono"
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => validateBuyerToken()}
                        disabled={validatingToken || !tokenInput}
                        className="text-xs"
                      >
                        {validatingToken ? 'Validating...' : 'Validate Token'}
                      </Button>
                    </div>
                    {tokenError && (
                      <p className="text-xs text-rose-400 mt-2 font-mono">{tokenError}</p>
                    )}
                    <p className="text-[11px] text-gray-500 mt-2">
                      Tokens are generated by administrators for qualified B2B evaluators and expire automatically. Public visitors may explore without a token.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* 2. BROWSER & HARDWARE REQUIREMENTS CHECKER */}
          <section className="py-12 px-6 max-w-6xl mx-auto">
            <RequirementsChecker />
          </section>

          {/* 3. GAME WORLDS EXPLORER */}
          <section id="worlds-showcase" className="py-12 px-6 max-w-6xl mx-auto border-t border-gray-800">
            <div className="text-center mb-8">
              <Badge variant="cyan" size="sm" className="mb-1 font-mono">CHRONOLOGICAL SETTINGS</Badge>
              <h2 className="text-2xl font-bold text-white">4 Distinct Narrative Story Worlds</h2>
              <p className="text-xs text-gray-400 mt-1">Each world features unique 3D visual atmospheric shaders, physics terrain, and environmental puzzle mechanics.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: 'World 1: The Lost Kingdom', epoch: 'Past Era -840', desc: 'Ancient stone fortresses, overgrown mystic sanctums, and runic dial mechanisms.', border: 'border-cyan-500/30', color: 'text-cyan-400' },
                { title: 'World 2: The Broken Present', epoch: 'Current Era 2026', desc: 'Dystopian urban ruins, fractured concrete corridors, and electrified puddles.', border: 'border-amber-500/30', color: 'text-amber-400' },
                { title: 'World 3: The Fractured Future', epoch: 'Future Era 2480', desc: 'Neon cyber platforms, quantum frequency barriers, and security sentries.', border: 'border-purple-500/30', color: 'text-purple-400' },
                { title: 'Final Chapter: The Last Timeline', epoch: 'Nexus Convergence', desc: 'Floating celestial platforms at the convergence point with Dual Narrative Endings.', border: 'border-emerald-500/30', color: 'text-emerald-400' }
              ].map((w, idx) => (
                <div key={idx} className={`p-5 rounded-xl bg-gray-900/60 border ${w.border} flex flex-col justify-between`}>
                  <div>
                    <span className={`text-[11px] font-mono font-bold uppercase block mb-1 ${w.color}`}>{w.epoch}</span>
                    <h4 className="font-bold text-sm text-white mb-2">{w.title}</h4>
                    <p className="text-xs text-gray-400 leading-relaxed mb-4">{w.desc}</p>
                  </div>
                  <Link to="/demo" onClick={playPortal}>
                    <Button variant="ghost" size="sm" className="w-full text-xs border border-gray-700 hover:border-cyan-400">
                      Launch 3D Slice &rarr;
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* 4. PLAYER SYSTEM SHOWCASE */}
          <section id="player-showcase" className="py-12 px-6 max-w-6xl mx-auto border-t border-gray-800">
            <PlayerSystemShowcase />
          </section>

          {/* 5. ADMIN PANEL SHOWCASE */}
          <section id="admin-showcase" className="py-12 px-6 max-w-6xl mx-auto border-t border-gray-800">
            <AdminPanelShowcase />
          </section>

          {/* 6. TECHNICAL ARCHITECTURE SHOWCASE */}
          <section id="tech-showcase" className="py-12 px-6 max-w-6xl mx-auto border-t border-gray-800">
            <TechnicalArchitectureShowcase />
          </section>

          {/* 7. CUSTOMIZATION & WHITE-LABEL DEMO */}
          <section id="customization-showcase" className="py-12 px-6 max-w-6xl mx-auto border-t border-gray-800">
            <CustomizationDemo onRequestCustomization={handleCustomizationRequest} />
          </section>

          {/* 8. COMMERCIAL PACKAGES & INQUIRY FORM */}
          <section id="inquiry-section" className="py-16 px-6 bg-[#040610] border-t border-cyan-500/30">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <Badge variant="gold" size="sm" className="mb-2 font-mono">COMMERCIAL ACQUISITION</Badge>
                <h2 className="text-3xl font-black text-white">Request Quotation & Technical Evaluation</h2>
                <p className="text-xs text-gray-400 mt-2 max-w-xl mx-auto">
                  Submit an inquiry directly to our commercial engineering team for full source code buyout, custom commissioning, or white-label syndication.
                </p>
              </div>

              {/* Package Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                  { id: 'game_purchase', title: 'Package A: Source Buyout', desc: 'Complete React 19 + Three.js + Laravel 12 source with 100% royalty-free rights.' },
                  { id: 'customization', title: 'Package B: Game + Customization', desc: 'Full game source code plus 40 hours of bespoke level and puzzle commissioning.' },
                  { id: 'white_label', title: 'Package C: White-Label Edition', desc: 'Unrestricted white-label commercial distribution rights and multi-tenant setup.' }
                ].map(pkg => (
                  <div
                    key={pkg.id}
                    onClick={() => setQuoteInquiryType(pkg.id)}
                    className={`p-4 rounded-xl cursor-pointer border transition-all ${
                      quoteInquiryType === pkg.id
                        ? 'bg-cyan-950/40 border-cyan-400 shadow-lg shadow-cyan-500/20'
                        : 'bg-gray-900/60 border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <strong className="text-xs text-white font-bold">{pkg.title}</strong>
                      {quoteInquiryType === pkg.id && <CheckCircle className="w-4 h-4 text-cyan-400" />}
                    </div>
                    <p className="text-[11px] text-gray-400 leading-relaxed">{pkg.desc}</p>
                    <span className="text-xs font-mono font-bold text-cyan-300 mt-3 block">Contact for Quote</span>
                  </div>
                ))}
              </div>

              {/* Form Card */}
              <div className="p-6 sm:p-8 rounded-2xl bg-gray-900/90 border border-cyan-500/30 shadow-2xl">
                {inquirySuccess ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-white mb-2">Commercial Inquiry Logged Successfully</h3>
                    <p className="text-xs text-gray-300 max-w-md mx-auto mb-6 leading-relaxed">
                      Thank you for evaluating AERVYN: Echoes of Time. Your inquiry has been routed directly to our commercial lead CRM. An engineering representative will respond within 24 business hours.
                    </p>
                    <Button variant="outline" size="sm" onClick={() => setInquirySuccess(false)}>
                      Submit Another Inquiry
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-4">
                    {inquiryError && (
                      <div className="p-3 rounded bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs">
                        {inquiryError}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-300 block mb-1">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={inquiryData.name}
                          onChange={(e) => setInquiryData({ ...inquiryData, name: e.target.value })}
                          placeholder="e.g. Jane Doe"
                          className="w-full p-2.5 rounded bg-gray-950 border border-gray-800 text-xs text-white outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-300 block mb-1">Business Email *</label>
                        <input
                          type="email"
                          required
                          value={inquiryData.email}
                          onChange={(e) => setInquiryData({ ...inquiryData, email: e.target.value })}
                          placeholder="jane@company.com"
                          className="w-full p-2.5 rounded bg-gray-950 border border-gray-800 text-xs text-white outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs text-gray-300 block mb-1">Company / Organization</label>
                        <input
                          type="text"
                          value={inquiryData.company}
                          onChange={(e) => setInquiryData({ ...inquiryData, company: e.target.value })}
                          placeholder="Acme Interactive"
                          className="w-full p-2.5 rounded bg-gray-950 border border-gray-800 text-xs text-white outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-300 block mb-1">Budget Allocation</label>
                        <select
                          value={inquiryData.budget_range}
                          onChange={(e) => setInquiryData({ ...inquiryData, budget_range: e.target.value })}
                          className="w-full p-2.5 rounded bg-gray-950 border border-gray-800 text-xs text-white outline-none focus:border-cyan-500"
                        >
                          <option value="Under $10k">Under $10,000</option>
                          <option value="$10k-$25k">$10,000 – $25,000</option>
                          <option value="$25k-$50k">$25,000 – $50,000</option>
                          <option value="$50k+">$50,000+</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-gray-300 block mb-1">Preferred Contact</label>
                        <select
                          value={inquiryData.preferred_contact}
                          onChange={(e) => setInquiryData({ ...inquiryData, preferred_contact: e.target.value })}
                          className="w-full p-2.5 rounded bg-gray-950 border border-gray-800 text-xs text-white outline-none focus:border-cyan-500"
                        >
                          <option value="email">Email</option>
                          <option value="video_call">Video Conference</option>
                          <option value="phone">Phone / WhatsApp</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-gray-300 block mb-1">Requirements & Timeline Notes *</label>
                      <textarea
                        required
                        rows={3}
                        value={inquiryData.message}
                        onChange={(e) => setInquiryData({ ...inquiryData, message: e.target.value })}
                        placeholder="Detail your deployment platform, target audience, commercial timeline, or custom feature requests..."
                        className="w-full p-2.5 rounded bg-gray-950 border border-gray-800 text-xs text-white outline-none focus:border-cyan-500 resize-vertical"
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <Button
                        type="submit"
                        variant="cyan"
                        size="md"
                        icon={Send}
                        disabled={submittingInquiry}
                      >
                        {submittingInquiry ? 'Submitting...' : 'Submit Commercial Request'}
                      </Button>
                    </div>
                  </form>
                )}
              </div>

              {/* Evaluation Feedback Widget */}
              <div className="mt-8 p-4 rounded-xl bg-gray-900/60 border border-gray-800 text-center">
                <span className="text-xs text-gray-400 block mb-2">How would you rate the AERVYN Interactive Showcase?</span>
                {feedbackSubmitted ? (
                  <span className="text-xs text-emerald-400 font-mono">Thank you for your rating!</span>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setFeedbackScore(star)}
                          className={`p-1 text-sm ${star <= feedbackScore ? 'text-amber-400' : 'text-gray-600'}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleFeedbackSubmit} className="text-xs">
                      Submit Rating
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="py-8 px-6 bg-[#03050d] border-t border-gray-800 text-center text-xs text-gray-500">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Logo size="sm" showText={false} />
                <span>© {new Date().getFullYear()} {branding.gameTitle || 'AERVYN: ECHOES OF TIME'}. Commercial Product Handover.</span>
              </div>
              <div className="flex items-center gap-4">
                <Link to="/" className="hover:text-cyan-400 transition-colors">Main Website</Link>
                <Link to="/brochure" className="hover:text-cyan-400 transition-colors">Printable Brochure</Link>
                <Link to="/demo" className="hover:text-cyan-400 transition-colors">Playable 3D Demo</Link>
                <Link to="/admin/login" className="hover:text-cyan-400 transition-colors">Admin Portal</Link>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
