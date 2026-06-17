import React, { useEffect, useState } from 'react';
import { MessageSquare, CheckCircle, Clock } from 'lucide-react';
import api from '../../api/axios';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState('');

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (filter === 'resolved') params.set('resolved', 'true');
      if (filter === 'pending') params.set('resolved', 'false');

      const { data } = await api.get(`/contact?${params}`);
      setMessages(data.messages || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch (err) {
      console.error('Fetch messages error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, [filter, page]);

  const handleResolve = async (id) => {
    setActionLoading(id);
    try {
      await api.put(`/contact/${id}/resolve`);
      fetchMessages();
    } catch (err) {
      setError('Failed to resolve message. Please try again.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Customer Messages</h2>
          <p className="admin-page-subtitle">{total} total inquiries</p>
        </div>
      </div>

      {error && <div className="admin-alert admin-alert-error">{error}</div>}

      <div className="admin-toolbar">
        <div style={{ display: 'flex', gap: 8 }}>
          {['all', 'pending', 'resolved'].map(f => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(1); }}
              className={`admin-btn admin-btn-sm ${filter === f ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
              style={{ textTransform: 'capitalize' }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {loading ? (
          <div className="admin-loading"><div className="spinner" /> Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="admin-empty" style={{ background: 'var(--admin-surface)', borderRadius: 16, padding: 60 }}>
            <MessageSquare size={40} />
            <h3>No messages found</h3>
            <p>You're all caught up!</p>
          </div>
        ) : messages.map(msg => (
          <div key={msg._id} className="admin-card" style={{ borderColor: msg.resolved ? 'var(--admin-border)' : 'rgba(201,169,110,0.3)', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <h4 style={{ margin: '0 0 4px', fontSize: '1.05rem', color: 'var(--admin-text)' }}>{msg.subject.toUpperCase()}</h4>
                <div style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
                  From <strong style={{ color: 'var(--admin-text)' }}>{msg.name}</strong> ({msg.email})
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', marginBottom: 6 }}>
                  {new Date(msg.createdAt).toLocaleString()}
                </div>
                <span className={`badge ${msg.resolved ? 'badge-green' : 'badge-yellow'}`}>
                  {msg.resolved ? <CheckCircle size={12} style={{ marginRight: 4 }} /> : <Clock size={12} style={{ marginRight: 4 }} />}
                  {msg.resolved ? 'Resolved' : 'Pending'}
                </span>
              </div>
            </div>
            
            <div style={{ padding: 16, background: 'var(--admin-surface-2)', borderRadius: 10, border: '1px solid var(--admin-border)', fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--admin-text)', marginBottom: 16 }}>
              {msg.message}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              {!msg.resolved && (
                <button
                  className="admin-btn admin-btn-success admin-btn-sm"
                  onClick={() => handleResolve(msg._id)}
                  disabled={actionLoading === msg._id}
                >
                  <CheckCircle size={14} /> {actionLoading === msg._id ? 'Resolving...' : 'Mark as Resolved'}
                </button>
              )}
              {msg.resolved && msg.resolvedBy && (
                <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
                  Resolved by {msg.resolvedBy.firstName} {msg.resolvedBy.lastName} on {new Date(msg.resolvedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
          <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>← Prev</button>
          <span style={{ padding: '5px 14px', color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>Page {page} of {pages}</span>
          <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}>Next →</button>
        </div>
      )}
    </>
  );
};

export default AdminMessages;
