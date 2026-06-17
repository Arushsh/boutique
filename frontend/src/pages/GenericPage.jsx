import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const GenericPage = ({ title }) => {
  return (
    <div className="generic-page">
      <div className="hero-wrapper" style={{ paddingBottom: '20px', borderBottomLeftRadius: '30px', borderBottomRightRadius: '30px' }}>
        <Header />
      </div>
      <main className="container" style={{ minHeight: '50vh', padding: '80px 20px', textAlign: 'center' }}>
        <h1 className="section-title">{title}</h1>
        <div className="section-divider">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
        <p style={{ marginTop: '40px', fontSize: '18px', color: 'var(--color-gray)' }}>
          This is a placeholder page for {title}. Content will be added soon.
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default GenericPage;
