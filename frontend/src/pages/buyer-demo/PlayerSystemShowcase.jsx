import React, { useState, useEffect } from 'react';
import {
  User,
  Award,
  Layers,
  Backpack,
  Trophy,
  Sparkles,
  BookOpen,
  Shield,
  Clock,
  Compass,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import api from '../../services/api';

/**
 * Player System Showcase Component
 * Interactive read-only preview of the AERVYN player portal with isolated sample statistics.
 * Explicitly labeled as demo data with zero live player PII exposed.
 */
export default function PlayerSystemShowcase() {
  const [activeTab, setActiveTab] = useState('profile');
  const [sampleData, setSampleData] = useState({
    profile: {
      callsign: 'Operative_Echo7',
      level: 14,
      xp: 14250,
      next_level_xp: 18000,
      campaign_progress: 'World 3: The Fractured Future',
      playtime_hours: 6.4,
      chrono_shards: 38,
      achievements_unlocked: 11,
      total_achievements: 16
    },
    achievements: [
      { id: 'first_keystone', name: 'First Keystone', desc: 'Recovered the lost Chrono Keystone in World 1', unlocked: true, rarity: 'Common' },
      { id: 'temporal_divergence', name: 'Temporal Divergence', desc: 'Triggered your first era phase-shift portal', unlocked: true, rarity: 'Rare' },
      { id: 'circuit_master', name: 'Circuit Master', desc: 'Solved the urban circuit puzzle in under 60 seconds', unlocked: true, rarity: 'Uncommon' },
      { id: 'quantum_alignment', name: 'Quantum Alignment', desc: 'Synchronized all 3 laser nodes in World 3', unlocked: true, rarity: 'Rare' },
      { id: 'chronarch_slayer', name: 'Chronarch Confronted', desc: 'Survived the telegraphed Phase 2 cosmic shockwave', unlocked: false, rarity: 'Epic' }
    ],
    inventory: [
      { item: 'Chrono Keystone (Ancient)', type: 'Artifact', qty: 1, power: 'Opens World 1 Gateway' },
      { item: 'Frequency Tuner', type: 'Gadget', qty: 1, power: 'Calibrates laser nodes' },
      { item: 'Temporal Battery Cell', type: 'Consumable', qty: 4, power: 'Restores Chrono Energy' }
    ],
    leaderboard: [
      { rank: 1, player: 'VortexWalker', score: 9840, speedrun_time: '18:42' },
      { rank: 2, player: 'TimelineZero', score: 9210, speedrun_time: '21:15' },
      { rank: 3, player: 'ChronoGhost', score: 8850, speedrun_time: '22:04' },
      { rank: 4, player: 'Operative_Echo7 (Demo Profile)', score: 8420, speedrun_time: '24:30' }
    ]
  });

  useEffect(() => {
    api.get('/buyer-demo/sample-data')
      .then(res => {
        if (res.data?.data) {
          const d = res.data.data;
          setSampleData({
            profile: d.sample_profile || sampleData.profile,
            achievements: d.sample_achievements || sampleData.achievements,
            inventory: d.sample_inventory || sampleData.inventory,
            leaderboard: d.sample_leaderboard || sampleData.leaderboard
          });
        }
      })
      .catch(() => {});
  }, []);

  const progressPercent = Math.round((sampleData.profile.xp / sampleData.profile.next_level_xp) * 100);

  return (
    <div className="rounded-xl bg-[#080d1e] border border-cyan-500/30 overflow-hidden text-gray-200">
      {/* Official Required Disclaimer Banner */}
      <div className="bg-amber-950/70 border-b border-amber-500/40 px-4 py-2 flex items-center justify-between text-xs text-amber-200">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span className="font-mono font-bold tracking-wide">
            DEMO DATA — NOT LIVE PLAYER STATISTICS
          </span>
        </div>
        <span className="text-[11px] text-amber-300/80 hidden sm:inline">
          Read-Only Architectural Simulation • Zero PII Exposed
        </span>
      </div>

      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-800">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-cyan-400" />
              Player Account, Progression & Social Hub
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Demonstrates the player gaming experience: Level progression, cloud save synchronization, inventory, and competitive rankings.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-1.5 bg-gray-900/80 p-1 rounded-lg border border-gray-800">
            {[
              { id: 'profile', label: 'Profile & XP', icon: User },
              { id: 'achievements', label: 'Achievements', icon: Award },
              { id: 'inventory', label: 'Inventory', icon: Backpack },
              { id: 'leaderboard', label: 'Leaderboard', icon: Trophy }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === tab.id
                    ? 'bg-cyan-500 text-black shadow-sm shadow-cyan-500/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Profile & XP */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-gray-900/60 border border-gray-800">
                <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-1">Callsign</span>
                <strong className="text-base text-white font-mono">{sampleData.profile.callsign}</strong>
              </div>
              <div className="p-4 rounded-lg bg-gray-900/60 border border-gray-800">
                <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider block mb-1">Operative Level</span>
                <strong className="text-base text-cyan-300 font-mono">Level {sampleData.profile.level}</strong>
              </div>
              <div className="p-4 rounded-lg bg-gray-900/60 border border-gray-800">
                <span className="text-[11px] font-mono text-purple-400 uppercase tracking-wider block mb-1">Current World</span>
                <strong className="text-xs text-purple-300 block truncate">{sampleData.profile.campaign_progress}</strong>
              </div>
              <div className="p-4 rounded-lg bg-gray-900/60 border border-gray-800">
                <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider block mb-1">Chrono Shards</span>
                <strong className="text-base text-amber-300 font-mono">{sampleData.profile.chrono_shards} Collected</strong>
              </div>
            </div>

            {/* XP Progress Bar */}
            <div className="p-4 rounded-lg bg-gray-900/40 border border-gray-800">
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-gray-300 font-medium">Experience Points (Level {sampleData.profile.level} → {sampleData.profile.level + 1})</span>
                <span className="font-mono text-cyan-400 font-bold">{sampleData.profile.xp.toLocaleString()} / {sampleData.profile.next_level_xp.toLocaleString()} XP ({progressPercent}%)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-gray-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Achievements */}
        {activeTab === 'achievements' && (
          <div className="space-y-3">
            <div className="text-xs text-gray-400 mb-2">
              Unlocked: <strong className="text-cyan-400">{sampleData.profile.achievements_unlocked}</strong> of {sampleData.profile.total_achievements} Milestone Medals
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sampleData.achievements.map((ach) => (
                <div
                  key={ach.id}
                  className={`p-3.5 rounded-lg border flex items-center justify-between gap-3 ${
                    ach.unlocked
                      ? 'bg-cyan-950/20 border-cyan-500/30'
                      : 'bg-gray-900/40 border-gray-800 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                      ach.unlocked ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'bg-gray-800 text-gray-500'
                    }`}>
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white">{ach.name}</h4>
                      <p className="text-[11px] text-gray-400 mt-0.5">{ach.desc}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase ${
                    ach.unlocked ? 'bg-cyan-900/40 text-cyan-300 border border-cyan-500/20' : 'bg-gray-800 text-gray-500'
                  }`}>
                    {ach.rarity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Inventory */}
        {activeTab === 'inventory' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {sampleData.inventory.map((inv, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-gray-900/60 border border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/20 uppercase">
                      {inv.type}
                    </span>
                    <span className="text-xs font-mono font-bold text-cyan-400">x{inv.qty}</span>
                  </div>
                  <strong className="text-sm text-white block mb-1">{inv.item}</strong>
                  <p className="text-[11px] text-gray-400">{inv.power}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Leaderboard */}
        {activeTab === 'leaderboard' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 bg-gray-900/40">
                  <th className="p-3">Rank</th>
                  <th className="p-3">Operative Callsign</th>
                  <th className="p-3">Timeline Score</th>
                  <th className="p-3 text-right">Speedrun Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 text-gray-300">
                {sampleData.leaderboard.map((row) => (
                  <tr key={row.rank} className={row.rank === 4 ? 'bg-cyan-500/10' : ''}>
                    <td className="p-3 font-mono font-bold text-cyan-400">#{row.rank}</td>
                    <td className="p-3 font-semibold text-white">{row.player}</td>
                    <td className="p-3 font-mono text-purple-300">{row.score.toLocaleString()} pts</td>
                    <td className="p-3 font-mono text-right text-gray-400">{row.speedrun_time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
