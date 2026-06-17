import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Story.css';
import { Award, Scissors, Users } from 'lucide-react';

const Story = () => {
  return (
    <div className="page-story-new">
      <Header />
      <div className="story-hero">
        <div className="container">
          <h1 className="glass-panel text-center">Our Heritage</h1>
        </div>
      </div>

      <main>
        <section className="timeline-section container">
          <h2 className="section-title">The Journey</h2>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content glass-panel">
                <h3>2015 - The Beginning</h3>
                <p>Aura Boutique started as a small atelier in Soho, crafting bespoke dresses for local clients.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content glass-panel">
                <h3>2018 - Expanding Horizons</h3>
                <p>We launched our first ready-to-wear collection, merging haute couture techniques with everyday elegance.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content glass-panel">
                <h3>2022 - Global Reach</h3>
                <p>Opened our flagship stores in Paris and Milan, bringing our unique vision to the global stage.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="core-values">
          <div className="container">
            <div className="values-grid">
              <div className="value-card glass-panel">
                <Scissors size={40} className="value-icon" />
                <h3>Craftsmanship</h3>
                <p>Every piece is ethically crafted by master artisans using premium sustainable fabrics.</p>
              </div>
              <div className="value-card glass-panel">
                <Award size={40} className="value-icon" />
                <h3>Excellence</h3>
                <p>We obsess over the details, from the perfect seam to the finest silk linings.</p>
              </div>
              <div className="value-card glass-panel">
                <Users size={40} className="value-icon" />
                <h3>Community</h3>
                <p>Empowering women through fashion, building confidence, and celebrating diversity.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="team-section container">
          <h2 className="section-title">Meet The Creatives</h2>
          <div className="team-grid">
            {[
              { name: "Elena Rossi", role: "Creative Director", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400" },
              { name: "Sarah Chen", role: "Head of Design", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400" },
              { name: "Marcus Thorne", role: "Master Tailor", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" }
            ].map((member, i) => (
              <div key={i} className="team-card">
                <img src={member.img} alt={member.name} />
                <div className="glass-panel team-info">
                  <h3>{member.name}</h3>
                  <p>{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Story;
