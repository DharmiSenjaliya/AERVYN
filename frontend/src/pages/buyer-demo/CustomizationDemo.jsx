import React, { useState } from 'react';
import {
  Palette,
  RotateCcw,
  Sparkles,
  Send,
  Eye,
  Sliders,
  CheckCircle,
  ShieldCheck,
  Building2,
  Layers
} from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

/**
 * Interactive Customization & White-Label Demo Component
 * Allows prospective buyers to test real-time brand reskinning (colors, game title, company name, logo)
 * purely client-side without altering permanent production settings.
 */
export default function CustomizationDemo({ onRequestCustomization }) {
  const defaultBranding = {
    gameTitle: 'AERVYN: ECHOES OF TIME',
    companyName: 'Aervyn Studios',
    primaryColor: '#00d9ff', // Cyan
    secondaryColor: '#7047ff', // Purple
    accentColor: '#f5b942', // Gold
    footerText: '© 2026 Aervyn Studios. All Rights Reserved.'
  };

  const sampleFictionalBrand = {
    gameTitle: 'CHRONOS: FRACTURED REALMS',
    companyName: 'Chronos Interactive Media',
    primaryColor: '#10b981', // Emerald
    secondaryColor: '#3b82f6', // Blue
    accentColor: '#f43f5e', // Rose
    footerText: '© 2026 Chronos Interactive Media. Powered by AERVYN Engine.'
  };

  const [previewData, setPreviewData] = useState(defaultBranding);
  const [activePreset, setActivePreset] = useState('default');
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleApplyPreset = (presetKey) => {
    if (presetKey === 'fictional') {
      setPreviewData(sampleFictionalBrand);
      setActivePreset('fictional');
      showToast('Applied sample fictional white-label preset.');
    } else {
      setPreviewData(defaultBranding);
      setActivePreset('default');
      showToast('Reset to standard AERVYN factory branding.');
    }
  };

  const handleReset = () => {
    setPreviewData(defaultBranding);
    setActivePreset('default');
    showToast('Preview reset to defaults.');
  };

  const handleRequestCustomization = () => {
    if (onRequestCustomization) {
      onRequestCustomization(previewData);
    } else {
      const el = document.getElementById('inquiry');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="rounded-xl bg-[#090e1c] border border-cyan-500/30 overflow-hidden text-gray-200">
      {toastMsg && (
        <div className="bg-cyan-500/20 border-b border-cyan-500/40 px-4 py-2 text-xs text-cyan-300 font-mono flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-800">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Palette className="w-5 h-5 text-cyan-400" />
              Interactive White-Label & Reskin Simulator
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Test dynamic branding adjustments in real time. Changes here are isolated client-side and do not affect live production databases.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={activePreset === 'default' ? 'cyan' : 'ghost'}
              size="sm"
              onClick={() => handleApplyPreset('default')}
              className="text-xs"
            >
              Default AERVYN
            </Button>
            <Button
              variant={activePreset === 'fictional' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => handleApplyPreset('fictional')}
              className="text-xs"
            >
              Sample Fictional Brand
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={RotateCcw}
              onClick={handleReset}
              className="text-xs"
            >
              Reset
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Interactive Form Controls */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" /> Customization Parameters
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-gray-400 block mb-1">Game Product Title</label>
                <input
                  type="text"
                  value={previewData.gameTitle}
                  onChange={(e) => setPreviewData({ ...previewData, gameTitle: e.target.value })}
                  className="w-full p-2.5 rounded bg-gray-900 border border-gray-800 text-white font-semibold focus:border-cyan-500 outline-none"
                />
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Publishing Entity Name</label>
                <input
                  type="text"
                  value={previewData.companyName}
                  onChange={(e) => setPreviewData({ ...previewData, companyName: e.target.value })}
                  className="w-full p-2.5 rounded bg-gray-900 border border-gray-800 text-white focus:border-cyan-500 outline-none"
                />
              </div>
            </div>

            {/* Color Pickers */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded bg-gray-900/60 border border-gray-800">
                <label className="text-gray-400 block mb-1.5 font-mono text-[11px]">Primary Accent</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={previewData.primaryColor}
                    onChange={(e) => setPreviewData({ ...previewData, primaryColor: e.target.value })}
                    className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                  />
                  <span className="font-mono text-white text-[11px]">{previewData.primaryColor}</span>
                </div>
              </div>

              <div className="p-3 rounded bg-gray-900/60 border border-gray-800">
                <label className="text-gray-400 block mb-1.5 font-mono text-[11px]">Secondary Accent</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={previewData.secondaryColor}
                    onChange={(e) => setPreviewData({ ...previewData, secondaryColor: e.target.value })}
                    className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                  />
                  <span className="font-mono text-white text-[11px]">{previewData.secondaryColor}</span>
                </div>
              </div>

              <div className="p-3 rounded bg-gray-900/60 border border-gray-800">
                <label className="text-gray-400 block mb-1.5 font-mono text-[11px]">Highlight Accent</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={previewData.accentColor}
                    onChange={(e) => setPreviewData({ ...previewData, accentColor: e.target.value })}
                    className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                  />
                  <span className="font-mono text-white text-[11px]">{previewData.accentColor}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-gray-400 block mb-1 text-xs">Footer Copyright Text</label>
              <input
                type="text"
                value={previewData.footerText}
                onChange={(e) => setPreviewData({ ...previewData, footerText: e.target.value })}
                className="w-full p-2.5 rounded bg-gray-900 border border-gray-800 text-white text-xs focus:border-cyan-500 outline-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-gray-500">
                Dynamic CSS custom variables ready
              </span>
              <Button
                variant="cyan"
                size="sm"
                icon={Send}
                onClick={handleRequestCustomization}
                className="text-xs"
              >
                Request This Customization
              </Button>
            </div>
          </div>

          {/* Right Column: Live Mockup Viewport */}
          <div className="p-5 rounded-xl border border-gray-800 flex flex-col justify-between" style={{ backgroundColor: '#060913' }}>
            <div>
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center font-black text-xs text-black"
                    style={{ backgroundColor: previewData.primaryColor }}
                  >
                    {previewData.gameTitle.substring(0, 1)}
                  </div>
                  <strong className="text-sm font-bold tracking-wider uppercase text-white" style={{ textShadow: `0 0 10px ${previewData.primaryColor}80` }}>
                    {previewData.gameTitle}
                  </strong>
                </div>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded border text-white" style={{ borderColor: previewData.secondaryColor }}>
                  LIVE PREVIEW
                </span>
              </div>

              {/* Sample Card */}
              <div
                className="p-4 rounded-lg border mb-4"
                style={{
                  background: `linear-gradient(135deg, ${previewData.primaryColor}15, ${previewData.secondaryColor}10)`,
                  borderColor: previewData.primaryColor + '40'
                }}
              >
                <span className="text-[10px] font-mono uppercase tracking-wider block mb-1" style={{ color: previewData.accentColor }}>
                  World 1: The Lost Kingdom
                </span>
                <h5 className="font-bold text-white text-sm mb-1">
                  Ancient Temple Awakening
                </h5>
                <p className="text-gray-300 text-xs leading-relaxed">
                  Experience seamless real-time era shifting rendered dynamically under your custom color identity.
                </p>
                <div className="mt-3 flex gap-2">
                  <span
                    className="px-2.5 py-1 rounded text-xs font-bold text-black cursor-pointer"
                    style={{ backgroundColor: previewData.primaryColor }}
                  >
                    Play Campaign
                  </span>
                  <span
                    className="px-2.5 py-1 rounded text-xs font-bold border text-white cursor-pointer"
                    style={{ borderColor: previewData.secondaryColor, color: previewData.secondaryColor }}
                  >
                    Inspect Codex
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-3 text-[11px] text-gray-500 font-mono flex justify-between items-center">
              <span>{previewData.footerText}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-900 border border-gray-800 text-gray-400">
                White-Label Ready
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
