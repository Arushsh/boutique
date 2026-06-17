import React from 'react';
import './Testimonials.css';

const testimonials = [
  {
    id: 1,
    name: 'SONIYA DEVIL',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    review: 'The quality of the fabric is exceptional. I ordered the designer floral dress and the fit was absolutely perfect. The boutique experience is truly premium.'
  },
  {
    id: 2,
    name: 'CANDY MILLER',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    review: 'I had an amazing styling session. They helped me find the perfect festive wear for my upcoming event. Customer service is top-notch and highly recommended.'
  },
  {
    id: 3,
    name: 'DR. BRITT BRAKER',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    review: 'Beautiful collection of luxury evening wear! I bought a silk saree and the craftsmanship is stunning. Will definitely be returning for more outfits.'
  }
];

const Testimonials = () => {
  return (
    <section className="testimonials container">
      <div className="section-header">
        <h2 className="section-title">What Our Boutique Clients Say</h2>
        <div className="section-divider">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>

      <div className="testimonials-grid">
        {testimonials.map((item, index) => (
          <div key={item.id} className="testimonial-card">
            <div className="testimonial-content">
              <div className="testimonial-image-col">
                <img src={item.image} alt={item.name} />
                <p className="reviewer-name">{item.name}</p>
              </div>
              <div className="testimonial-text-col">
                <p className="review-label">RECENT REVIEW</p>
                <div className="review-text-wrapper">
                  <span className="bullet">•</span>
                  <p className="review-text">{item.review}</p>
                </div>
              </div>
            </div>
            {/* The little dot indicator at bottom of center card in screenshot */}
            {index === 1 && (
              <div className="card-indicator">
                <span className="dot active"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
