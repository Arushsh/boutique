import React, { useEffect, useState } from 'react';
import { Save, Settings as SettingsIcon } from 'lucide-react';
import api from '../../api/axios';

const AdminSettings = () => {
  const [form, setForm] = useState({
    saleActive: false,
    saleHeadline: '',
    saleSubheadline: '',
    saleCtaText: '',
    saleImage: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        setForm({
          saleActive: data.saleActive || false,
          saleHeadline: data.saleHeadline || '',
          saleSubheadline: data.saleSubheadline || '',
          saleCtaText: data.saleCtaText || '',
          saleImage: data.saleImage || ''
        });
      } catch (err) {
        setError('Failed to load settings.');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await api.put('/settings', form);
      setSuccess('Settings updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-loading"><div className="spinner" /> Loading settings...</div>;

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title"><SettingsIcon size={20} style={{ display: 'inline', marginRight: 8, color: 'var(--admin-accent)' }} /> Store Settings</h2>
          <p className="admin-page-subtitle">Manage global storefront configurations</p>
        </div>
      </div>

      {error && <div className="admin-alert admin-alert-error">{error}</div>}
      {success && <div className="admin-alert admin-alert-success">{success}</div>}

      <form onSubmit={handleSubmit} style={{ maxWidth: 800 }}>
        <div className="admin-card" style={{ marginBottom: 24 }}>
          <div className="section-title-sm" style={{ marginBottom: 20 }}>Global Sale Banner</div>
          
          <div style={{ padding: 16, background: 'var(--admin-surface-2)', borderRadius: 10, marginBottom: 20, border: '1px solid var(--admin-border)' }}>
            <label className="admin-checkbox-label" style={{ margin: 0, fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={form.saleActive}
                onChange={e => setForm({ ...form, saleActive: e.target.checked })}
              />
              Enable Global Sale Banner on Home Page
            </label>
            <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', marginTop: 8, marginLeft: 28 }}>
              When enabled, a prominent banner will appear on the home page highlighting the sale.
            </p>
          </div>

          <div className="admin-form-grid">
            <div className="admin-form-group full">
              <label className="admin-label">Headline</label>
              <input
                className="admin-input"
                value={form.saleHeadline}
                onChange={e => setForm({ ...form, saleHeadline: e.target.value })}
                placeholder="e.g. Mid-Season Boutique Sale"
                disabled={!form.saleActive}
              />
            </div>
            <div className="admin-form-group full">
              <label className="admin-label">Subheadline</label>
              <input
                className="admin-input"
                value={form.saleSubheadline}
                onChange={e => setForm({ ...form, saleSubheadline: e.target.value })}
                placeholder="e.g. Enjoy Up To 50% Off Selected Collections"
                disabled={!form.saleActive}
              />
            </div>
            <div className="admin-form-group half">
              <label className="admin-label">Call to Action (Button Text)</label>
              <input
                className="admin-input"
                value={form.saleCtaText}
                onChange={e => setForm({ ...form, saleCtaText: e.target.value })}
                placeholder="e.g. Shop Sale"
                disabled={!form.saleActive}
              />
            </div>
            <div className="admin-form-group half">
              <label className="admin-label">Banner Image URL</label>
              <input
                className="admin-input"
                value={form.saleImage}
                onChange={e => setForm({ ...form, saleImage: e.target.value })}
                placeholder="https://..."
                disabled={!form.saleActive}
              />
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving} className="admin-btn admin-btn-primary">
          {saving ? <div className="spinner" style={{ width: 14, height: 14 }} /> : <><Save size={15} /> Save Settings</>}
        </button>
      </form>
    </>
  );
};

export default AdminSettings;
