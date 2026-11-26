import { useState, useEffect } from 'react';
import GameState from './GameState';

/**
 * Reactive Hook for 3D Engine Graphics Quality Options
 * Supports 'low', 'medium', 'high' presets with dynamic resolution scaling,
 * shadow map resolution, antialiasing, star count, and device pixel ratio.
 */
export default function useGraphicsSettings() {
  const [quality, setQuality] = useState(() => {
    try {
      return localStorage.getItem('aervyn_graphics_quality') || GameState.getState().settings?.graphicsQuality || 'high';
    } catch {
      return 'high';
    }
  });

  useEffect(() => {
    const unsub = GameState.subscribe((state) => {
      const q = state.settings?.graphicsQuality || 'high';
      setQuality(q);
      try {
        localStorage.setItem('aervyn_graphics_quality', q);
      } catch {}
    });

    return () => unsub();
  }, []);

  const isLow = quality === 'low';
  const isMed = quality === 'medium';

  return {
    quality,
    shadows: !isLow,
    shadowMapSize: isLow ? 512 : (isMed ? 1024 : 2048),
    starCount: isLow ? 1000 : (isMed ? 2200 : 3500),
    antialias: !isLow,
    dpr: isLow ? 0.8 : (isMed ? 1.0 : [1, 2]),
    powerPreference: isLow ? 'default' : 'high-performance',
    toneMappingExposure: isLow ? 1.0 : 1.15
  };
}
