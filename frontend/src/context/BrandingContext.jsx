import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

/**
 * Official AERVYN Brand Identity Constants (Default Fallback)
 */
export const OFFICIAL_AERVYN_BRANDING = {
  white_label_enabled: false,
  product_name: 'AERVYN: ECHOES OF TIME',
  tagline: 'CHANGE THE PAST. SURVIVE THE PRESENT. DISCOVER THE FUTURE.',
  logo_url: '/assets/aervyn-logo.png',
  favicon_url: '/assets/aervyn-logo.png',
  company_name: 'AERVYN Game Studios',
  company_logo_url: '',
  support_email: 'support@aervyn.com',
  website_url: 'https://aervyn.game',
  company_description: 'An original, story-driven 3D adventure through fractured timelines.',
  footer_text: '© 2026 AERVYN: Echoes of Time. All rights reserved.',
  primary_color: '#00D9FF',
  secondary_color: '#7047FF',
  accent_color: '#F5B942',
  landing_title: 'AERVYN: ECHOES OF TIME — Commercial 3D Adventure Game',
  landing_description: 'Change the Past. Survive the Present. Discover the Future. A commercial 3D adventure game engineered with Three.js, React 19, and Laravel 12.',
};

export const DEFAULT_FEATURES = {
  demo_mode: true,
  social: true,
  leaderboard: true,
  friends: true,
  challenges: true,
  achievements: true,
  buyer_inquiry: true,
  product_showcase: true,
  white_label: true,
  analytics: true,
  landing_page: true,
};

const BrandingContext = createContext({
  branding: OFFICIAL_AERVYN_BRANDING,
  features: DEFAULT_FEATURES,
  loading: true,
  reloadBranding: () => {},
});

export function BrandingProvider({ children }) {
  const [branding, setBranding] = useState(OFFICIAL_AERVYN_BRANDING);
  const [features, setFeatures] = useState(DEFAULT_FEATURES);
  const [loading, setLoading] = useState(true);

  const fetchConfiguration = async () => {
    try {
      // 1. Fetch Branding
      const brandingRes = await api.get('/config/branding');
      if (brandingRes.data?.success && brandingRes.data?.branding) {
        const b = brandingRes.data.branding;
        setBranding(b);

        // Apply white-label colors to CSS variables if active
        if (b.white_label_enabled) {
          if (b.primary_color) document.documentElement.style.setProperty('--color-cyan', b.primary_color);
          if (b.secondary_color) document.documentElement.style.setProperty('--color-purple', b.secondary_color);
          if (b.accent_color) document.documentElement.style.setProperty('--color-gold', b.accent_color);
          if (b.landing_title) document.title = b.landing_title;

          // Update Favicon if custom provided
          if (b.favicon_url && b.favicon_url !== '/assets/aervyn-logo.png') {
            let favicon = document.querySelector("link[rel*='icon']");
            if (favicon) {
              favicon.href = b.favicon_url;
            }
          }
        } else {
          // Restore Official Theme Colors
          document.documentElement.style.setProperty('--color-cyan', '#00D9FF');
          document.documentElement.style.setProperty('--color-purple', '#7047FF');
          document.documentElement.style.setProperty('--color-gold', '#F5B942');
          document.title = OFFICIAL_AERVYN_BRANDING.landing_title;

          let favicon = document.querySelector("link[rel*='icon']");
          if (favicon) {
            favicon.href = OFFICIAL_AERVYN_BRANDING.favicon_url;
          }
        }
      }

      // 2. Fetch Feature Flags
      const featuresRes = await api.get('/config/features');
      if (featuresRes.data?.success && featuresRes.data?.features) {
        setFeatures(featuresRes.data.features);
      }
    } catch (err) {
      console.warn('Branding API unavailable. Using official AERVYN defaults.', err);
      setBranding(OFFICIAL_AERVYN_BRANDING);
      setFeatures(DEFAULT_FEATURES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfiguration();
  }, []);

  return (
    <BrandingContext.Provider
      value={{
        branding,
        features,
        loading,
        reloadBranding: fetchConfiguration,
      }}
    >
      {children}
    </BrandingContext.Provider>
  );
}

export function useBranding() {
  return useContext(BrandingContext);
}
