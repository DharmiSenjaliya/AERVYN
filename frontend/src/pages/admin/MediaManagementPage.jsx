import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  FolderOpen,
  Upload,
  Image as ImageIcon,
  Trash2,
  Eye,
  Copy,
  Check,
  AlertTriangle,
  RefreshCw,
  Search,
  Filter,
  ShieldAlert,
  FileCheck,
  X
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export default function MediaManagementPage() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Upload state
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadCategory, setUploadCategory] = useState('thumbnail');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  // Modals
  const [previewItem, setPreviewItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const fetchMedia = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/media', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (response.data?.status === 'success') {
        setMedia(response.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load media assets:', err);
      setError('Unable to load media catalog from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileSelect = (e) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate MIME type
    const validMimes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validMimes.includes(file.type)) {
      setUploadError('Invalid format. Only PNG, JPEG, and WebP images are allowed.');
      setUploadFile(null);
      return;
    }

    // Validate size (2MB max = 2 * 1024 * 1024)
    if (file.size > 2 * 1024 * 1024) {
      setUploadError(`File size ${(file.size / (1024 * 1024)).toFixed(2)} MB exceeds maximum allowed limit (2.00 MB).`);
      setUploadFile(null);
      return;
    }

    setUploadFile(file);
    if (!uploadTitle) {
      setUploadTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      setUploadError('Please choose an image file to upload.');
      return;
    }

    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('category', uploadCategory);
    formData.append('title', uploadTitle);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/admin/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });

      if (res.data?.status === 'success') {
        setSuccessMsg(`Asset "${uploadTitle || uploadFile.name}" successfully added to media library.`);
        setUploadFile(null);
        setUploadTitle('');
        if (fileInputRef.current) fileInputRef.current.value = '';
        await fetchMedia();
        setTimeout(() => setSuccessMsg(null), 5000);
      }
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadError(err.response?.data?.message || 'Failed to upload asset.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.delete(`/api/admin/media/${encodeURIComponent(deleteItem.filename)}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (res.data?.status === 'success') {
        setSuccessMsg(`Asset "${deleteItem.filename}" was permanently deleted.`);
        setDeleteItem(null);
        await fetchMedia();
        setTimeout(() => setSuccessMsg(null), 4000);
      }
    } catch (err) {
      console.error('Delete failed:', err);
      alert(err.response?.data?.message || 'Failed to delete asset.');
    } finally {
      setDeleting(false);
    }
  };

  const copyUrl = (item) => {
    navigator.clipboard.writeText(window.location.origin + item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredMedia = media.filter((item) => {
    const matchesTab = activeTab === 'all' || item.category === activeTab;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.filename.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <FolderOpen size={28} color="var(--color-primary-cyan)" />
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text)' }}>
              Game Assets & Media Management
            </h1>
          </div>
          <p style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem' }}>
            Manage world thumbnails, promotional key art, UI icons, and official brand assets.
          </p>
        </div>

        <Button variant="secondary" onClick={fetchMedia} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh Library
        </Button>
      </div>

      {successMsg && (
        <div
          style={{
            backgroundColor: 'rgba(57, 255, 20, 0.1)',
            border: '1px solid rgba(57, 255, 20, 0.3)',
            borderRadius: '8px',
            padding: '1rem',
            color: '#39ff14',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}
        >
          <FileCheck size={20} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Upload Dropzone Section */}
      <Card
        title="Upload New Media Asset"
        style={{
          border: '1px solid rgba(0, 240, 255, 0.25)',
          background: 'linear-gradient(180deg, rgba(0, 240, 255, 0.03) 0%, rgba(10, 15, 29, 0.9) 100%)'
        }}
      >
        <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.25rem'
            }}
          >
            {/* File Input with Drag / Browse Box */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-dim)', marginBottom: '0.5rem' }}>
                Select Image File (PNG, JPEG, WebP | Max 2MB)
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: uploadFile ? '2px dashed #00f0ff' : '2px dashed rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: uploadFile ? 'rgba(0, 240, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                  transition: 'all 0.2s ease'
                }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/png,image/jpeg,image/webp"
                  style={{ display: 'none' }}
                />
                <Upload size={32} color={uploadFile ? '#00f0ff' : '#a0aec0'} style={{ margin: '0 auto 0.5rem' }} />
                <div style={{ fontWeight: 600, color: uploadFile ? '#00f0ff' : 'var(--color-text)' }}>
                  {uploadFile ? uploadFile.name : 'Click to Browse or Drag File Here'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginTop: '0.25rem' }}>
                  {uploadFile ? `${(uploadFile.size / 1024).toFixed(1)} KB selected` : 'PNG, JPG, WebP up to 2MB'}
                </div>
              </div>
            </div>

            {/* Metadata Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-dim)', marginBottom: '0.35rem' }}>
                  Asset Title / Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. World 2 Cyberpunk Ruins Cover"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.9rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '6px',
                    color: 'white'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-dim)', marginBottom: '0.35rem' }}>
                  Category
                </label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.9rem',
                    backgroundColor: '#0c1122',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '6px',
                    color: 'white'
                  }}
                >
                  <option value="thumbnail">World Thumbnail</option>
                  <option value="banner">Promotional Banner</option>
                  <option value="character">Character / Concept Art</option>
                  <option value="general">General Asset</option>
                </select>
              </div>

              <div style={{ marginTop: 'auto' }}>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={!uploadFile || uploading}
                  style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Upload size={18} />
                  {uploading ? 'Uploading to Server...' : 'Upload Asset to Library'}
                </Button>
              </div>
            </div>
          </div>

          {uploadError && (
            <div
              style={{
                backgroundColor: 'rgba(255, 68, 68, 0.1)',
                border: '1px solid rgba(255, 68, 68, 0.3)',
                borderRadius: '6px',
                padding: '0.75rem',
                color: '#ff4444',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <AlertTriangle size={16} />
              <span>{uploadError}</span>
            </div>
          )}
        </form>
      </Card>

      {/* Catalog Filters & Search */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Media' },
            { id: 'thumbnail', label: 'World Covers' },
            { id: 'banner', label: 'Banners' },
            { id: 'character', label: 'Character Art' },
            { id: 'general', label: 'Branding & UI' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: '1px solid',
                borderColor: activeTab === tab.id ? '#00f0ff' : 'rgba(255, 255, 255, 0.1)',
                backgroundColor: activeTab === tab.id ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                color: activeTab === tab.id ? '#00f0ff' : 'var(--color-text-dim)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} color="var(--color-text-dim)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem 0.5rem 2.25rem',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '6px',
              color: 'white',
              fontSize: '0.85rem'
            }}
          />
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-dim)' }}>
          <RefreshCw size={36} className="animate-spin" style={{ margin: '0 auto 1rem', color: '#00f0ff' }} />
          <div>Loading AERVYN media assets...</div>
        </div>
      ) : filteredMedia.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '3rem' }}>
          <ImageIcon size={48} color="rgba(255, 255, 255, 0.2)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ color: 'var(--color-text)', marginBottom: '0.5rem' }}>No Media Assets Found</h3>
          <p style={{ color: 'var(--color-text-dim)', fontSize: '0.85rem' }}>
            No assets match your search criteria. Upload images using the form above.
          </p>
        </Card>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.25rem'
          }}
        >
          {filteredMedia.map((item) => (
            <Card
              key={item.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                border: item.is_system ? '1px solid rgba(255, 215, 0, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
                position: 'relative'
              }}
            >
              {/* Image Preview Box */}
              <div
                style={{
                  height: '160px',
                  backgroundColor: '#030509',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <img
                  src={item.url}
                  alt={item.title}
                  style={{
                    maxHeight: '100%',
                    maxWidth: '100%',
                    objectFit: 'contain',
                    transition: 'transform 0.3s ease'
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement.style.background = 'linear-gradient(135deg, #10162f 0%, #060913 100%)';
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    display: 'flex',
                    gap: '0.35rem'
                  }}
                >
                  {item.is_system && (
                    <Badge variant="warning" style={{ fontSize: '0.7rem' }}>
                      Official Brand Asset
                    </Badge>
                  )}
                  <Badge variant="secondary" style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>
                    {item.category}
                  </Badge>
                </div>
              </div>

              {/* Asset Info */}
              <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.5rem' }}>
                <h4
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    color: 'var(--color-text)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                  title={item.title}
                >
                  {item.title}
                </h4>

                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <div><strong>File:</strong> {item.filename}</div>
                  <div><strong>Size:</strong> {item.size_formatted} ({item.mime_type})</div>
                  <div><strong>Added:</strong> {item.created_at}</div>
                </div>

                {/* Action Buttons */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: item.is_system ? '1fr 1fr' : '1fr 1fr 1fr',
                    gap: '0.5rem',
                    marginTop: 'auto',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)'
                  }}
                >
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => setPreviewItem(item)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                  >
                    <Eye size={14} /> View
                  </Button>

                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => copyUrl(item)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                  >
                    {copiedId === item.id ? <Check size={14} color="#39ff14" /> : <Copy size={14} />}
                    {copiedId === item.id ? 'Copied' : 'Link'}
                  </Button>

                  {!item.is_system && (
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => setDeleteItem(item)}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                    >
                      <Trash2 size={14} /> Delete
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Preview Fullscreen Modal */}
      {previewItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
          onClick={() => setPreviewItem(null)}
        >
          <div
            style={{
              backgroundColor: '#0c1122',
              border: '1px solid rgba(0, 240, 255, 0.3)',
              borderRadius: '12px',
              maxWidth: '800px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1rem 1.5rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)' }}>
                {previewItem.title}
              </h3>
              <button
                onClick={() => setPreviewItem(null)}
                style={{ background: 'none', border: 'none', color: '#a0aec0', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Preview Body */}
            <div style={{ padding: '1.5rem', textAlign: 'center', backgroundColor: '#05070f' }}>
              <img
                src={previewItem.url}
                alt={previewItem.title}
                style={{
                  maxHeight: '420px',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  borderRadius: '6px'
                }}
              />
            </div>

            {/* Details Footer */}
            <div
              style={{
                padding: '1rem 1.5rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '0.75rem',
                fontSize: '0.8rem',
                color: 'var(--color-text-dim)'
              }}
            >
              <div><strong>Filename:</strong> {previewItem.filename}</div>
              <div><strong>Category:</strong> {previewItem.category}</div>
              <div><strong>Format:</strong> {previewItem.mime_type}</div>
              <div><strong>Filesize:</strong> {previewItem.size_formatted}</div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(6px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
        >
          <div
            style={{
              backgroundColor: '#0d1326',
              border: '1px solid rgba(255, 68, 68, 0.4)',
              borderRadius: '12px',
              maxWidth: '480px',
              width: '100%',
              padding: '1.5rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: '#ff4444' }}>
              <ShieldAlert size={28} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Permanently Delete Asset?</h3>
            </div>

            <p style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              Are you sure you want to delete <strong style={{ color: 'white' }}>{deleteItem.filename}</strong>?
              This action will purge the file from server storage and record this deletion in the Admin Activity Audit Trail.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <Button variant="secondary" onClick={() => setDeleteItem(null)} disabled={deleting}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting...' : 'Confirm Deletion'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
