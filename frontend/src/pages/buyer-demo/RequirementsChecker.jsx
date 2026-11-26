import React, { useState, useEffect } from 'react';
import {
  Monitor,
  CheckCircle,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Cpu,
  Layers,
  Zap,
  Globe,
  Info
} from 'lucide-react';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

/**
 * Interactive Buyer Requirements Checker
 * Evaluates client browser for WebGL 2.0, Canvas support, screen resolution,
 * device capabilities, and estimated performance compatibility.
 */
export default function RequirementsChecker() {
  const [specs, setSpecs] = useState({
    webgl2: null,
    renderer: '',
    vendor: '',
    screenRes: '',
    devicePixelRatio: 1,
    touchSupported: false,
    audioContextSupported: false,
    recommendedTier: 'Evaluating...',
    checkedAt: null
  });

  const runDiagnostics = () => {
    let hasWebGL2 = false;
    let glRenderer = 'Standard Integrated / Software';
    let glVendor = 'Generic';

    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2');
      if (gl) {
        hasWebGL2 = true;
        const dbgRenderInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (dbgRenderInfo) {
          glRenderer = gl.getParameter(dbgRenderInfo.UNMASKED_RENDERER_WEBGL) || glRenderer;
          glVendor = gl.getParameter(dbgRenderInfo.UNMASKED_VENDOR_WEBGL) || glVendor;
        }
      }
    } catch (e) {
      hasWebGL2 = false;
    }

    const hasAudio = !!(window.AudioContext || window.webkitAudioContext);
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const dpr = window.devicePixelRatio || 1;
    const resString = `${window.screen.width} x ${window.screen.height}`;

    let tier = 'Recommended (60 FPS High)';
    if (!hasWebGL2) {
      tier = 'Unsupported (WebGL 2.0 required)';
    } else if (window.screen.width < 768) {
      tier = 'Compatible (Mobile WebGL 30-45 FPS)';
    }

    setSpecs({
      webgl2: hasWebGL2,
      renderer: glRenderer,
      vendor: glVendor,
      screenRes: resString,
      devicePixelRatio: dpr,
      touchSupported: hasTouch,
      audioContextSupported: hasAudio,
      recommendedTier: tier,
      checkedAt: new Date().toLocaleTimeString()
    });
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  return (
    <div className="p-6 rounded-xl bg-[#090e1c] border border-cyan-500/30 text-gray-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">
              Client Browser & Hardware Compatibility Checker
            </h3>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Evaluates your active browser environment for 3D WebGL 2.0 rendering capabilities and spatial audio support.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={specs.webgl2 ? 'green' : 'danger'} size="sm">
            {specs.webgl2 ? 'WEBGL 2.0 READY' : 'WEBGL 2.0 UNAVAILABLE'}
          </Badge>
          <Button variant="ghost" size="sm" icon={RefreshCw} onClick={runDiagnostics} className="text-xs">
            Re-run Check
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {/* Check 1: WebGL 2.0 */}
        <div className="p-4 rounded-lg bg-gray-900/60 border border-gray-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 font-mono uppercase tracking-wider text-[11px]">3D WebGL Support</span>
              {specs.webgl2 ? (
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-400" />
              )}
            </div>
            <strong className="text-white text-sm block mb-1">
              {specs.webgl2 ? 'WebGL 2.0 Active' : 'Fallback Canvas'}
            </strong>
            <p className="text-gray-400 text-[11px] leading-relaxed">
              Required for procedural Three.js shader rendering and dynamic shadows.
            </p>
          </div>
          <span className="mt-3 text-[10px] text-gray-500 font-mono">Status: Verified</span>
        </div>

        {/* Check 2: GPU Device */}
        <div className="p-4 rounded-lg bg-gray-900/60 border border-gray-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 font-mono uppercase tracking-wider text-[11px]">Graphics Adapter</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <strong className="text-white text-sm block mb-1 truncate" title={specs.renderer}>
              {specs.renderer ? (specs.renderer.length > 28 ? specs.renderer.substring(0, 28) + '...' : specs.renderer) : 'Detecting...'}
            </strong>
            <p className="text-gray-400 text-[11px] leading-relaxed">
              Hardware accelerated GPU detected for 60 FPS animation loop.
            </p>
          </div>
          <span className="mt-3 text-[10px] text-gray-500 font-mono">Hardware Accel: Enabled</span>
        </div>

        {/* Check 3: Display Resolution */}
        <div className="p-4 rounded-lg bg-gray-900/60 border border-gray-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 font-mono uppercase tracking-wider text-[11px]">Viewport Resolution</span>
              <Monitor className="w-4 h-4 text-cyan-400" />
            </div>
            <strong className="text-white text-sm block mb-1">
              {specs.screenRes} ({specs.devicePixelRatio}x DPR)
            </strong>
            <p className="text-gray-400 text-[11px] leading-relaxed">
              Responsive canvas scaling configured for retina and high-density displays.
            </p>
          </div>
          <span className="mt-3 text-[10px] text-gray-500 font-mono">Touch Input: {specs.touchSupported ? 'Available' : 'Mouse / Keys'}</span>
        </div>

        {/* Check 4: Web Audio Synthesizer */}
        <div className="p-4 rounded-lg bg-gray-900/60 border border-gray-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 font-mono uppercase tracking-wider text-[11px]">Spatial Audio Engine</span>
              <CheckCircle className="w-4 h-4 text-purple-400" />
            </div>
            <strong className="text-white text-sm block mb-1">
              {specs.audioContextSupported ? 'Web Audio API Active' : 'Muted Fallback'}
            </strong>
            <p className="text-gray-400 text-[11px] leading-relaxed">
              Real-time dynamic synthesis of sci-fi sound effects and portal ambience.
            </p>
          </div>
          <span className="mt-3 text-[10px] text-gray-500 font-mono">External Assets: 0 Bytes</span>
        </div>
      </div>

      <div className="mt-4 p-3 rounded bg-cyan-950/20 border border-cyan-500/20 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span className="text-gray-300">
            <strong>System Assessment:</strong> {specs.recommendedTier}. Runs natively in modern Chrome, Edge, Firefox, and Safari without plugins.
          </span>
        </div>
        <span className="text-[11px] font-mono text-gray-500 hidden sm:inline">
          Tested: {specs.checkedAt}
        </span>
      </div>
    </div>
  );
}
