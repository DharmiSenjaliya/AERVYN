import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  UserPlus,
  UserCheck,
  UserX,
  Clock,
  RefreshCw,
  Check,
  AlertTriangle,
  Search
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { useAudio } from '../../context/AudioContext';

export default function FriendRequestsPage() {
  const { playClick, playSuccess } = useAudio();
  const outletCtx = useOutletContext();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [successMsg, setSuccessMsg] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/social/requests');
      if (res.data?.status === 'success' || res.data?.success) {
        setReceived(res.data.received || res.data.data?.received || []);
        setSent(res.data.sent || res.data.data?.sent || []);
        outletCtx?.fetchQuickCounts?.();
      }
    } catch (err) {
      console.error('Failed to load requests:', err);
      setError('Unable to load friend requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (requestId, name) => {
    setProcessingId(requestId);
    try {
      const res = await api.post(`/social/requests/${requestId}/accept`);
      if (res.data?.status === 'success' || res.data?.success) {
        playSuccess?.();
        setSuccessMsg(`Accepted friend request from ${name}!`);
        await fetchRequests();
        setTimeout(() => setSuccessMsg(null), 3500);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to accept request.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId) => {
    setProcessingId(requestId);
    try {
      const res = await api.post(`/social/requests/${requestId}/reject`);
      if (res.data?.status === 'success' || res.data?.success) {
        setSuccessMsg('Friend request rejected.');
        await fetchRequests();
        setTimeout(() => setSuccessMsg(null), 3500);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject request.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleCancel = async (requestId) => {
    setProcessingId(requestId);
    try {
      const res = await api.post(`/social/requests/${requestId}/cancel`);
      if (res.data?.status === 'success' || res.data?.success) {
        setSuccessMsg('Friend request cancelled.');
        await fetchRequests();
        setTimeout(() => setSuccessMsg(null), 3500);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel request.');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '0.25rem' }}>
            Friend Requests
          </h1>
          <p style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem' }}>
            Review incoming connection invitations or manage pending requests you sent to other players.
          </p>
        </div>

        <Button
          variant="secondary"
          onClick={fetchRequests}
          disabled={loading}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
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
          <Check size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Grid: Received Requests (Left) + Sent Requests (Right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}
      >
        {/* Received Invites */}
        <Card title={`Received Requests (${received.length})`}>
          {received.length === 0 ? (
            <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--color-text-dim)' }}>
              <UserPlus size={36} color="rgba(255, 255, 255, 0.2)" style={{ margin: '0 auto 0.75rem' }} />
              <div>No incoming friend requests.</div>
              <div style={{ fontSize: '0.78rem', marginTop: '0.25rem' }}>When players invite you, their requests will appear here.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {received.map((req) => (
                <div
                  key={req.request_id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(0, 240, 255, 0.2)',
                    borderRadius: '8px',
                    gap: '0.75rem',
                    flexWrap: 'wrap'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #00f0ff 0%, #a855f7 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        color: 'white'
                      }}
                    >
                      {req.display_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: 'white', fontSize: '0.95rem' }}>{req.display_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-primary-cyan)' }}>{req.rank_title} &bull; Lvl {req.level}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Received {req.sent_at}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button
                      variant="primary"
                      size="small"
                      disabled={processingId === req.request_id}
                      onClick={() => handleAccept(req.request_id, req.display_name)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      <UserCheck size={14} /> Accept
                    </Button>
                    <Button
                      variant="danger"
                      size="small"
                      disabled={processingId === req.request_id}
                      onClick={() => handleReject(req.request_id)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      <UserX size={14} /> Decline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Sent Invites */}
        <Card title={`Sent Requests (${sent.length})`}>
          {sent.length === 0 ? (
            <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--color-text-dim)' }}>
              <Clock size={36} color="rgba(255, 255, 255, 0.2)" style={{ margin: '0 auto 0.75rem' }} />
              <div>No outgoing pending requests.</div>
              <div style={{ fontSize: '0.78rem', marginTop: '0.25rem' }}>
                Use Player Search to find explorers and connect.
              </div>
              <Button
                variant="secondary"
                size="small"
                onClick={() => navigate('/social/search')}
                style={{ marginTop: '1rem' }}
              >
                Search Explorers
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {sent.map((req) => (
                <div
                  key={req.request_id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    gap: '0.75rem',
                    flexWrap: 'wrap'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        color: 'white'
                      }}
                    >
                      {req.display_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: 'white', fontSize: '0.95rem' }}>{req.display_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>{req.rank_title} &bull; Lvl {req.level}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Sent {req.sent_at}</div>
                    </div>
                  </div>

                  <div>
                    <Button
                      variant="secondary"
                      size="small"
                      disabled={processingId === req.request_id}
                      onClick={() => handleCancel(req.request_id)}
                    >
                      Cancel Request
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
