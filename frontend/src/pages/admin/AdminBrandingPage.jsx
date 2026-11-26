import React, { useState, useEffect } from 'react';
import {
  Palette,
  Sparkles,
  RotateCcw,
  Save,
  Eye,
  Upload,
  Globe,
  Sliders,
  CheckCircle,
  AlertTriangle,
  Layers,
  FileText,
  Lock,
  Compass,
  Monitor,
  Gamepad2,
  Info
} from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { useBranding } from '../../context/BrandingContext';

/**
 * Professional White-Label & Product Branding Management
 * Allows studio administrators and enterprise buyers to configure
 * product branding, logos, color themes, feature flags, and view real-time previews.
 */
export default function AdminBrandingPage() {
  const { reloadBranding } = useBranding();

  // Active form state
  const [whiteLabelEnabled, setWhiteLabelEnabled] = useState(false);
  const [brandingForm, setBrandingForm] = useState({
    product_name: '',
    tagline: '',
    company_name: '',
    company_description: '',
    support_email: '',
    website_url: '',
    footer_text: '',
    primary_color: '#00D9FF',
    secondary_color: '#7047FF',
    accent_color: '#F5B942',
    landing_title: '',
    landing_description: '',
    logo_url: '',
    favicon_url: ''
  });

  const [featuresForm, setFeaturesForm] = useState({
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
    landing_page: true
  });

  const [defaults, setDefaults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  // Upload state
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  // Reset Modal state
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetting, setResetting] = useState(false);

  // Live preview tab state
  const [previewTab, setPreviewTab] = useState('header'); // header | login | dashboard | loading | menu | footer

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const fetchBrandingData = async () => {
    setLoading(true);
    try {
      const [brandingRes, featuresRes] = await Promise.all([
        api.get('/admin/branding'),
        api.get('/admin/features')
      ]);

      if (brandingRes.data?.success) {
        setWhiteLabelEnabled(brandingRes.data.white_label_enabled);
        setBrandingForm(brandingRes.data.branding);
        setDefaults(brandingRes.data.defaults);
      }

      if (featuresRes.data?.success && featuresRes.data?.features) {
        setFeaturesForm(featuresRes.data.features);
      }
    } catch (err) {
      console.error('Failed to load branding settings:', err);
      showToast('Error loading branding configuration.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrandingData();
  }, []);

  const handleSaveConfiguration = async () => {
    setSaving(true);
    try {
      // 1. Save branding
      await api.put('/admin/branding', {
        white_label_enabled: whiteLabelEnabled,
        ...brandingForm
      });

      // 2. Save features
      await api.put('/admin/features', {
        features: featuresForm
      });

      showToast('Product settings & branding saved successfully.');
      reloadBranding();
      fetchBrandingData();
    } catch (err) {
      console.error('Failed to save settings:', err);
      const msg = err.response?.data?.message || 'Failed to save configuration.';
      showToast(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast('Logo file size must be less than 2MB.');
      return;
    }

    setUploadingLogo(true);
    const data = new FormData();
    data.append('logo', file);

    try {
      const res = await api.post('/admin/branding/logo', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data?.success && res.data?.logo_url) {
        setBrandingForm((prev) => ({ ...prev, logo_url: res.data.logo_url }));
        showToast('Custom logo uploaded successfully.');
        reloadBranding();
      }
    } catch (err) {
      console.error('Logo upload error:', err);
      showToast('Failed to upload custom logo.');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleFaviconUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      showToast('Favicon file size must be less than 1MB.');
      return;
    }

    setUploadingFavicon(true);
    const data = new FormData();
    data.append('favicon', file);

    try {
      const res = await api.post('/admin/branding/favicon', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data?.success && res.data?.favicon_url) {
        setBrandingForm((prev) => ({ ...prev, favicon_url: res.data.favicon_url }));
        showToast('Custom favicon uploaded successfully.');
        reloadBranding();
      }
    } catch (err) {
      console.error('Favicon upload error:', err);
      showToast('Failed to upload custom favicon.');
    } finally {
      setUploadingFavicon(false);
    }
  };

  const handleResetToDefault = async () => {
    setResetting(true);
    try {
      const res = await api.post('/admin/branding/reset');
      if (res.data?.success) {
        setWhiteLabelEnabled(false);
        setBrandingForm({
          product_name: '',
          tagline: '',
          company_name: '',
          company_description: '',
          support_email: '',
          website_url: '',
          footer_text: '',
          primary_color: '#00D9FF',
          secondary_color: '#7047FF',
          accent_color: '#F5B942',
          landing_title: '',
          landing_description: '',
          logo_url: '',
          favicon_url: ''
        });
        showToast('Official AERVYN: Echoes of Time identity restored.');
        setShowResetModal(false);
        reloadBranding();
        fetchBrandingData();
      }
    } catch (err) {
      console.error('Failed to reset branding:', err);
      showToast('Failed to reset branding.');
    } finally {
      setResetting(false);
    }
  };

  // Preview computed values
  const activeProduct = whiteLabelEnabled && brandingForm.product_name ? brandingForm.product_name : 'AERVYN: ECHOES OF TIME';
  const activeTagline = whiteLabelEnabled && brandingForm.tagline ? brandingForm.tagline : 'CHANGE THE PAST. SURVIVE THE PRESENT. DISCOVER THE FUTURE.';
  const activeCompany = whiteLabelEnabled && brandingForm.company_name ? brandingForm.company_name : 'AERVYN Game Studios';
  const activePrimary = whiteLabelEnabled && brandingForm.primary_color ? brandingForm.primary_color : '#00D9FF';
  const activeSecondary = whiteLabelEnabled && brandingForm.secondary_color ? brandingForm.secondary_color : '#7047FF';
  const activeAccent = whiteLabelEnabled && brandingForm.accent_color ? brandingForm.accent_color : '#F5B942';
  const activeLogo = whiteLabelEnabled && brandingForm.logo_url ? brandingForm.logo_url : '/assets/aervyn-logo.png';
  const activeFooter = whiteLabelEnabled && brandingForm.footer_text ? brandingForm.footer_text : '© 2026 AERVYN: Echoes of Time. All rights reserved.';

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Toast Notification */}
      {toastMsg && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            padding: '1rem 1.5rem',
            background: 'rgba(8, 11, 24, 0.95)',
            border: '1px solid var(--border-cyan)',
            borderRadius: 'var(--radius-sm)',
            boxShadow: '0 0 20px rgba(0, 217, 255, 0.3)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}
        >
          <Sparkles size={18} color="var(--color-cyan)" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Palette size={26} color="var(--color-cyan)" />
            <h1 style={{ fontSize: '1.75rem', color: '#FFFFFF', margin: 0, fontWeight: 700 }}>
              Product Branding & White-Label Architecture
            </h1>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
            Configure commercial branding, custom client logos, theme color accents, and feature flags.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button
            variant="outline"
            size="sm"
            icon={RotateCcw}
            onClick={() => setShowResetModal(true)}
          >
            Reset to AERVYN Default
          </Button>

          <Button
            variant="cyan"
            size="sm"
            icon={Save}
            disabled={saving}
            onClick={handleSaveConfiguration}
          >
            {saving ? 'Saving Changes...' : 'Save Configuration'}
          </Button>
        </div>
      </div>

      {/* White-Label Master Toggle Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '1.5rem 2rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          borderColor: whiteLabelEnabled ? 'var(--color-gold)' : 'var(--border-cyan)',
          background: whiteLabelEnabled
            ? 'linear-gradient(135deg, rgba(245, 185, 66, 0.1) 0%, rgba(8, 11, 24, 0.9) 100%)'
            : 'linear-gradient(135deg, rgba(22, 140, 255, 0.1) 0%, rgba(8, 11, 24, 0.9) 100%)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: whiteLabelEnabled ? 'rgba(245, 185, 66, 0.2)' : 'rgba(0, 217, 255, 0.2)',
              border: `2px solid ${whiteLabelEnabled ? '#F5B942' : '#00D9FF'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: whiteLabelEnabled ? '#F5B942' : '#00D9FF'
            }}
          >
            {whiteLabelEnabled ? <Sliders size={24} /> : <Sparkles size={24} />}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h3 style={{ margin: 0, color: '#FFFFFF', fontSize: '1.2rem' }}>
                White-Label Branding Mode
              </h3>
              {whiteLabelEnabled ? (
                <Badge variant="gold" size="sm">CUSTOM BUYER BRANDING ACTIVE</Badge>
              ) : (
                <Badge variant="cyan" size="sm">OFFICIAL AERVYN BRANDING ACTIVE</Badge>
              )}
            </div>
            <p style={{ margin: '0.25rem 0 0 0', color: 'var(--color-text-secondary)', fontSize: '0.88rem' }}>
              {whiteLabelEnabled
                ? 'Controlled white-label mode is active. Public interface displays buyer customized identity.'
                : 'Default configuration active. System displays the official AERVYN: Echoes of Time branding and logo.'}
            </p>
          </div>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', userSelect: 'none' }}>
          <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#FFFFFF' }}>
            {whiteLabelEnabled ? 'ENABLED' : 'DISABLED'}
          </span>
          <input
            type="checkbox"
            checked={whiteLabelEnabled}
            onChange={(e) => setWhiteLabelEnabled(e.target.checked)}
            style={{ width: '22px', height: '22px', accentColor: 'var(--color-cyan)', cursor: 'pointer' }}
          />
        </label>
      </div>

      {/* Main Grid: Form Left, Preview Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '2rem' }}>
        {/* Left Column: Configuration Forms */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Section 1: Product & Narrative Identity */}
          <Card title="Product & Narrative Identity" subtitle="Configure game title and marketing taglines">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.4rem' }}>
                  Product Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. AERVYN: ECHOES OF TIME"
                  value={brandingForm.product_name}
                  onChange={(e) => setBrandingForm({ ...brandingForm, product_name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'rgba(8, 11, 24, 0.8)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#FFFFFF',
                    fontSize: '0.92rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.4rem' }}>
                  Master Tagline / Subtitle
                </label>
                <input
                  type="text"
                  placeholder="e.g. CHANGE THE PAST. SURVIVE THE PRESENT. DISCOVER THE FUTURE."
                  value={brandingForm.tagline}
                  onChange={(e) => setBrandingForm({ ...brandingForm, tagline: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'rgba(8, 11, 24, 0.8)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#FFFFFF',
                    fontSize: '0.92rem'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.4rem' }}>
                    Browser Page Title Tag
                  </label>
                  <input
                    type="text"
                    placeholder="HTML <title> tag"
                    value={brandingForm.landing_title}
                    onChange={(e) => setBrandingForm({ ...brandingForm, landing_title: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: 'rgba(8, 11, 24, 0.8)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      color: '#FFFFFF',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.4rem' }}>
                    Landing Meta Description
                  </label>
                  <input
                    type="text"
                    placeholder="SEO meta description"
                    value={brandingForm.landing_description}
                    onChange={(e) => setBrandingForm({ ...brandingForm, landing_description: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: 'rgba(8, 11, 24, 0.8)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      color: '#FFFFFF',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Section 2: Publisher & Company Information */}
          <Card title="Company & Legal Attribution" subtitle="Configure publisher details and copyright">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.4rem' }}>
                    Company / Publisher Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Acme Interactive"
                    value={brandingForm.company_name}
                    onChange={(e) => setBrandingForm({ ...brandingForm, company_name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: 'rgba(8, 11, 24, 0.8)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      color: '#FFFFFF',
                      fontSize: '0.92rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.4rem' }}>
                    Support Email
                  </label>
                  <input
                    type="email"
                    placeholder="support@company.com"
                    value={brandingForm.support_email}
                    onChange={(e) => setBrandingForm({ ...brandingForm, support_email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: 'rgba(8, 11, 24, 0.8)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      color: '#FFFFFF',
                      fontSize: '0.92rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.4rem' }}>
                    Website URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://company.com"
                    value={brandingForm.website_url}
                    onChange={(e) => setBrandingForm({ ...brandingForm, website_url: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: 'rgba(8, 11, 24, 0.8)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      color: '#FFFFFF',
                      fontSize: '0.92rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.4rem' }}>
                    Footer Copyright Notice
                  </label>
                  <input
                    type="text"
                    placeholder="© 2026 Company. All rights reserved."
                    value={brandingForm.footer_text}
                    onChange={(e) => setBrandingForm({ ...brandingForm, footer_text: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: 'rgba(8, 11, 24, 0.8)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      color: '#FFFFFF',
                      fontSize: '0.92rem'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.4rem' }}>
                  Company Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Short publisher or studio bio..."
                  value={brandingForm.company_description}
                  onChange={(e) => setBrandingForm({ ...brandingForm, company_description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'rgba(8, 11, 24, 0.8)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#FFFFFF',
                    fontSize: '0.92rem',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>
          </Card>

          {/* Section 3: Visual Theme & Color Palette */}
          <Card title="Color Palette & Visual Accents" subtitle="Hex color customization applied to CSS variables">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '0.35rem' }}>
                  Primary (Cyan/Theme)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="color"
                    value={brandingForm.primary_color || '#00D9FF'}
                    onChange={(e) => setBrandingForm({ ...brandingForm, primary_color: e.target.value })}
                    style={{ width: '38px', height: '38px', padding: 0, border: 'none', borderRadius: '4px', cursor: 'pointer', background: 'transparent' }}
                  />
                  <input
                    type="text"
                    value={brandingForm.primary_color}
                    onChange={(e) => setBrandingForm({ ...brandingForm, primary_color: e.target.value })}
                    style={{ width: '85px', padding: '0.4rem 0.5rem', backgroundColor: 'rgba(8, 11, 24, 0.8)', border: '1px solid var(--border-subtle)', color: '#FFFFFF', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '0.35rem' }}>
                  Secondary (Purple)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="color"
                    value={brandingForm.secondary_color || '#7047FF'}
                    onChange={(e) => setBrandingForm({ ...brandingForm, secondary_color: e.target.value })}
                    style={{ width: '38px', height: '38px', padding: 0, border: 'none', borderRadius: '4px', cursor: 'pointer', background: 'transparent' }}
                  />
                  <input
                    type="text"
                    value={brandingForm.secondary_color}
                    onChange={(e) => setBrandingForm({ ...brandingForm, secondary_color: e.target.value })}
                    style={{ width: '85px', padding: '0.4rem 0.5rem', backgroundColor: 'rgba(8, 11, 24, 0.8)', border: '1px solid var(--border-subtle)', color: '#FFFFFF', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '0.35rem' }}>
                  Accent (Gold/Amber)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="color"
                    value={brandingForm.accent_color || '#F5B942'}
                    onChange={(e) => setBrandingForm({ ...brandingForm, accent_color: e.target.value })}
                    style={{ width: '38px', height: '38px', padding: 0, border: 'none', borderRadius: '4px', cursor: 'pointer', background: 'transparent' }}
                  />
                  <input
                    type="text"
                    value={brandingForm.accent_color}
                    onChange={(e) => setBrandingForm({ ...brandingForm, accent_color: e.target.value })}
                    style={{ width: '85px', padding: '0.4rem 0.5rem', backgroundColor: 'rgba(8, 11, 24, 0.8)', border: '1px solid var(--border-subtle)', color: '#FFFFFF', fontSize: '0.85rem' }}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Section 4: Media Asset Uploads */}
          <Card title="Custom Brand Media Assets" subtitle="Upload buyer logo and browser favicon">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
                  Custom Brand Logo (PNG, JPG, SVG, WebP • Max 2MB)
                </span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={handleLogoUpload}
                  disabled={uploadingLogo}
                  style={{ display: 'block', width: '100%', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}
                />
                {uploadingLogo && <span style={{ fontSize: '0.8rem', color: 'var(--color-cyan)', marginTop: '0.35rem', display: 'block' }}>Uploading logo...</span>}
                {brandingForm.logo_url && (
                  <div style={{ marginTop: '0.75rem', padding: '0.5rem', background: 'rgba(0,0,0,0.4)', borderRadius: '4px', textAlign: 'center' }}>
                    <img src={brandingForm.logo_url} alt="Custom Logo" style={{ maxHeight: '48px', maxWidth: '100%', objectFit: 'contain' }} />
                  </div>
                )}
              </div>

              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
                  Custom Favicon (PNG, ICO, SVG • Max 1MB)
                </span>
                <input
                  type="file"
                  accept="image/png,image/x-icon,image/svg+xml"
                  onChange={handleFaviconUpload}
                  disabled={uploadingFavicon}
                  style={{ display: 'block', width: '100%', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}
                />
                {uploadingFavicon && <span style={{ fontSize: '0.8rem', color: 'var(--color-cyan)', marginTop: '0.35rem', display: 'block' }}>Uploading favicon...</span>}
                {brandingForm.favicon_url && (
                  <div style={{ marginTop: '0.75rem', padding: '0.5rem', background: 'rgba(0,0,0,0.4)', borderRadius: '4px', textAlign: 'center' }}>
                    <img src={brandingForm.favicon_url} alt="Custom Favicon" style={{ maxHeight: '32px', maxWidth: '100%', objectFit: 'contain' }} />
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Section 5: Feature Flags Matrix */}
          <Card title="Feature Flags & Module Toggles" subtitle="Safely enable or disable sub-systems">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {Object.keys(featuresForm).map((flag) => (
                <label key={flag} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.88rem', color: '#FFFFFF' }}>
                  <input
                    type="checkbox"
                    checked={featuresForm[flag]}
                    onChange={(e) => setFeaturesForm({ ...featuresForm, [flag]: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--color-cyan)' }}
                  />
                  <span>{flag.replace('_', ' ').toUpperCase()}</span>
                </label>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Live Interactive Preview Pane */}
        <div>
          <div className="glass-panel" style={{ position: 'sticky', top: '90px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Eye size={20} color={activePrimary} />
                <h3 style={{ margin: 0, color: '#FFFFFF', fontSize: '1.15rem' }}>
                  Live Branding Preview
                </h3>
              </div>
              <Badge variant="cyan" size="sm">REAL-TIME</Badge>
            </div>

            {/* Preview Navigation Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              {[
                { id: 'header', label: 'Header' },
                { id: 'login', label: 'Login' },
                { id: 'dashboard', label: 'Dashboard' },
                { id: 'loading', label: 'Loading' },
                { id: 'menu', label: 'Main Menu' },
                { id: 'footer', label: 'Footer' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setPreviewTab(tab.id)}
                  style={{
                    padding: '0.4rem 0.8rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    border: '1px solid',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    backgroundColor: previewTab === tab.id ? 'rgba(0, 217, 255, 0.15)' : 'transparent',
                    borderColor: previewTab === tab.id ? activePrimary : 'rgba(255,255,255,0.1)',
                    color: previewTab === tab.id ? activePrimary : 'var(--color-text-secondary)'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Live Preview Display Box */}
            <div
              style={{
                background: '#040711',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                overflow: 'hidden',
                minHeight: '380px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '1.5rem',
                position: 'relative'
              }}
            >
              {/* 1. Header Preview */}
              {previewTab === 'header' && (
                <div>
                  <div style={{ padding: '0.75rem 1rem', background: 'rgba(8, 11, 24, 0.95)', borderBottom: `1px solid ${activePrimary}33`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img src={activeLogo} alt="Logo" style={{ height: '32px', objectFit: 'contain' }} />
                      <span style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.95rem' }}>{activeProduct}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                      <span>Story</span>
                      <span>Worlds</span>
                      <span style={{ color: activePrimary }}>Play</span>
                    </div>
                  </div>
                  <div style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                    Live representation of top navigation bar with current brand asset and primary accent.
                  </div>
                </div>
              )}

              {/* 2. Login Preview */}
              {previewTab === 'login' && (
                <div style={{ maxWidth: '300px', margin: '0 auto', textAlign: 'center' }}>
                  <img src={activeLogo} alt="Logo" style={{ height: '48px', margin: '0 auto 1rem auto', objectFit: 'contain' }} />
                  <h4 style={{ color: '#FFFFFF', margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>Operative Sign In</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                    <div style={{ height: '34px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }} />
                    <div style={{ height: '34px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }} />
                    <button style={{ height: '36px', background: activePrimary, color: '#000', fontWeight: 700, border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                      Enter Spacetime
                    </button>
                  </div>
                </div>
              )}

              {/* 3. Dashboard Preview */}
              {previewTab === 'dashboard' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: activePrimary, textTransform: 'uppercase' }}>Operative Portal</div>
                      <h4 style={{ margin: 0, color: '#FFFFFF' }}>{activeProduct}</h4>
                    </div>
                    <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: `${activeAccent}22`, color: activeAccent, borderRadius: '4px' }}>
                      Level 12
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', borderLeft: `3px solid ${activePrimary}` }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Missions</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF' }}>8 / 10</div>
                    </div>
                    <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', borderLeft: `3px solid ${activeSecondary}` }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Chronos</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF' }}>3,450 XP</div>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. Loading Preview */}
              {previewTab === 'loading' && (
                <div style={{ textAlign: 'center' }}>
                  <img src={activeLogo} alt="Logo" style={{ height: '60px', margin: '0 auto 1.5rem auto', objectFit: 'contain' }} />
                  <div style={{ width: '180px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', margin: '0 auto 0.75rem auto', overflow: 'hidden' }}>
                    <div style={{ width: '65%', height: '100%', background: activePrimary, borderRadius: '2px' }} />
                  </div>
                  <div style={{ fontSize: '0.8rem', color: activePrimary, letterSpacing: '0.1em' }}>
                    SYNCHRONIZING TIMELINE MESHES...
                  </div>
                </div>
              )}

              {/* 5. Main Menu Preview */}
              {previewTab === 'menu' && (
                <div style={{ textAlign: 'center' }}>
                  <img src={activeLogo} alt="Logo" style={{ height: '64px', margin: '0 auto 1rem auto', objectFit: 'contain' }} />
                  <div style={{ fontSize: '0.8rem', letterSpacing: '0.12em', color: activeAccent, marginBottom: '1.5rem', textTransform: 'uppercase' }}>
                    {activeTagline}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '180px', margin: '0 auto' }}>
                    <button style={{ padding: '0.5rem', background: activePrimary, color: '#000', fontWeight: 700, border: 'none', borderRadius: '4px' }}>
                      NEW EXPEDITION
                    </button>
                    <button style={{ padding: '0.5rem', background: 'transparent', color: '#FFF', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px' }}>
                      CONTINUE
                    </button>
                  </div>
                </div>
              )}

              {/* 6. Footer Preview */}
              {previewTab === 'footer' && (
                <div style={{ textAlign: 'center', padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <img src={activeLogo} alt="Logo" style={{ height: '36px', margin: '0 auto 0.75rem auto', objectFit: 'contain' }} />
                  <div style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginBottom: '0.4rem' }}>
                    {activeCompany}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {activeFooter}
                  </div>
                </div>
              )}
            </div>

            {/* Preview Status Pill */}
            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              <span>Primary: <code style={{ color: activePrimary }}>{activePrimary}</code></span>
              <span>Secondary: <code style={{ color: activeSecondary }}>{activeSecondary}</code></span>
              <span>Accent: <code style={{ color: activeAccent }}>{activeAccent}</code></span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Reset to AERVYN Default */}
      {showResetModal && (
        <Modal
          isOpen={true}
          title="Restore Official AERVYN Default Branding"
          onClose={() => setShowResetModal(false)}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(245, 185, 66, 0.1)', border: '1px solid rgba(245, 185, 66, 0.3)', borderRadius: '6px' }}>
              <AlertTriangle size={32} color="#F5B942" />
              <div style={{ fontSize: '0.9rem', color: '#FFFFFF', lineHeight: 1.5 }}>
                This operation will disable white-label mode and restore the official <strong>AERVYN: ECHOES OF TIME</strong> product name, brand logo, and original cyan/purple color theme.
              </div>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', margin: 0 }}>
              * Safe Operation: This reset only modifies branding display keys in <code>game_settings</code>. It will <strong>never</strong> modify player accounts, campaign progression, world missions, or database tables.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Button variant="ghost" size="sm" onClick={() => setShowResetModal(false)}>
                Cancel
              </Button>
              <Button
                variant="cyan"
                size="sm"
                icon={RotateCcw}
                disabled={resetting}
                onClick={handleResetToDefault}
              >
                {resetting ? 'Restoring...' : 'Confirm Reset to Default'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
