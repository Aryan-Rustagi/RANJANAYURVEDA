import React, { useState } from 'react';
import { Phone, Info, Home as HomeIcon, LogIn, UserPlus, Menu, X, LayoutDashboard, LogOut } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, user, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab) => {
    if (tab === 'dashboard' && !user) {
      setActiveTab('login');
    } else {
      setActiveTab(tab);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="app-header">
      <div className="header-container">
        {/* Brand Logo & Name */}
        <div className="brand-logo" onClick={() => handleNavClick('home')}>
          <div className="logo-icon-wrap">
            R
          </div>
          <div className="brand-text-container">
            <div className="brand-title">
              RANJAN'S <span>AYURVEDA</span>
            </div>
            <div className="brand-subtitle">
              CENTRE • ESTD 2005
            </div>
          </div>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop & Mobile Navigation Links */}
        <nav className={`header-nav ${mobileMenuOpen ? 'nav-open' : ''}`}>
          <ul className="nav-links">
            <li>
              <button 
                className={`nav-item-btn ${activeTab === 'home' ? 'active' : ''}`}
                onClick={() => handleNavClick('home')}
              >
                <HomeIcon size={16} /> Home
              </button>
            </li>
            <li>
              <button 
                className={`nav-item-btn ${activeTab === 'about' ? 'active' : ''}`}
                onClick={() => handleNavClick('about')}
              >
                <Info size={16} /> About Us
              </button>
            </li>
            <li>
              <button 
                className={`nav-item-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => handleNavClick('dashboard')}
              >
                <LayoutDashboard size={16} /> Dashboard
              </button>
            </li>

            {!user ? (
              <>
                <li>
                  <button 
                    className={`nav-item-btn ${activeTab === 'login' ? 'active' : ''}`}
                    onClick={() => handleNavClick('login')}
                  >
                    <LogIn size={16} /> Login
                  </button>
                </li>
                <li>
                  <button 
                    className={`nav-item-btn ${activeTab === 'signup' ? 'active' : ''}`}
                    onClick={() => handleNavClick('signup')}
                  >
                    <UserPlus size={16} /> Sign Up
                  </button>
                </li>
              </>
            ) : (
              <li>
                <button 
                  className="nav-item-btn"
                  onClick={onLogout}
                  style={{ color: '#c5221f' }}
                >
                  <LogOut size={16} /> Logout ({user.name.split(' ')[0]})
                </button>
              </li>
            )}
          </ul>

          {/* Mobile phone call button */}
          <div className="mobile-phone-wrap">
            <a href="tel:9015472705" className="nav-phone-link">
              <Phone size={15} />
              <span>Call: 90154 72705</span>
            </a>
          </div>
        </nav>

        {/* Desktop Phone Call Link */}
        <a href="tel:9015472705" className="nav-phone-link desktop-phone-link">
          <Phone size={15} />
          <span>90154 72705</span>
        </a>
      </div>
    </header>
  );
}
