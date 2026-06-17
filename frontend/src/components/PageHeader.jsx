import React from 'react';
import Header from './Header';
import './PageHeader.css';

const PageHeader = ({ title, subtitle }) => {
  return (
    <div className="page-hero-wrapper">
      <Header />
      <div className="page-hero-content">
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
};

export default PageHeader;
