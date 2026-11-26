import React, { useState, useEffect } from 'react';
import {
  FileText,
  Save,
  RotateCcw,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Eye,
  Mail,
  Phone,
  Layers,
  Package,
  HelpCircle
} from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

/**
 * Commercial Product Marketing Content CMS Page
 * Allows administrators to customize public marketing copy, hero taglines, package descriptions,
 * and contact details without editing code.
 */
export default function AdminProductContentPage() {
  const [formData, setFormData] = useState({
    hero_title: '',
    tagline: '',
    intro_text: '',
    overview_heading: '',
    overview_text: '',
    contact_email: '',
    contact_phone: '',
    package_a_name: '',
    package_a_desc: '',
    package_b_name: '',
    package_b_desc: '',
    package_c_name: '',
    package_c_desc: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const fetchContent = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await api.get('/admin/product-content');
      if (res.data?.data) {
        setFormData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load product content:', err);
      setErrorMsg('Failed to load commercial product content.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    try {
      const res = await api.put('/admin/product-content', formData);
      if (res.data?.data) {
        setFormData(res.data.data);
      }
      showToast('Marketing copy and product content updated successfully!');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to save product content.';
      setErrorMsg(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Reset all commercial copy to standard AERVYN factory defaults?')) {
      return;
    }
    setResetting(true);
    setErrorMsg(null);
    try {
      const res = await api.post('/admin/product-content/reset');
      if (res.data?.data) {
        setFormData(res.data.data);
      }
      showToast('Product content reset to factory defaults.');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to reset product content.';
      setErrorMsg(msg);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
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
            <FileText size={24} color="var(--color-cyan)" />
            <h1 style={{ fontSize: '1.75rem', color: '#FFFFFF', margin: 0, fontWeight: 700 }}>
              Marketing Content & Commercial CMS
            </h1>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
            Manage the hero copy, tagline, package names, descriptions, and contact channels displayed on the public landing page.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Button
            variant="ghost"
            size="sm"
            icon={RotateCcw}
            onClick={handleReset}
            disabled={resetting || loading}
            style={{ border: '1px solid var(--border-subtle)' }}
          >
            {resetting ? 'Resetting...' : 'Reset to Defaults'}
          </Button>
          <Button
            variant="cyan"
            size="sm"
            icon={Save}
            onClick={handleSave}
            disabled={saving || loading}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {errorMsg && (
        <div
          style={{
            padding: '1rem',
            backgroundColor: 'rgba(255, 71, 87, 0.15)',
            border: '1px solid rgba(255, 71, 87, 0.4)',
            borderRadius: 'var(--radius-sm)',
            color: '#FF6B81',
            marginBottom: '1.5rem',
            fontSize: '0.9rem'
          }}
        >
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>
          Loading commercial content...
        </div>
      ) : (
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Section 1: Hero & Brand Messaging */}
          <Card title="Hero & Brand Messaging" accent="cyan">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.4rem' }}>
                  Hero Product Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.hero_title}
                  onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
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
                  Official Commercial Tagline
                </label>
                <input
                  type="text"
                  required
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
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
                  Hero Introduction Narrative
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.intro_text}
                  onChange={(e) => setFormData({ ...formData, intro_text: e.target.value })}
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

          {/* Section 2: Product Overview */}
          <Card title="Product Overview Section" accent="gold">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.4rem' }}>
                  Overview Section Heading
                </label>
                <input
                  type="text"
                  required
                  value={formData.overview_heading}
                  onChange={(e) => setFormData({ ...formData, overview_heading: e.target.value })}
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
                  Overview Description Body
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.overview_text}
                  onChange={(e) => setFormData({ ...formData, overview_text: e.target.value })}
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

          {/* Section 3: Commercial Package Tiers */}
          <Card title="Commercial Licensing Packages" accent="purple">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {/* Package A */}
              <div className="p-4 rounded bg-gray-900/50 border border-cyan-500/20">
                <span className="text-xs font-mono uppercase text-cyan-400 font-bold block mb-2">Package A</span>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '0.3rem' }}>
                  Package Name
                </label>
                <input
                  type="text"
                  value={formData.package_a_name}
                  onChange={(e) => setFormData({ ...formData, package_a_name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    backgroundColor: 'rgba(8, 11, 24, 0.8)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#FFFFFF',
                    fontSize: '0.88rem',
                    marginBottom: '0.8rem'
                  }}
                />
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '0.3rem' }}>
                  Package Description
                </label>
                <textarea
                  rows={3}
                  value={formData.package_a_desc}
                  onChange={(e) => setFormData({ ...formData, package_a_desc: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    backgroundColor: 'rgba(8, 11, 24, 0.8)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#FFFFFF',
                    fontSize: '0.88rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Package B */}
              <div className="p-4 rounded bg-gray-900/50 border border-purple-500/20">
                <span className="text-xs font-mono uppercase text-purple-400 font-bold block mb-2">Package B</span>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '0.3rem' }}>
                  Package Name
                </label>
                <input
                  type="text"
                  value={formData.package_b_name}
                  onChange={(e) => setFormData({ ...formData, package_b_name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    backgroundColor: 'rgba(8, 11, 24, 0.8)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#FFFFFF',
                    fontSize: '0.88rem',
                    marginBottom: '0.8rem'
                  }}
                />
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '0.3rem' }}>
                  Package Description
                </label>
                <textarea
                  rows={3}
                  value={formData.package_b_desc}
                  onChange={(e) => setFormData({ ...formData, package_b_desc: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    backgroundColor: 'rgba(8, 11, 24, 0.8)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#FFFFFF',
                    fontSize: '0.88rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Package C */}
              <div className="p-4 rounded bg-gray-900/50 border border-amber-500/20">
                <span className="text-xs font-mono uppercase text-amber-400 font-bold block mb-2">Package C</span>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '0.3rem' }}>
                  Package Name
                </label>
                <input
                  type="text"
                  value={formData.package_c_name}
                  onChange={(e) => setFormData({ ...formData, package_c_name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    backgroundColor: 'rgba(8, 11, 24, 0.8)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#FFFFFF',
                    fontSize: '0.88rem',
                    marginBottom: '0.8rem'
                  }}
                />
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '0.3rem' }}>
                  Package Description
                </label>
                <textarea
                  rows={3}
                  value={formData.package_c_desc}
                  onChange={(e) => setFormData({ ...formData, package_c_desc: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    backgroundColor: 'rgba(8, 11, 24, 0.8)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#FFFFFF',
                    fontSize: '0.88rem',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>
          </Card>

          {/* Section 4: Commercial Contact Details */}
          <Card title="Commercial Inquiries Contact Channels">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.4rem' }}>
                  Inquiries Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.contact_email}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
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
                  Inquiries Phone / Mobile
                </label>
                <input
                  type="text"
                  value={formData.contact_phone}
                  onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
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
          </Card>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <Button
              type="submit"
              variant="cyan"
              size="lg"
              icon={Save}
              disabled={saving}
            >
              {saving ? 'Saving Changes...' : 'Save Product Marketing Content'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
