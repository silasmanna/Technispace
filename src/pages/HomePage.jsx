import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck, Banknote, Users, ArrowRight,
  Building2, Star, CheckCircle, Zap,
} from 'lucide-react';
import { useProperty } from '../context/PropertyContext';
import PropertyCard from '../components/PropertyCard';

const FEATURES = [
  {
    icon: <ShieldCheck size={26} />,
    title: 'KYC-Verified Landlords',
    desc: 'Every landlord undergoes a thorough identity and document verification process before listing — no anonymous listings, ever.',
  },
  {
    icon: <Banknote size={26} />,
    title: 'Zero Middlemen',
    desc: 'Pay rent directly to your verified landlord. No middlemen, no agents, and no third-party cuts.',
  },
  {
    icon: <Users size={26} />,
    title: 'Zero Agent Fees',
    desc: 'Connect directly with property owners. No agency fees or extra middleman charges — just straightforward renting.',
  },
  {
    icon: <Zap size={26} />,
    title: 'Instant Inquiries',
    desc: 'Message landlords directly through our platform and get responses fast. Move-in ready listings, updated in real time.',
  },
  {
    icon: <Star size={26} />,
    title: 'Verified Reviews',
    desc: 'Read honest reviews from real past tenants. Build trust before you sign — and leave your own review after moving in.',
  },
  {
    icon: <CheckCircle size={26} />,
    title: 'Transparent Pricing',
    desc: 'See exactly what you pay in Naira (₦). No surprise charges. Monthly rent and deposit clearly displayed up front.',
  },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Landlord Signs Up & Completes KYC', desc: 'Landlords submit identity docs. We verify in 24–48 hrs.' },
  { step: '02', title: 'Property Gets Listed', desc: 'Verified landlords select a plan and list with photos, price, and utilities.' },
  { step: '03', title: 'Tenant Browses & Inquires', desc: 'Tenants register free and message landlords directly.' },
  { step: '04', title: 'Direct Agreement & Move-In', desc: 'Connect, inspect, and finalize agreements directly with your landlord.' },
];

export default function HomePage() {
  const { properties } = useProperty();
  const navigate = useNavigate();
  const featured = properties.slice(0, 3);

  return (
    <div>
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-grid" />
          <div className="hero-glow-1" />
          <div className="hero-glow-2" />
        </div>

        <div className="container">
          <div className="hero-content">
            <div>
              <div className="hero-badge">
                <span className="hero-badge-dot" />
                100% Agent-Free Rentals · All Fees Capped at 5%
              </div>

              <h1 className="hero-title">
                Rent Direct from{' '}
                <span className="text-gradient">Verified Landlords</span>
              </h1>

              <p className="hero-subtitle">
                Skip the agents. On Technispace, every landlord is KYC-verified and all fees are capped at 5%. Active mostly in Lagos for now, coming to other cities soon. Connect directly, inspect in person, and rent with total confidence.
              </p>

              <div className="hero-cta">
                <Link to="/listings" className="btn btn-primary btn-lg" id="hero-browse-btn">
                  Browse Properties
                  <ArrowRight size={18} />
                </Link>
                <Link to="/register?role=landlord" className="btn btn-ghost btn-lg" id="hero-landlord-btn">
                  List Your Property
                </Link>
              </div>

              <div className="hero-stats">
                <div>
                  <div className="hero-stat-value">2,400+</div>
                  <div className="hero-stat-label">Verified Listings</div>
                </div>
                <div>
                  <div className="hero-stat-value">98%</div>
                  <div className="hero-stat-label">Satisfaction Rate</div>
                </div>
                <div>
                  <div className="hero-stat-value">≤ 5%</div>
                  <div className="hero-stat-label">All Fees Capped</div>
                </div>
                <div>
                  <div className="hero-stat-value">100%</div>
                  <div className="hero-stat-label">Direct Rentals</div>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="floating-card">
                <div className="fc-icon purple">🏠</div>
                <div>
                  <div className="fc-label">New Listing</div>
                  <div className="fc-value">Modern 2BR – Lekki Phase 1</div>
                </div>
                <div className="fc-badge badge badge-verified">Verified</div>
              </div>

              <div className="floating-card">
                <div className="fc-icon teal">🛡️</div>
                <div>
                  <div className="fc-label">Fee Guarantee</div>
                  <div className="fc-value">All fees capped at 5%</div>
                </div>
                <div className="fc-badge badge badge-primary">Guaranteed</div>
              </div>

              <div className="floating-card">
                <div className="fc-icon amber">⭐</div>
                <div>
                  <div className="fc-label">Review from Chioma A.</div>
                  <div className="fc-value">"Direct landlord, fast & easy!"</div>
                </div>
                <div style={{ marginLeft: 'auto', color: 'var(--accent-amber)', fontSize: '0.9rem' }}>★★★★★</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Listings ── */}
      <section className="section">
        <div className="container">
          <div className="listings-header">
            <div>
              <span className="badge badge-primary" style={{ marginBottom: 12 }}>Featured Listings</span>
              <h2 className="display-md">Top Verified Properties</h2>
            </div>
            <Link to="/listings" className="btn btn-secondary">
              View All
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="properties-grid">
            {featured.map((p, i) => (
              <PropertyCard key={p.id} property={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Features (Why Technispace) ── */}
      <section className="section" style={{ background: 'var(--bg-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <span className="badge badge-primary" style={{ marginBottom: 16 }}>Why Technispace</span>
            <h2 className="display-md">Built for Trust. Designed for You.</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: 12, maxWidth: 520, margin: '12px auto 0' }}>
              We built the safest way to rent — direct, verified, and secured.
            </p>
          </div>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="section" style={{ background: 'var(--bg-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="badge badge-primary" style={{ marginBottom: 16 }}>How It Works</span>
            <h2 className="display-md">From Listing to Move-In</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 24,
          }}>
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '32px 24px',
                position: 'relative',
                textAlign: 'center',
              }}>
                <div style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '3rem',
                  fontWeight: 900,
                  background: 'var(--brand-gradient)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  lineHeight: 1,
                  marginBottom: 16,
                }}>
                  {step.step}
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 10 }}>{step.title}</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="section">
        <div className="container">
          <div style={{
            background: 'var(--brand-gradient)',
            borderRadius: 'var(--radius-xl)',
            padding: '64px 48px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 900, color: 'white', marginBottom: 16 }}>
                Ready to Find Your Next Home?
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 36, fontSize: '1.05rem' }}>
                Join thousands of tenants who rent directly — no agents, no hassle.
              </p>
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link
                  to="/register"
                  id="cta-register-btn"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '15px 32px',
                    borderRadius: 'var(--radius-full)',
                    background: 'white',
                    color: 'var(--brand-primary)',
                    fontFamily: 'Outfit, sans-serif',
                    fontWeight: 700,
                    fontSize: '1rem',
                    textDecoration: 'none',
                    transition: 'all var(--transition-med)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  Sign Up Free
                  <ArrowRight size={18} />
                </Link>
                <Link
                  to="/listings"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '15px 32px',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(255,255,255,0.15)',
                    color: 'white',
                    border: '2px solid rgba(255,255,255,0.4)',
                    fontFamily: 'Outfit, sans-serif',
                    fontWeight: 700,
                    fontSize: '1rem',
                    textDecoration: 'none',
                    transition: 'all var(--transition-med)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  Browse Listings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
