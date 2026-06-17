import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './NewArrivals.css';
import { Filter, ChevronDown, Heart, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../api/axios';

const ITEMS_PER_PAGE = 9;

const NewArrivals = () => {
  const [searchParams] = useSearchParams();
  const urlCategory = searchParams.get('category');
  const [activeCategory, setActiveCategory] = useState(urlCategory || 'All');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { addToCart, addToWishlist } = useCart();
  
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ limit: ITEMS_PER_PAGE, page: currentPage });
        if (activeCategory !== 'All') params.set('category', activeCategory);
        const { data } = await api.get(`/products?${params}`);
        setProducts(data.products || []);
        setTotalPages(data.pages || 1);
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [activeCategory, currentPage]);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  return (
    <div className="page-new-arrivals">
      <Header />
      <div className="glass-hero">
        <div className="glass-hero-content container">
          <div className="glass-panel hero-glass-box">
            <h1>The Summer Edit</h1>
            <p>Discover our meticulously crafted collection of light, airy, and stunningly elegant pieces designed for the modern woman's summer wardrobe.</p>
            <button className="btn-primary" onClick={() => document.querySelector('.product-grid-section')?.scrollIntoView({ behavior: 'smooth' })}>Explore Now</button>
          </div>
        </div>
      </div>

      <main className="container arrivals-main">
        <div className="shop-layout">
          <aside className="sidebar">
            <div className="filter-section">
              <h3><Filter size={18} /> Filters</h3>
              
              <div className="filter-group">
                <h4>Categories <ChevronDown size={16} /></h4>
                <ul className="filter-list">
                  {['All', 'Dresses', 'Sets', 'Tops', 'Traditional', 'Outerwear', 'Bottoms'].map(cat => (
                    <li 
                      key={cat} 
                      className={activeCategory === cat ? 'active' : ''}
                      onClick={() => handleCategoryChange(cat)}
                    >
                      {cat}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="filter-group">
                <h4>Price Range <ChevronDown size={16} /></h4>
                <div className="price-slider">
                  <input type="range" min="0" max="1000" defaultValue="500" />
                  <div className="price-labels">
                    <span>$0</span>
                    <span>$1000+</span>
                  </div>
                </div>
              </div>

              <div className="filter-group">
                <h4>Size <ChevronDown size={16} /></h4>
                <div className="size-grid">
                  {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                    <button key={size} className="size-btn">{size}</button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <section className="product-grid-section">
            <div className="grid-header">
              <p>{loading ? 'Loading...' : `Page ${currentPage} of ${totalPages}`}</p>
              <select className="sort-select">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
              </select>
            </div>

            {loading ? (
              <div className="loading-grid">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="arrival-card skeleton-card">
                    <div className="arrival-img-container skeleton-img"></div>
                    <div className="arrival-info">
                      <div className="skeleton-text"></div>
                      <div className="skeleton-text long"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="empty-category-msg">
                <p>No products found in this category.</p>
                <button className="btn-primary" onClick={() => handleCategoryChange('All')}>View All Products</button>
              </div>
            ) : (
              <div className="arrivals-grid">
                {products.map(product => (
                  <div key={product._id} className="arrival-card">
                    <div className="arrival-img-container">
                      <img src={product.image} alt={product.name} />
                      <div className="glass-panel arrival-actions">
                        <button onClick={() => addToWishlist({ id: product._id, ...product })} className="icon-btn" title="Add to Wishlist"><Heart size={18} /></button>
                        <button onClick={() => addToCart({ id: product._id, ...product })} className="icon-btn" title="Add to Cart"><ShoppingBag size={18} /></button>
                      </div>
                    </div>
                    <div className="arrival-info">
                      <p className="arrival-category">{product.category}</p>
                      <h3 className="arrival-name">{product.name}</h3>
                      <p className="arrival-price">${product.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="pagination">
                <button 
                  className="page-btn" 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={18} />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button 
                    key={i + 1} 
                    className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`} 
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button 
                  className="page-btn" 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NewArrivals;
