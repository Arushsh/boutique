import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Package } from 'lucide-react';
import api from '../../api/axios';

const CATEGORIES = ['All', 'Dresses', 'Sets', 'Tops', 'Traditional', 'Outerwear', 'Bottoms', 'Accessories'];

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (category !== 'All') params.set('category', category);
      if (search) params.set('search', search);
      // For admin, show all products including inactive
      const { data } = await api.get(`/products?${params}`);
      setProducts(data.products || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch (err) {
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [page, category]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await api.delete(`/products/${id}`);
      setSuccess(`"${name}" deleted successfully.`);
      fetchProducts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete product.');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Products</h2>
          <p className="admin-page-subtitle">{total} total products</p>
        </div>
        <Link to="/admin/products/new" className="admin-btn admin-btn-primary">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {error && <div className="admin-alert admin-alert-error"><span>{error}</span></div>}
      {success && <div className="admin-alert admin-alert-success"><span>{success}</span></div>}

      <div className="admin-toolbar">
        <form onSubmit={handleSearch} className="admin-search">
          <Search size={16} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
          />
        </form>
        <select
          className="admin-filter-select"
          value={category}
          onChange={e => { setCategory(e.target.value); setPage(1); }}
        >
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7}><div className="admin-loading"><div className="spinner" /> Loading...</div></td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={7}>
                <div className="admin-empty">
                  <Package size={40} />
                  <h3>No products found</h3>
                  <p>Try a different search or category filter.</p>
                </div>
              </td></tr>
            ) : products.map(p => (
              <tr key={p._id}>
                <td>
                  <img src={p.image} alt={p.name} className="product-thumb" />
                </td>
                <td>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{p.name}</div>
                  {p.isHot && <span className="badge badge-red" style={{ marginTop: 4 }}>Hot</span>}
                  {p.isFeatured && <span className="badge badge-gold" style={{ marginTop: 4, marginLeft: 4 }}>Featured</span>}
                </td>
                <td>
                  <span className="badge badge-blue">{p.category}</span>
                </td>
                <td>
                  <div style={{ fontWeight: 700 }}>${p.price.toFixed(2)}</div>
                  {p.originalPrice && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', textDecoration: 'line-through' }}>
                      ${p.originalPrice.toFixed(2)}
                    </div>
                  )}
                </td>
                <td>
                  <span className={`badge ${p.stock > 10 ? 'badge-green' : p.stock > 0 ? 'badge-yellow' : 'badge-red'}`}>
                    {p.stock} units
                  </span>
                </td>
                <td>
                  <span className={`badge ${p.isActive ? 'badge-green' : 'badge-red'}`}>
                    {p.isActive ? 'Active' : 'Deleted'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Link to={`/admin/products/${p._id}/edit`} className="admin-btn admin-btn-ghost admin-btn-sm">
                      <Edit2 size={13} /> Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p._id, p.name)}
                      disabled={deleting === p._id}
                      className="admin-btn admin-btn-danger admin-btn-sm"
                    >
                      <Trash2 size={13} />
                      {deleting === p._id ? '...' : 'Del'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
          <button
            className="admin-btn admin-btn-ghost admin-btn-sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            ← Prev
          </button>
          <span style={{ padding: '5px 14px', color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>
            Page {page} of {pages}
          </span>
          <button
            className="admin-btn admin-btn-ghost admin-btn-sm"
            onClick={() => setPage(p => Math.min(pages, p + 1))}
            disabled={page === pages}
          >
            Next →
          </button>
        </div>
      )}
    </>
  );
};

export default AdminProducts;
