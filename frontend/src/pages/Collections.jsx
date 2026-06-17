import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Collections.css';
import { ArrowRight } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

const Collections = () => {
  const navigate = useNavigate();
  return (
    <div className="page-collections-new">
      <Header />
      
      <main className="collections-main">
        <section className="split-showcase">
          <div className="split-image">
            <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800" alt="Resort Wear" />
          </div>
          <div className="split-text">
            <h2>Resort Wear '24</h2>
            <p>Embrace the sun with our luxurious new resort wear collection. Flowing silks, vibrant prints, and effortless elegance for your next getaway.</p>
            <button className="glass-panel btn-outline">Explore Resort Wear <ArrowRight size={18} /></button>
          </div>
        </section>

        <section className="split-showcase reverse">
          <div className="split-image">
            <img src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=800" alt="Midnight Glamour" />
          </div>
          <div className="split-text">
            <h2>Midnight Glamour</h2>
            <p>Own the night. Discover stunning evening gowns and sequined separates designed to make an unforgettable entrance.</p>
            <button className="glass-panel btn-outline">Shop Evening Wear <ArrowRight size={18} /></button>
          </div>
        </section>

        <section className="split-showcase">
          <div className="split-image">
            <img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800" alt="Premium Accessories" />
          </div>
          <div className="split-text">
            <h2>The Finishing Touch</h2>
            <p>Elevate your ensemble with our meticulously crafted collection of fine jewelry, silk scarves, and premium leather accessories.</p>
            <button className="glass-panel btn-outline" onClick={() => navigate('/collections/accessories')}>Shop Accessories <ArrowRight size={18} /></button>
          </div>
        </section>

        <section className="collection-carousel-section">
          <div className="container">
            <h2 className="section-title">The Curator's Edit</h2>
            <div className="carousel-wrapper">
              <div className="carousel-track">
                {[
                  { title: "Minimalist Essentials", img: "https://images.unsplash.com/photo-1434389670869-c4ee14c7c59e?auto=format&fit=crop&q=80&w=400" },
                  { title: "Boho Chic", img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=400" },
                  { title: "Power Suits", img: "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?auto=format&fit=crop&q=80&w=400" },
                  { title: "Vintage Inspired", img: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&q=80&w=400" }
                ].map((item, i) => (
                  <div key={i} className="carousel-card">
                    <img src={item.img} alt={item.title} />
                    <div className="glass-panel carousel-info">
                      <h3>{item.title}</h3>
                      <button onClick={() => navigate('/collections')}>Shop Collection</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Collections;
