import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  User,
  Mail,
  Calendar,
  Award,
  Zap,
  Clock,
  Globe,
  Scroll,
  Lock,
  ShieldCheck,
  Check,
  AlertTriangle,
  RefreshCw,
  LogOut,
  Sparkles,
  Save
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';
import { useAudio } from '../../context/AudioContext';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { playClick } = useAudio();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [profileData, setProfileData] = useState(null);

  // Profile Edit State
  const [displayName, setDisplayName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('avatar_default');
  const [bio, setBio] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState(null);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/player/profile', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.data?.status === 'success') {
        const d = res.data.data;
        setProfileData(d);
        setDisplayName(d.display_name || d.username);
        setSelectedAvatar(d.avatar || 'avatar_default');
        setBio(d.bio || '');
      }
    } catch (err) {
      console.error('Failed to load player profile:', err);
      setError('Unable to fetch profile details from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileError(null);
    setSuccessMsg(null);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.put('/api/player/profile', {
        display_name: displayName,
        avatar: selectedAvatar,
        bio: bio
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (res.data?.status === 'success') {
        setSuccessMsg('Player profile updated successfully.');
        await fetchProfile();
        setTimeout(() => setSuccessMsg(null), 4000);
      }
    } catch (err) {
      console.error('Profile update failed:', err);
      setProfileError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== newPasswordConfirmation) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    setChangingPassword(true);
    setPasswordError(null);
    setPasswordSuccess(null);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/player/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: newPasswordConfirmation
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (res.data?.status === 'success') {
        setPasswordSuccess('Password changed successfully.');
        setCurrentPassword('');
        setNewPassword('');
        setNewPasswordConfirmation('');
        setTimeout(() => setPasswordSuccess(null), 4000);
      }
    } catch (err) {
      console.error('Password change failed:', err);
      setPasswordError(err.response?.data?.message || 'Could not update password. Verify your current password.');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleLogout = async () => {
    playClick();
    await logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--color-text-dim)' }}>
        <RefreshCw size={36} className="animate-spin" style={{ margin: '0 auto 1rem', color: '#00f0ff' }} />
        <div>Loading Player Profile...</div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <Card style={{ textAlign: 'center', padding: '3rem' }}>
        <h3 style={{ color: '#ff4444', marginBottom: '1rem' }}>Failed to Load Profile</h3>
        <p style={{ color: 'var(--color-text-dim)', marginBottom: '1.5rem' }}>{error}</p>
        <Button variant="primary" onClick={fetchProfile}>Retry</Button>
      </Card>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Banner & Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '0.25rem' }}>
            Explorer Profile & Account
          </h1>
          <p style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem' }}>
            Manage identity, avatar presets, temporal rank, and security settings.
          </p>
        </div>

        <Button
          variant="danger"
          onClick={handleLogout}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <LogOut size={16} /> Logout Account
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
            gap: '0.5rem'
          }}
        >
          <Check size={20} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Grid: Profile Telemetry Card (Left) + Edit Profile / Avatar Form (Right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}
      >
        {/* Left: Player Persona Card */}
        <Card title="Chrono Identity Overview" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #00f0ff 0%, #a855f7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                fontWeight: 800,
                color: 'white',
                boxShadow: '0 0 20px rgba(0, 240, 255, 0.4)'
              }}
            >
              {profileData.display_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'white' }}>{profileData.display_name}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-primary-cyan)', fontWeight: 600 }}>{profileData.title}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>@{profileData.username}</div>
            </div>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-dim)', fontStyle: 'italic', lineHeight: 1.5 }}>
            "{profileData.bio}"
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
              padding: '1rem 0',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '0.82rem'
            }}
          >
            <div>
              <span style={{ color: 'var(--color-text-dim)' }}>Level:</span> <strong style={{ color: 'white' }}>Level {profileData.level}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--color-text-dim)' }}>Total XP:</span> <strong style={{ color: '#ffd700' }}>{profileData.xp} XP</strong>
            </div>
            <div>
              <span style={{ color: 'var(--color-text-dim)' }}>Status:</span>{' '}
              <Badge variant={profileData.account_status === 'Active' ? 'success' : 'danger'} size="sm">
                {profileData.account_status}
              </Badge>
            </div>
            <div>
              <span style={{ color: 'var(--color-text-dim)' }}>Enrolled:</span> <strong style={{ color: 'white' }}>{profileData.registration_date}</strong>
            </div>
          </div>

          {/* Quick Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', textAlign: 'center' }}>
            <div style={{ padding: '0.75rem 0.5rem', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-text-dim)' }}>PLAYTIME</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'white' }}>{profileData.total_playtime}</div>
            </div>
            <div style={{ padding: '0.75rem 0.5rem', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-text-dim)' }}>WORLDS</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#00f0ff' }}>{profileData.completed_worlds} / 4</div>
            </div>
            <div style={{ padding: '0.75rem 0.5rem', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-text-dim)' }}>BADGES</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffd700' }}>{profileData.achievements_count}</div>
            </div>
          </div>
        </Card>

        {/* Right: Edit Profile Settings Form */}
        <Card title="Edit Explorer Profile">
          <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-dim)', marginBottom: '0.35rem' }}>
                Display Name (In-Game Name)
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '6px',
                  color: 'white'
                }}
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                This name appears on the global leaderboard and player HUD.
              </span>
            </div>

            {/* Avatar Preset Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-dim)', marginBottom: '0.5rem' }}>
                Select Profile Avatar Preset
              </label>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                  gap: '0.65rem'
                }}
              >
                {profileData.avatar_presets?.map((preset) => (
                  <div
                    key={preset.id}
                    onClick={() => setSelectedAvatar(preset.id)}
                    style={{
                      padding: '0.75rem 0.5rem',
                      borderRadius: '8px',
                      border: selectedAvatar === preset.id ? `2px solid ${preset.color}` : '1px solid rgba(255, 255, 255, 0.1)',
                      backgroundColor: selectedAvatar === preset.id ? 'rgba(0, 240, 255, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: preset.color,
                        margin: '0 auto 0.35rem',
                        boxShadow: `0 0 10px ${preset.color}`
                      }}
                    />
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'white' }}>{preset.name}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-dim)', marginBottom: '0.35rem' }}>
                Explorer Bio / Inscription
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Share your journey notes across timelines..."
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '6px',
                  color: 'white',
                  resize: 'vertical'
                }}
              />
            </div>

            {profileError && (
              <div style={{ color: '#ff4444', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={16} />
                <span>{profileError}</span>
              </div>
            )}

            <div>
              <Button
                type="submit"
                variant="primary"
                disabled={savingProfile}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Save size={16} />
                {savingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {/* Security: Change Password Card */}
      <Card title="Account Security & Password" style={{ maxWidth: '640px' }}>
        <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-dim)', marginBottom: '0.35rem' }}>
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-dim)', marginBottom: '0.35rem' }}>
                New Password (min 8 chars)
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
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
                Confirm New Password
              </label>
              <input
                type="password"
                value={newPasswordConfirmation}
                onChange={(e) => setNewPasswordConfirmation(e.target.value)}
                required
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
          </div>

          {passwordError && (
            <div style={{ color: '#ff4444', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={16} />
              <span>{passwordError}</span>
            </div>
          )}

          {passwordSuccess && (
            <div style={{ color: '#39ff14', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Check size={16} />
              <span>{passwordSuccess}</span>
            </div>
          )}

          <div>
            <Button
              type="submit"
              variant="secondary"
              disabled={changingPassword}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Lock size={16} />
              {changingPassword ? 'Updating Password...' : 'Update Password'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
