import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  Users, 
  Trophy, 
  Award, 
  Swords, 
  UserX, 
  Check, 
  AlertCircle,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

export default function SocialPrivacyPage() {
  const [settings, setSettings] = useState({
    allow_friend_requests: true,
    show_public_profile: true,
    show_achievements: true,
    show_leaderboard_profile: true,
    show_selected_ending: true,
    show_challenge_statistics: true
  });
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [unblockingId, setUnblockingId] = useState(null);
  const [error, setError] = useState(null);

  const fetchPrivacyAndBlocks = async () => {
    try {
      setLoading(true);
      const [privacyRes, blocksRes] = await Promise.all([
        api.get('/social/privacy'),
        api.get('/social/blocks')
      ]);

      if (privacyRes.data?.success) {
        setSettings(privacyRes.data.data);
      }
      if (blocksRes.data?.success) {
        setBlockedUsers(blocksRes.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load privacy data:', err);
      setError('Failed to fetch privacy settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrivacyAndBlocks();
  }, []);

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    setSaveSuccess(false);
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      const res = await api.put('/social/privacy', settings);
      if (res.data?.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } catch (err) {
      console.error('Failed to update privacy settings:', err);
      setError('Could not save privacy preferences. Please retry.');
    } finally {
      setSaving(false);
    }
  };

  const handleUnblock = async (blockedUserId) => {
    try {
      setUnblockingId(blockedUserId);
      await api.delete(`/social/blocks/${blockedUserId}`);
      setBlockedUsers(prev => prev.filter(b => b.blocked_user_id !== blockedUserId && b.blocked_user?.id !== blockedUserId));
    } catch (err) {
      console.error('Failed to unblock user:', err);
    } finally {
      setUnblockingId(null);
    }
  };

  const controls = [
    {
      key: 'allow_friend_requests',
      title: 'Friend Influx & Invitations',
      desc: 'Permit other operatives in the multiverse to dispatch alliance inquiries to you.',
      icon: Users
    },
    {
      key: 'show_public_profile',
      title: 'Public Dossier Visibility',
      desc: 'Allow other players to review your operative status, avatar, and temporal accomplishments.',
      icon: Eye
    },
    {
      key: 'show_achievements',
      title: 'Achievement Showcase',
      desc: 'Make your unlocked badges and ancient lore breakthroughs visible to observers.',
      icon: Award
    },
    {
      key: 'show_leaderboard_profile',
      title: 'Global Roster Indexing',
      desc: 'Include your callsign and XP ranking on public leaderboard standings.',
      icon: Trophy
    },
    {
      key: 'show_selected_ending',
      title: 'Final Timeline Verdict',
      desc: 'Reveal your chosen timeline ending (Chronos / Weaver / Fracture) on your public card.',
      icon: Sparkles
    },
    {
      key: 'show_challenge_statistics',
      title: 'Competitive Telemetry',
      desc: 'Broadcast your challenge arena combat win/loss records and completed trials.',
      icon: Swords
    }
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex items-start gap-4">
        <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide">Temporal Privacy & Security</h1>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Configure how your operative data is distributed across the social mesh. You maintain 100% control over visibility, leaderboards, and direct player challenges.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Privacy Settings Form */}
      <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/80 backdrop-blur-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span>Operative Data Broadcast Controls</span>
          </h2>
          {saveSuccess && (
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 animate-fade-in">
              <Check className="w-4 h-4" /> Preferences Saved
            </span>
          )}
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400">
            <div className="inline-block animate-spin w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full mb-2" />
            <p className="text-xs">Fetching privacy protocol...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {controls.map(item => {
              const Icon = item.icon;
              const isEnabled = !!settings[item.key];

              return (
                <div 
                  key={item.key}
                  onClick={() => handleToggle(item.key)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                    isEnabled 
                      ? 'bg-slate-900/60 border-slate-700/80 hover:border-cyan-500/40' 
                      : 'bg-slate-950/40 border-slate-900 opacity-60 hover:opacity-90'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`p-2.5 rounded-lg border ${
                      isEnabled ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-slate-800 border-slate-700 text-slate-500'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                  </div>

                  {/* Switch Pill */}
                  <div className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-0.5 shrink-0 ${
                    isEnabled ? 'bg-cyan-500' : 'bg-slate-800'
                  }`}>
                    <div className={`w-5 h-5 rounded-full bg-slate-950 shadow-md transition-transform transform ${
                      isEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </div>
                </div>
              );
            })}

            <div className="pt-4 flex justify-end">
              <button
                onClick={handleSaveSettings}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-cyan-500/20 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Committing...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Apply Protocol Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Blocked Users Section */}
      <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/80 backdrop-blur-sm space-y-4">
        <div className="border-b border-slate-800 pb-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <UserX className="w-4 h-4 text-rose-400" />
            <span>Blacklisted Operatives ({blockedUsers.length})</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Blocked operatives cannot view your profile, send challenge duels, dispatch friend invites, or interact with your activity transmissions.
          </p>
        </div>

        {blockedUsers.length === 0 ? (
          <div className="p-8 text-center text-slate-500 bg-slate-950/30 rounded-xl border border-slate-900">
            <Shield className="w-8 h-8 text-slate-700 mx-auto mb-2" />
            <p className="text-xs">No operatives currently blacklisted.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {blockedUsers.map(entry => {
              const u = entry.blocked_user || {};
              const targetId = u.id || entry.blocked_user_id;

              return (
                <div key={entry.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold text-slate-400">
                      {u.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{u.name || `User #${targetId}`}</h4>
                      <p className="text-[10px] text-slate-500">Blacklisted on {new Date(entry.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleUnblock(targetId)}
                    disabled={unblockingId === targetId}
                    className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition border border-slate-700"
                  >
                    {unblockingId === targetId ? 'Restoring...' : 'Unblock'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
