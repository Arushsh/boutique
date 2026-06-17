import React, { useEffect, useState } from 'react';
import { Search, ShieldAlert, Shield, Trash2, Users } from 'lucide-react';
import api from '../../api/axios';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (search) params.set('search', search);
      const { data } = await api.get(`/users?${params}`);
      setUsers(data.users || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch (err) {
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const toggleRole = async (user) => {
    if (!window.confirm(`Change role of ${user.firstName} to ${user.role === 'admin' ? 'user' : 'admin'}?`)) return;
    setActionLoading(user._id);
    try {
      await api.put(`/users/${user._id}/role`, { role: user.role === 'admin' ? 'user' : 'admin' });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to change role.');
    } finally {
      setActionLoading(null);
    }
  };

  const toggleStatus = async (user) => {
    if (!window.confirm(`${user.isActive ? 'Deactivate' : 'Activate'} account for ${user.firstName}?`)) return;
    setActionLoading(user._id);
    try {
      await api.put(`/users/${user._id}/status`, { isActive: !user.isActive });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update status.');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Customers</h2>
          <p className="admin-page-subtitle">{total} registered users</p>
        </div>
      </div>

      {error && <div className="admin-alert admin-alert-error">{error}</div>}

      <div className="admin-toolbar">
        <form onSubmit={handleSearch} className="admin-search">
          <Search size={16} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
          />
        </form>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6}><div className="admin-loading"><div className="spinner" /> Loading users...</div></td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={6}><div className="admin-empty"><Users size={40} /><h3>No users found</h3></div></td></tr>
            ) : users.map(u => (
              <tr key={u._id}>
                <td style={{ fontWeight: 600 }}>{u.firstName} {u.lastName}</td>
                <td style={{ color: 'var(--admin-text-muted)' }}>{u.email}</td>
                <td>
                  <span className={`badge ${u.role === 'admin' ? 'badge-gold' : 'badge-gray'}`}>
                    {u.role === 'admin' ? <Shield size={12} style={{ marginRight: 4 }} /> : null}
                    {u.role}
                  </span>
                </td>
                <td>
                  <span className={`badge ${u.isActive ? 'badge-green' : 'badge-red'}`}>
                    {u.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem' }}>
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      className="admin-btn admin-btn-ghost admin-btn-sm"
                      onClick={() => toggleRole(u)}
                      disabled={actionLoading === u._id}
                    >
                      {u.role === 'admin' ? 'Demote' : 'Promote'}
                    </button>
                    <button
                      className={`admin-btn admin-btn-sm ${u.isActive ? 'admin-btn-danger' : 'admin-btn-success'}`}
                      onClick={() => toggleStatus(u)}
                      disabled={actionLoading === u._id}
                    >
                      {u.isActive ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

export default AdminUsers;
