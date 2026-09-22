import React from 'react';
import { Phone, MapPin, Sparkles, ShieldCheck, Stethoscope, Leaf, CheckCircle2, ArrowRight } from 'lucide-react';

export default function Home({ setActiveTab }) {
  const treatmentsPair = [
    { hindi: "घुटनों का दर्द", english: "Arthritis" },
    { hindi: "कमर दर्द", english: "Slip Disc" },
    { hindi: "गर्दन दर्द", english: "Cervical Spondylosis" },
    { hindi: "साइटिका", english: "Sciatica" },
    { hindi: "लकवा", english: "Paralysis" },
    { hindi: "माइग्रेन", english: "Migraine" }
  ];

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      {/* Hero Showcase Card */}
      <div className="poster-hero-card">
        <div className="hero-grid">
          {/* Left Column */}
          <div>
            <div className="poster-badge-row">
              <span className="badge-gold"><Sparkles size={13} /> ESTD 2005</span>
              <span className="badge-gold">AUTHENTIC AYURVEDA</span>
            </div>
            <h1 className="hero-title">
              RANJAN'S <span>AYURVEDA CENTRE</span>
            </h1>
            <div className="hero-tagline">
              HEALING NATURALLY, RESTORING LIFE
            </div>

            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.98rem', marginBottom: '24px' }}>
              Specialized herbal treatments and non-surgical pain management for joint, spine, and nerve disorders in Himachal Pradesh.
            </p>

            <div className="hero-cta-row">
              <button className="btn-gold" onClick={() => setActiveTab('dashboard')}>
                <ShieldCheck size={18} /> Book Appointment
              </button>
              <a href="tel:9015472705" className="btn-maroon-outline">
                <Phone size={18} /> Call 90154 72705
              </a>
            </div>
          </div>

          {/* Right Column Visual Branding Card */}
          <div className="poster-visual-box">
            <div className="poster-logo-large">R</div>
            <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-maroon-primary)', fontSize: '1.25rem' }}>
              RANJAN'S AYURVEDA
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', letterSpacing: '1.5px', textTransform: 'uppercase', margin: '4px 0 14px 0' }}>
              CENTRE • ESTD 2005
            </p>

            <div style={{ width: '100%', height: '1px', background: '#eae3d9', margin: '10px 0' }}></div>

            <p style={{ color: 'var(--color-text-main)', fontSize: '0.85rem', fontWeight: '600' }}>
              PANCHAKARMA • MARMA THERAPY • AGNIKARMA • VIDDHAKARMA
            </p>

            <div className="therapies-pill-container">
              <span className="therapy-pill">AUTHENTIC CARE</span>
              <span className="therapy-pill">SAFE THERAPIES</span>
              <span className="therapy-pill">EXPERT DOCTORS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specialized Treatments Section */}
      <div className="section-header">
        <h2 className="section-title">SPECIALIZED <span>TREATMENTS</span></h2>
        <p className="section-subtitle">
          Proven Ayurvedic remedies for spinal pain, joint inflammation, and nerve disorders.
        </p>
      </div>

      <div className="glass-card treatment-card-wrapper" style={{ padding: '28px', marginBottom: '40px' }}>
        <div className="treatment-grid-container">
          {/* Hindi Column */}
          <div className="treatment-col">
            <h3 style={{ color: 'var(--color-maroon-primary)', fontFamily: 'var(--font-serif)', fontSize: '1.15rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Leaf size={18} color="var(--color-gold-accent)" /> आयुर्वेदिक उपचार
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {treatmentsPair.map((item, index) => (
                <div key={index} className="highlight-item">
                  <div className="highlight-icon">
                    <CheckCircle2 size={16} />
                  </div>
                  <div className="highlight-text">
                    <h4>{item.hindi}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* English Column */}
          <div className="treatment-col">
            <h3 style={{ color: 'var(--color-maroon-primary)', fontFamily: 'var(--font-serif)', fontSize: '1.15rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Stethoscope size={18} color="var(--color-gold-accent)" /> EXPERT CARE FOR
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {treatmentsPair.map((item, index) => (
                <div key={index} className="highlight-item">
                  <div className="highlight-icon">
                    <CheckCircle2 size={16} />
                  </div>
                  <div className="highlight-text">
                    <h4>{item.english}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Need An Appointment Call Banner */}
      <div className="glass-card" style={{ padding: '24px', textAlign: 'center', background: '#faf7f2', marginBottom: '40px', border: '1px solid #eae3d9' }}>
        <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-maroon-primary)', fontSize: '1.3rem', marginBottom: '6px' }}>
          NEED AN APPOINTMENT?
        </h3>
        <p style={{ fontSize: '1rem', marginBottom: '16px', fontWeight: '600' }}>
          <a href="tel:9015472705" style={{ color: 'var(--color-maroon-primary)', textDecoration: 'underline' }}>
            📞 90154 72705 — CALL FOR APPOINTMENT
          </a>
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <a href="tel:9015472705" className="btn-gold" style={{ textDecoration: 'none' }}>
            <Phone size={16} /> Call Now
          </a>
          <button className="btn-maroon-outline" onClick={() => setActiveTab('about')}>
            Learn More About Us <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Centre Branches Section */}
      <div className="section-header">
        <h2 className="section-title">OUR <span>CENTRE BRANCHES</span></h2>
        <p className="section-subtitle">
          TWO BRANCHES • SAME TRUST • SAME CARE
        </p>
      </div>

      <div className="branches-grid">
        <div className="glass-card branch-card">
          <div className="branch-icon">
            <MapPin size={22} />
          </div>
          <div className="branch-details">
            <h3>BRANCH 1 - KANGRA</h3>
            <p>Opp. Hotel Krishna International, Birta Road, Kangra (H.P.)</p>
            <a href="tel:9015472705" className="branch-phone">
              <Phone size={14} /> 90154 72705
            </a>
          </div>
        </div>

        <div className="glass-card branch-card">
          <div className="branch-icon">
            <MapPin size={22} />
          </div>
          <div className="branch-details">
            <h3>BRANCH 2 - DHARAMSHALA</h3>
            <p>Kotwali Bazaar, Khanyara Road, Near Govt. High School, Dharamshala (H.P.)</p>
            <a href="tel:9015472705" className="branch-phone">
              <Phone size={14} /> 90154 72705
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
