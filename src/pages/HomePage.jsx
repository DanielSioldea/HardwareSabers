import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="home-hero">
        <img src="/saber-ico.svg" alt="" className="home-logo" />

        <div className="home-heading-group">
          <h1 className="home-title">Hardware Sabers</h1>
          <p className="home-tagline">
            Build your custom lightsaber hilt from real hardware — bolts, washers,
            collars, and more — in a live 3D preview.
          </p>
        </div>

        <div className="home-actions">
          <button className="btn-primary home-cta-primary" onClick={() => navigate('/builder')}>
            Start Building
          </button>
          <button className="btn-secondary home-cta-secondary" onClick={() => navigate('/checkout')}>
            View Build Summary
          </button>
        </div>

        <ul className="home-features">
          <li>Browse through a list of components that you would find at your local hardware store</li>
          <li>Stack parts together to build your custom lightsaber hilt</li>
          <li>Review your parts list and export a PDF breakdown of your build</li>
          <li>Take it to your hardware store become one with the Force</li>
        </ul>
      </div>
    </div>
  );
}
