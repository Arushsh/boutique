import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, Truck, AlertCircle, Save } from 'lucide-react';
import api from '../../api/axios';

const STATUS_OPTIONS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

const AdminOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data.order);
        setStatus(data.order.status);
        setTrackingNumber(data.order.trackingNumber || '');
      } catch (err) {
        setError('Failed to load order.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const { data } = await api.put(`/orders/${id}/status`, { status, trackingNumber });
      setOrder(data.order);
      setSuccess('Order updated successfully.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update order.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-loading"><div className="spinner" /> Loading order details...</div>;
  if (!order) return <div className="admin-empty"><AlertCircle size={40} /><h3>Order Not Found</h3></div>;

  return (
    <>
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => navigate('/admin/orders')}>
            <ArrowLeft size={15} />
          </button>
          <div>
            <h2 className="admin-page-title">Order {order.orderNumber}</h2>
            <p className="admin-page-subtitle">Placed on {new Date(order.createdAt).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {error && <div className="admin-alert admin-alert-error">{error}</div>}
      {success && <div className="admin-alert admin-alert-success">{success}</div>}

      <div className="order-detail-grid">
        {/* Left Col: Items & Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="admin-card">
            <div className="section-title-sm">Order Items</div>
            <div className="admin-table-wrap" style={{ marginTop: 16 }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map(item => (
                    <tr key={item._id}>
                      <td style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img src={item.image} alt={item.name} className="product-thumb" />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>Size: {item.size}</div>
                        </div>
                      </td>
                      <td>₹{item.price.toFixed(2)}</td>
                      <td>x{item.quantity}</td>
                      <td style={{ fontWeight: 600 }}>₹{(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
              <div style={{ width: 250 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>
                  <span>Subtotal</span>
                  <span>₹{order.subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>
                  <span>Shipping</span>
                  <span>₹{order.shippingCost.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>
                  <span>Tax</span>
                  <span>₹{order.tax.toFixed(2)}</span>
                </div>
                <div style={{ height: 1, background: 'var(--admin-border)', marginBottom: 16 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.2rem', color: 'var(--admin-accent)' }}>
                  <span>Total</span>
                  <span>₹{order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Customer, Shipping, Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Status Update */}
          <div className="admin-card" style={{ borderColor: 'rgba(201,169,110,0.3)', background: 'rgba(201,169,110,0.03)' }}>
            <div className="section-title-sm">Update Status</div>
            <div className="admin-form-group" style={{ marginBottom: 16 }}>
              <label className="admin-label">Order Status</label>
              <select className="admin-select" value={status} onChange={e => setStatus(e.target.value)}>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
            <div className="admin-form-group" style={{ marginBottom: 20 }}>
              <label className="admin-label">Tracking Number (Optional)</label>
              <input className="admin-input" value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)} placeholder="e.g. 1Z9999999999999999" />
            </div>
            <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving} style={{ width: '100%', justifyContent: 'center' }}>
              {saving ? <div className="spinner" style={{ width: 14, height: 14 }} /> : <><Save size={15} /> Save Changes</>}
            </button>
          </div>

          {/* Customer Info */}
          <div className="admin-card">
            <div className="section-title-sm"><CreditCard size={16} /> Customer Details</div>
            <div className="order-info-grid">
              <div className="order-info-item">
                <label>Name</label>
                <p>{order.user.firstName} {order.user.lastName}</p>
              </div>
              <div className="order-info-item">
                <label>Email</label>
                <p>{order.user.email}</p>
              </div>
              <div className="order-info-item">
                <label>Payment Method</label>
                <p style={{ textTransform: 'uppercase' }}>{order.paymentMethod}</p>
              </div>
              <div className="order-info-item">
                <label>Payment Status</label>
                <p className={`badge ${order.paymentStatus === 'paid' ? 'badge-green' : 'badge-yellow'}`} style={{ marginTop: 4 }}>
                  {order.paymentStatus}
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="admin-card">
            <div className="section-title-sm"><MapPin size={16} /> Shipping Address</div>
            <div style={{ color: 'var(--admin-text)', fontSize: '0.9rem', lineHeight: 1.6, marginTop: 16 }}>
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
              {order.shippingAddress.street}<br />
              {order.shippingAddress.apartment && <>{order.shippingAddress.apartment}<br /></>}
              {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
              {order.shippingAddress.country}
            </div>
            {order.notes && (
              <div style={{ marginTop: 16, padding: 12, background: 'var(--admin-surface-2)', borderRadius: 8, border: '1px solid var(--admin-border)', fontSize: '0.85rem' }}>
                <strong style={{ color: 'var(--admin-text-muted)' }}>Customer Notes:</strong><br/>
                {order.notes}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminOrderDetail;
