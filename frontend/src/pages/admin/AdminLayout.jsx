import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, Users, MessageSquare,
  LogOut, Menu, X, ExternalLink, Settings as SettingsIcon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './admin.css';
import ThemeToggle from '../../components/ThemeToggle';

const navItems = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Products',  to: '/admin/products', icon: Package },
  { label: 'Orders',    to: '/admin/orders',   icon: ShoppingCart },
  { label: 'Users',     to: '/admin/users',    icon: Users },
  { label: 'Messages',  to: '/admin/messages', icon: MessageSquare },
  { label: 'Settings',  to: '/admin/settings', icon: SettingsIcon },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    : 'A';

  return (
    <div className="admin-shell">
      {/* Mobile Sidebar Toggle */}
      <button
        className="admin-mobile-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
            zIndex: 99, backdropFilter: 'blur(4px)'
          }}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <a href="/admin">Aura Boutique</a>
          <span>Admin Console</span>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li className="sidebar-section-label">Management</li>
            {navItems.map(({ label, to, icon: Icon, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) => isActive ? 'active' : ''}
                >
                  <Icon size={18} />
                  {label}
                </NavLink>
              </li>
            ))}

            <li className="sidebar-section-label" style={{ marginTop: 12 }}>Storefront</li>
            <li>
              <a href="/" target="_blank" rel="noreferrer">
                <ExternalLink size={18} />
                View Store
              </a>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{initials}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="sidebar-user-role">Administrator</div>
            </div>
          </div>
          <button className="sidebar-logout" onClick={handleLogout}>
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <main className="admin-main">
        <div className="admin-topbar">
          <h1>Admin Dashboard</h1>
          <div className="topbar-right">
            <ThemeToggle />
            <span className="topbar-badge">ADMIN</span>
          </div>
        </div>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
