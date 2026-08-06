import React from 'react';
import { Award, Leaf, Stethoscope, HeartPulse, MapPin, Phone, CheckCircle, Sparkles, ShieldCheck } from 'lucide-react';

export default function About({ setActiveTab }) {
  const pillars = [
    {
      icon: <Award size={24} />,
      title: "AUTHENTIC AYURVEDIC CARE",
      desc: "Rooted in centuries-old classical Ayurvedic scripture and personalized diagnostic practices."
    },
    {
      icon: <Leaf size={24} />,
      title: "NATURAL & SAFE THERAPIES",
      desc: "100% natural herbal formulations and classical Panchakarma detox techniques with zero side effects."
    },
    {
      icon: <Stethoscope size={24} />,
      title: "EXPERT AYURVEDIC DOCTORS",
      desc: "Highly experienced Vaidyas and doctors specializing in chronic pain and neurological disorders."
    },
    {
      icon: <HeartPulse size={24} />,
      title: "HOLISTIC WELLNESS",
      desc: "Comprehensive restoration of mind, body, and spirit tailored to individual Prakriti."
    }
  ];

  const treatments = [
    { title: "Arthritis", hindi: "घुटनों का दर्द", desc: "Targeted joint lubrication & herbal anti-inflammatory care." },
    { title: "Slip Disc", hindi: "कमर दर्द", desc: "Spinal alignment therapies & Kati Vasti spinal pain relief." },
    { title: "Cervical Spondylosis", hindi: "गर्दन दर्द", desc: "Greeva Vasti & targeted neck stiffness relief." },
    { title: "Sciatica", hindi: "साइटिका", desc: "Nerve compression relief & classical Marma therapy." },
    { title: "Paralysis", hindi: "लकवा", desc: "Neurological rehabilitation & specialized Snehan & Swedan." },
    { title: "Migraine", hindi: "माइग्रेन", desc: "Nasya karma & head steam for chronic headache elimination." }
  ];

  return (
    <div className="animate-fade-in">
      {/* About Banner */}
      <div className="poster-hero-card about-hero">
        <div className="poster-badge-row">
          <span className="badge-gold"><Sparkles size={13} /> Established 2005</span>
          <span className="badge-gold">Himachal Pradesh</span>
        </div>
        <h1 className="hero-title">
          ABOUT <span>RANJAN'S AYURVEDA CENTRE</span>
        </h1>
        <p className="hero-tagline">
          “HEALING NATURALLY, RESTORING LIFE”
        </p>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.98rem', maxWidth: '780px', marginBottom: '20px' }}>
          Established in 2005, Ranjan's Ayurveda Centre has been a beacon of hope and authentic healing in Himachal Pradesh. For over two decades, our dedicated team of expert Vaidyas has provided non-invasive, herbal, and holistic treatments for joint pains, spinal disorders, and chronic nerve conditions.
        </p>
        <div className="hero-cta-row">
          <button className="btn-gold" onClick={() => setActiveTab('signup')}>
            <ShieldCheck size={16} /> Book Appointment
          </button>
          <a href="tel:9015472705" className="btn-maroon-outline">
            <Phone size={16} /> Call 90154 72705
          </a>
        </div>
      </div>

      {/* 4 Pillars Section */}
      <div className="section-header">
        <h2 className="section-title">OUR <span>CORE PILLARS</span></h2>
        <p className="section-subtitle">
          Guaranteed commitment to purity, traditional authenticity, and medical excellence.
        </p>
      </div>

      <div className="pillars-grid" style={{ marginBottom: '40px' }}>
        {pillars.map((item, idx) => (
          <div key={idx} className="glass-card pillar-card">
            <div className="pillar-icon">
              {item.icon}
            </div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Treatments Section */}
      <div className="section-header">
        <h2 className="section-title">EXPERT CARE <span>& SPECIALIZATIONS</span></h2>
        <p className="section-subtitle">
          Classical remedies customized for chronic pain and lifestyle ailments.
        </p>
      </div>

      <div className="treatment-highlights-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '40px' }}>
        {treatments.map((t, idx) => (
          <div key={idx} className="glass-card highlight-item" style={{ padding: '16px' }}>
            <div className="highlight-icon">
              <CheckCircle size={18} />
            </div>
            <div className="highlight-text">
              <h4 style={{ fontSize: '1rem', color: 'var(--color-text-main)' }}>
                {t.title} <span style={{ color: 'var(--color-maroon-primary)', fontSize: '0.88rem' }}>({t.hindi})</span>
              </h4>
              <p style={{ marginTop: '2px' }}>{t.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Traditional Therapies Banner */}
      <div className="glass-card" style={{ padding: '28px', textAlign: 'center', marginBottom: '40px' }}>
        <h3 style={{ fontSize: '1.3rem', color: 'var(--color-maroon-primary)', marginBottom: '8px' }}>
          SPECIALIZED AYURVEDIC THERAPIES
        </h3>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>
          Performed under strict clinical supervision using medicated oils and traditional herbal steam.
        </p>
        <div className="therapies-pill-container" style={{ gap: '10px' }}>
          <span className="therapy-pill" style={{ fontSize: '0.85rem', padding: '8px 16px' }}>🌿 PANCHAKARMA</span>
          <span className="therapy-pill" style={{ fontSize: '0.85rem', padding: '8px 16px' }}>⚡ MARMA THERAPY</span>
          <span className="therapy-pill" style={{ fontSize: '0.85rem', padding: '8px 16px' }}>🔥 AGNIKARMA</span>
          <span className="therapy-pill" style={{ fontSize: '0.85rem', padding: '8px 16px' }}>📍 VIDDHAKARMA</span>
        </div>
      </div>

      {/* Branch Information */}
      <div className="section-header">
        <h2 className="section-title">TWO BRANCHES <span>• SAME TRUST, SAME CARE</span></h2>
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
              <Phone size={14} /> Call: 90154 72705
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
              <Phone size={14} /> Call: 90154 72705
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
