import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package, ShoppingCart, Users, MessageSquare,
  TrendingUp, DollarSign, Clock, CheckCircle, ArrowRight
} from 'lucide-react';
import api from '../../api/axios';

const statusColor = {
  pending:    'badge-yellow',
  confirmed:  'badge-blue',
  processing: 'badge-blue',
  shipped:    'badge-gold',
  delivered:  'badge-green',
  cancelled:  'badge-red',
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [msgCount, setMsgCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [orderStats, orders, products, users, messages] = await Promise.all([
          api.get('/orders/stats/summary'),
          api.get('/orders?limit=6'),
          api.get('/products?limit=1'),
          api.get('/users?limit=1'),
          api.get('/contact?limit=1'),
        ]);
        setStats(orderStats.data);
        setRecentOrders(orders.data.orders || []);
        setProductCount(products.data.total || 0);
        setUserCount(users.data.total || 0);
        setMsgCount(messages.data.total || 0);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return (
    <div className="admin-loading">
      <div className="spinner" />
      Loading dashboard...
    </div>
  );

  const statCards = [
    {
      label: 'Total Revenue',
      value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: '#c9a96e',
      bg: 'rgba(201,169,110,0.1)',
    },
    {
      label: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: '#3b82f6',
      bg: 'rgba(59,130,246,0.1)',
    },
    {
      label: 'Pending Orders',
      value: stats?.pendingOrders || 0,
      icon: Clock,
      color: '#f59e0b',
      bg: 'rgba(245,158,11,0.1)',
    },
    {
      label: 'Delivered',
      value: stats?.deliveredOrders || 0,
      icon: CheckCircle,
      color: '#22c55e',
      bg: 'rgba(34,197,94,0.1)',
    },
    {
      label: 'Products',
      value: productCount,
      icon: Package,
      color: '#a855f7',
      bg: 'rgba(168,85,247,0.1)',
    },
    {
      label: 'Customers',
      value: userCount,
      icon: Users,
      color: '#ec4899',
      bg: 'rgba(236,72,153,0.1)',
    },
    {
      label: 'Messages',
      value: msgCount,
      icon: MessageSquare,
      color: '#06b6d4',
      bg: 'rgba(6,182,212,0.1)',
    },
  ];

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Overview</h2>
          <p className="admin-page-subtitle">Welcome back! Here's what's happening.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div className="stat-card" key={label} style={{ '--stat-color': color, '--stat-bg': bg }}>
            <div className="stat-icon">
              <Icon size={22} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{value}</div>
              <div className="stat-label">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Add New Product', to: '/admin/products/new', icon: Package },
          { label: 'Manage Orders', to: '/admin/orders', icon: ShoppingCart },
          { label: 'View Customers', to: '/admin/users', icon: Users },
          { label: 'View Messages', to: '/admin/messages', icon: MessageSquare },
        ].map(({ label, to, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="admin-card"
            style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: 'var(--admin-text)' }}
          >
            <Icon size={18} style={{ color: 'var(--admin-accent)' }} />
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{label}</span>
            <ArrowRight size={14} style={{ marginLeft: 'auto', color: 'var(--admin-text-muted)' }} />
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div>
        <div className="section-title-sm">
          <TrendingUp size={16} style={{ color: 'var(--admin-accent)' }} />
          Recent Orders
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--admin-text-muted)', padding: '40px' }}>No orders yet</td></tr>
              ) : recentOrders.map(order => (
                <tr key={order._id}>
                  <td style={{ fontFamily: 'monospace', color: 'var(--admin-accent)', fontSize: '0.8rem' }}>
                    {order.orderNumber}
                  </td>
                  <td>
                    {order.user?.firstName} {order.user?.lastName}
                    <br />
                    <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>{order.user?.email}</span>
                  </td>
                  <td style={{ fontWeight: 700 }}>₹{order.total?.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${statusColor[order.status] || 'badge-gray'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem' }}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <Link to={`/admin/orders/${order._id}`} className="admin-btn admin-btn-ghost admin-btn-sm">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {recentOrders.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Link to="/admin/orders" className="admin-btn admin-btn-ghost">
              View All Orders <ArrowRight size={15} />
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
