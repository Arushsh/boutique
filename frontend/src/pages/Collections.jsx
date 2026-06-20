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
            <img src="/WhatsApp%20Image%202026-06-20%20at%206.29.42%20PM%20(2).jpeg" alt="Resort Wear" />
          </div>
          <div className="split-text">
            <h2>Resort Wear '24</h2>
            <p>Embrace the sun with our luxurious new resort wear collection. Flowing silks, vibrant prints, and effortless elegance for your next getaway.</p>
            <button className="glass-panel btn-outline">Explore Resort Wear <ArrowRight size={18} /></button>
          </div>
        </section>

        <section className="split-showcase reverse">
          <div className="split-image">
            <img src="/WhatsApp%20Image%202026-06-20%20at%206.29.42%20PM.jpeg" alt="Midnight Glamour" />
          </div>
          <div className="split-text">
            <h2>Midnight Glamour</h2>
            <p>Own the night. Discover stunning evening gowns and sequined separates designed to make an unforgettable entrance.</p>
            <button className="glass-panel btn-outline">Shop Evening Wear <ArrowRight size={18} /></button>
          </div>
        </section>

        <section className="split-showcase">
          <div className="split-image">
            <img src="/WhatsApp%20Image%202026-06-20%20at%206.29.43%20PM%20(1).jpeg" alt="Premium Accessories" />
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
                  { title: "Minimalist Essentials", img: "/WhatsApp%20Image%202026-06-20%20at%206.29.43%20PM%20(2).jpeg" },
                  { title: "Boho Chic", img: "/WhatsApp%20Image%202026-06-20%20at%206.29.43%20PM.jpeg" },
                  { title: "Power Suits", img: "/WhatsApp%20Image%202026-06-20%20at%206.29.44%20PM%20(1).jpeg" },
                  { title: "Vintage Inspired", img: "/WhatsApp%20Image%202026-06-20%20at%206.29.44%20PM%20(2).jpeg" }
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
