import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { 
  Bell, 
  CheckCheck, 
  UserPlus, 
  Swords, 
  Trophy, 
  UserX, 
  AlertCircle, 
  Clock, 
  ExternalLink,
  Trash2,
  Filter
} from 'lucide-react';

export default function SocialNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all | unread | read
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/social/notifications');
      if (res.data?.success) {
        setNotifications(res.data.data.notifications || []);
        setUnreadCount(res.data.data.unread_count || 0);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
      setError('Unable to load social alerts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await api.post(`/social/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      setActionLoading(true);
      await api.post('/social/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read_at: n.read_at || new Date().toISOString() })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all read:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const getNotificationIcon = (type) => {
    if (type?.includes('friend')) {
      if (type.includes('removed')) return <UserX className="w-5 h-5 text-rose-400" />;
      return <UserPlus className="w-5 h-5 text-cyan-400" />;
    }
    if (type?.includes('challenge')) {
      if (type.includes('completed')) return <Trophy className="w-5 h-5 text-amber-400" />;
      return <Swords className="w-5 h-5 text-violet-400" />;
    }
    return <Bell className="w-5 h-5 text-blue-400" />;
  };

  const getActionLink = (type) => {
    if (type?.includes('friend_request')) return { path: '/social/requests', label: 'View Requests' };
    if (type?.includes('friend')) return { path: '/social/friends', label: 'Friends Roster' };
    if (type?.includes('challenge')) return { path: '/social/challenges', label: 'Open Arena' };
    return null;
  };

  const filteredNotifications = notifications.filter(item => {
    if (filter === 'unread') return !item.read_at;
    if (filter === 'read') return !!item.read_at;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-wide">Temporal Dispatch Alerts</h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry and social transponder updates from fellow operatives across all timelines.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Filter Pills */}
          <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            {['all', 'unread', 'read'].map(key => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-1 text-xs font-medium rounded-lg capitalize transition-all ${
                  filter === key 
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {key}
              </button>
            ))}
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              disabled={actionLoading}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition border border-slate-700"
            >
              <CheckCheck className="w-4 h-4 text-cyan-400" />
              <span>Mark All Read</span>
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800/80">
          <div className="inline-block animate-spin w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full mb-3" />
          <p className="text-sm">Synchronizing temporal alerts...</p>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-slate-900/30 rounded-2xl border border-slate-800/60">
          <Bell className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-300">No Notifications</h3>
          <p className="text-xs text-slate-500 mt-1">
            {filter === 'unread' ? 'All dispatches have been acknowledged.' : 'Your comms frequency is quiet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((item) => {
            const isRead = !!item.read_at;
            const action = getActionLink(item.type);

            return (
              <div 
                key={item.id}
                className={`relative group p-4 rounded-xl border transition-all ${
                  isRead 
                    ? 'bg-slate-900/30 border-slate-800/60 text-slate-400' 
                    : 'bg-gradient-to-r from-slate-900/90 to-cyan-950/20 border-cyan-500/40 shadow-lg shadow-cyan-950/20 text-slate-200'
                }`}
              >
                {!isRead && (
                  <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-cyan-400 ring-4 ring-cyan-500/20" />
                )}

                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-xl border ${
                    isRead ? 'bg-slate-950/50 border-slate-800' : 'bg-cyan-500/10 border-cyan-500/30'
                  }`}>
                    {getNotificationIcon(item.type)}
                  </div>

                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`text-sm font-bold ${isRead ? 'text-slate-300' : 'text-white'}`}>
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(item.created_at).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed mb-3">
                      {item.message}
                    </p>

                    <div className="flex items-center gap-3">
                      {action && (
                        <Link
                          to={action.path}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition"
                        >
                          <span>{action.label}</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}

                      {!isRead && (
                        <button
                          onClick={() => handleMarkAsRead(item.id)}
                          className="text-xs text-slate-400 hover:text-cyan-400 transition flex items-center gap-1"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          <span>Mark Read</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
