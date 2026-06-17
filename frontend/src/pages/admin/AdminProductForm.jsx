import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Package } from 'lucide-react';
import api from '../../api/axios';

const CATEGORIES = ['Dresses', 'Sets', 'Tops', 'Traditional', 'Outerwear', 'Bottoms', 'Accessories'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];

const empty = {
  name: '', description: '', price: '', originalPrice: '',
  category: 'Dresses', image: '', stock: '', sizes: ['XS', 'S', 'M', 'L', 'XL'],
  isHot: false, isFeatured: false, isActive: true, tags: '',
};

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        const p = data.product;
        setForm({
          name: p.name || '',
          description: p.description || '',
          price: p.price || '',
          originalPrice: p.originalPrice || '',
          category: p.category || 'Dresses',
          image: p.image || '',
          stock: p.stock || '',
          sizes: p.sizes || ['XS', 'S', 'M', 'L', 'XL'],
          isHot: p.isHot || false,
          isFeatured: p.isFeatured || false,
          isActive: p.isActive !== undefined ? p.isActive : true,
          tags: (p.tags || []).join(', '),
        });
      } catch (err) {
        setError('Failed to load product data.');
      } finally {
        setFetching(false);
      }
    };
    fetchProduct();
  }, [id, isEdit]);

  const toggleSize = (size) => {
    setForm(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      ...form,
      price: parseFloat(form.price),
      originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
      stock: parseInt(form.stock),
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    };

    try {
      if (isEdit) {
        await api.put(`/products/${id}`, payload);
      } else {
        await api.post('/products', payload);
      }
      navigate('/admin/products');
    } catch (err) {
      const msg = err.response?.data?.error ||
                  err.response?.data?.errors?.[0]?.msg ||
                  'Failed to save product.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="admin-loading"><div className="spinner" /> Loading product...</div>;

  return (
    <>
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => navigate('/admin/products')}>
            <ArrowLeft size={15} />
          </button>
          <div>
            <h2 className="admin-page-title">
              <Package size={20} style={{ display: 'inline', marginRight: 8, color: 'var(--admin-accent)' }} />
              {isEdit ? 'Edit Product' : 'New Product'}
            </h2>
            <p className="admin-page-subtitle">{isEdit ? 'Update product details and pricing' : 'Add a new product to your store'}</p>
          </div>
        </div>
      </div>

      {error && <div className="admin-alert admin-alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
          {/* Main Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="admin-card">
              <div className="section-title-sm" style={{ marginBottom: 20 }}>Basic Information</div>
              <div className="admin-form-grid">
                <div className="admin-form-group full">
                  <label className="admin-label">Product Name *</label>
                  <input className="admin-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Sapphire Evening Gown" required />
                </div>
                <div className="admin-form-group full">
                  <label className="admin-label">Description</label>
                  <textarea className="admin-textarea" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Describe the product..." />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Category *</label>
                  <select className="admin-select" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} required>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Tags (comma-separated)</label>
                  <input className="admin-input" value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} placeholder="silk, festive, trending" />
                </div>
              </div>
            </div>

            <div className="admin-card">
              <div className="section-title-sm" style={{ marginBottom: 20 }}>Pricing & Stock</div>
              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label className="admin-label">Price (USD) *</label>
                  <input className="admin-input" type="number" min="0" step="0.01" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} placeholder="299.00" required />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Original Price (for discount)</label>
                  <input className="admin-input" type="number" min="0" step="0.01" value={form.originalPrice} onChange={e => setForm(p => ({ ...p, originalPrice: e.target.value }))} placeholder="350.00" />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Stock Quantity *</label>
                  <input className="admin-input" type="number" min="0" value={form.stock} onChange={e => setForm(p => ({ ...p, stock: e.target.value }))} placeholder="25" required />
                </div>
              </div>
            </div>

            <div className="admin-card">
              <div className="section-title-sm" style={{ marginBottom: 20 }}>Available Sizes</div>
              <div className="admin-checkbox-group">
                {SIZES.map(size => (
                  <label key={size} className="admin-checkbox-label">
                    <input
                      type="checkbox"
                      checked={form.sizes.includes(size)}
                      onChange={() => toggleSize(size)}
                    />
                    {size}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="admin-card">
              <div className="section-title-sm" style={{ marginBottom: 20 }}>Product Image</div>
              <div className="admin-form-group">
                <label className="admin-label">Image URL *</label>
                <input className="admin-input" value={form.image} onChange={e => setForm(p => ({ ...p, image: e.target.value }))} placeholder="https://..." required />
              </div>
              {form.image && (
                <img
                  src={form.image}
                  alt="Preview"
                  style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 10, marginTop: 12, border: '1px solid var(--admin-border)' }}
                  onError={e => { e.target.style.display = 'none'; }}
                />
              )}
            </div>

            <div className="admin-card">
              <div className="section-title-sm" style={{ marginBottom: 20 }}>Visibility</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { key: 'isActive', label: 'Active (visible in store)' },
                  { key: 'isFeatured', label: 'Featured on homepage' },
                  { key: 'isHot', label: 'Mark as Hot / Trending' },
                ].map(({ key, label }) => (
                  <label key={key} className="admin-checkbox-label">
                    <input
                      type="checkbox"
                      checked={form[key]}
                      onChange={e => setForm(p => ({ ...p, [key]: e.target.checked }))}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} className="admin-btn admin-btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Saving...</> : <><Save size={16} /> {isEdit ? 'Update Product' : 'Create Product'}</>}
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default AdminProductForm;
