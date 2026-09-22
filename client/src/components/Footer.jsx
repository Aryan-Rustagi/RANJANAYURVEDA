import React from 'react';
import { Phone, MapPin, Sparkles, Shield } from 'lucide-react';

export default function Footer({ setActiveTab }) {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        {/* Column 1: Brand Info */}
        <div className="footer-brand">
          <div className="brand-logo" onClick={() => setActiveTab('home')}>
            <div className="logo-icon-wrap" style={{ width: '40px', height: '40px', fontSize: '1.2rem', borderRadius: '8px' }}>
              R
            </div>
            <div className="brand-text-container">
              <div className="brand-title" style={{ fontSize: '1.05rem', color: '#fff' }}>
                RANJAN'S <span>AYURVEDA</span>
              </div>
              <div className="brand-subtitle" style={{ color: '#c4b8aa' }}>
                CENTRE • ESTD 2005
              </div>
            </div>
          </div>
          <p>
            Authentic Ayurvedic care, Panchakarma, and non-invasive remedies for Arthritis, Slip Disc, Sciatica, and chronic pain disorders. Healing naturally, restoring life.
          </p>
        </div>

        {/* Column 2: Navigation Links */}
        <div className="footer-col">
          <h4>QUICK NAVIGATION</h4>
          <ul className="footer-links">
            <li><button onClick={() => setActiveTab('home')}>Home Overview</button></li>
            <li><button onClick={() => setActiveTab('about')}>About Us & Specializations</button></li>
            <li><button onClick={() => setActiveTab('login')}>Patient Portal Login</button></li>
            <li><button onClick={() => setActiveTab('signup')}>Register New Patient</button></li>
          </ul>
        </div>

        {/* Column 3: Contact & Branches */}
        <div className="footer-col">
          <h4>CENTRE LOCATIONS</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: '#c4b8aa' }}>
            <div>
              <strong style={{ color: '#fff' }}>Kangra Branch:</strong><br />
              Opp. Hotel Krishna Intl, Birta Road, Kangra (H.P.)
            </div>
            <div>
              <strong style={{ color: '#fff' }}>Dharamshala Branch:</strong><br />
              Kotwali Bazaar, Khanyara Road, Dharamshala (H.P.)
            </div>
            <div style={{ marginTop: '4px' }}>
              <a href="tel:9015472705" style={{ color: 'var(--color-gold-light)', fontWeight: '600', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={14} /> Appointment: 90154 72705
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © 2005 - {new Date().getFullYear()} Ranjan's Ayurveda Centre. All Rights Reserved. | Dedicated to Natural Wellness in Himachal Pradesh.
      </div>
    </footer>
  );
}
