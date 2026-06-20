import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search } from 'lucide-react';
import api from '../../api/axios';

const STATUS_OPTIONS = ['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

const statusColor = {
  pending:    'badge-yellow',
  confirmed:  'badge-blue',
  processing: 'badge-blue',
  shipped:    'badge-gold',
  delivered:  'badge-green',
  cancelled:  'badge-red',
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (status !== 'all') params.set('status', status);
      const { data } = await api.get(`/orders?${params}`);
      setOrders(data.orders || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch (err) {
      console.error('Fetch orders error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [status, page]);

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Orders</h2>
          <p className="admin-page-subtitle">{total} total orders</p>
        </div>
      </div>

      <div className="admin-toolbar">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {STATUS_OPTIONS.map(s => (
            <button
              key={s}
              onClick={() => { setStatus(s); setPage(1); }}
              className={`admin-btn admin-btn-sm ${status === s ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
              style={{ textTransform: 'capitalize' }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8}><div className="admin-loading"><div className="spinner" /> Loading...</div></td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={8}>
                <div className="admin-empty">
                  <ShoppingCart size={40} />
                  <h3>No orders found</h3>
                  <p>Orders will appear here once customers place them.</p>
                </div>
              </td></tr>
            ) : orders.map(order => (
              <tr key={order._id}>
                <td style={{ fontFamily: 'monospace', color: 'var(--admin-accent)', fontSize: '0.78rem' }}>
                  {order.orderNumber}
                </td>
                <td>
                  <div style={{ fontWeight: 600 }}>{order.user?.firstName} {order.user?.lastName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>{order.user?.email}</div>
                </td>
                <td style={{ color: 'var(--admin-text-muted)' }}>
                  {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                </td>
                <td style={{ fontWeight: 700 }}>₹{order.total?.toFixed(2)}</td>
                <td>
                  <span className={`badge ${order.paymentStatus === 'paid' ? 'badge-green' : 'badge-yellow'}`}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td>
                  <span className={`badge ${statusColor[order.status] || 'badge-gray'}`} style={{ textTransform: 'capitalize' }}>
                    {order.status}
                  </span>
                </td>
                <td style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem' }}>
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td>
                  <Link to={`/admin/orders/${order._id}`} className="admin-btn admin-btn-ghost admin-btn-sm">
                    Manage
                  </Link>
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

export default AdminOrders;
