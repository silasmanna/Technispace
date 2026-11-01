import { ShieldCheck, Target, Users, Award, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div style={{ paddingTop: 104, paddingBottom: 80 }}>
      <div className="container">
        {/* Hero Section */}
        <div style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto 60px' }}>
          <span className="badge badge-primary" style={{ marginBottom: 16 }}>
            Our Mission & Purpose
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 900, lineHeight: 1.15, marginBottom: 18 }}>
            Transforming Housing in Nigeria, One Direct Lease at a Time
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', lineHeight: 1.75 }}>
            Technispace was founded to fix the broken, extortionate rental ecosystem across Nigeria.
            By removing unlicensed middlemen and connecting verified landlords directly with trustworthy tenants,
            we restore dignity, safety, and affordability to renting.
          </p>
        </div>

        {/* Story / Problem & Solution */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28, marginBottom: 60 }}>
          <div style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-xl)',
            padding: 36,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'rgba(239, 68, 68, 0.12)', color: 'var(--accent-red)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 20,
            }}>
              <Target size={22} />
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: 12 }}>The Problem We Solve</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
              Finding a home in Lagos, Abuja, or Port Harcourt often feels like navigating a minefield. Unvetted agents demand hefty "inspection fees" for dilapidated units, tack on 20%–30% in bogus commissions, and frequently disappear with rent deposits. Landlords, on the other hand, struggle with unresponsive agents and unverified occupants.
            </p>
          </div>

          <div style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-xl)',
            padding: 36,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'rgba(16, 185, 129, 0.12)', color: 'var(--accent-teal)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 20,
            }}>
              <Award size={22} />
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: 12 }}>The Technispace Solution</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
              We created a direct verified marketplace. Every property owner must undergo strict government-grade identity (NIN) and ownership checks before listing. Tenants browse for free, inspect for free, and negotiate face-to-face. No agent fees, transparent utility specifications, and all fees strictly capped at 5%.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div style={{ marginBottom: 70 }}>
          <h2 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 800, marginBottom: 36 }}>
            Our Core Principles
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {[
              {
                title: '100% Direct Landlords',
                desc: 'Zero fake agents, zero impersonators. Every host is verified with government ID and verified deed or utility records.',
              },
              {
                title: 'Zero Agent Commission',
                desc: 'Renters should never pay extra fees just to view or secure a roof over their heads.',
              },
              {
                title: 'Accurate Utility Disclosures',
                desc: 'Clear details on borehole/water sources, prepaid meter status, parking spots, and landlord living proximity.',
              },
              {
                title: 'Data & Privacy Security',
                desc: 'Compliant with the Nigeria Data Protection Regulation (NDPR). Landlord contacts are revealed only to verified members.',
              },
            ].map(val => (
              <div key={val.title} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: 24,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, color: 'var(--brand-primary)' }}>
                  <CheckCircle size={18} />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>{val.title}</h3>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footprint Banner */}
        <div style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          padding: '40px 32px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--brand-primary)', marginBottom: 8, fontWeight: 700 }}>
              <MapPin size={18} /> Market Coverage
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, marginBottom: 8 }}>
              Active in Mostly Lagos for Now — Coming to Other Cities Soon
            </h3>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem', maxWidth: 620, lineHeight: 1.6 }}>
              We are currently focused on providing the deepest verified landlord coverage across Lagos (Lekki, Ikeja, Victoria Island, Yaba, Ikoyi, etc.), with upcoming rollouts planned for Abuja, Port Harcourt, and Ibadan.
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/listings')}>
            Explore Lagos Listings <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
