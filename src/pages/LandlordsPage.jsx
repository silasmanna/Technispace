import { Link } from 'react-router-dom';
import { Building2, ShieldCheck, Banknote, MessageSquare, ArrowRight, CheckCircle } from 'lucide-react';

const BENEFITS = [
  'List properties for free — no upfront fees',
  'KYC verification builds tenant trust',
  'Secure escrow keeps payments organized',
  'Direct tenant communication, no middlemen',
  'Detailed analytics on views and inquiries',
  '5% platform fee deducted from landlord payout only',
];

const HOW = [
  {
    icon: <ShieldCheck size={28} />,
    title: '1. Register & Complete KYC',
    desc: 'Create your landlord account and submit identity documents. Our team reviews within 24–48 hours.',
  },
  {
    icon: <Building2 size={28} />,
    title: '2. List Your Property',
    desc: 'Add photos, pricing, amenities, and availability. Your property goes live instantly after approval.',
  },
  {
    icon: <MessageSquare size={28} />,
    title: '3. Receive Tenant Inquiries',
    desc: 'Tenants browse and message you directly. No agent in between — just clear communication.',
  },
  {
    icon: <Banknote size={28} />,
    title: '4. Collect via Secure Escrow',
    desc: 'Rent is held in escrow and released to you after move-in confirmation. 5% fee auto-deducted.',
  },
];

export default function LandlordsPage() {
  return (
    <div style={{ paddingTop: 68 }}>
      {/* Hero */}
      <section style={{
        padding: '100px 0 80px',
        background: 'var(--bg-subtle)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(108,71,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(108,71,255,0.04) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 640 }}>
            <span className="badge badge-primary" style={{ marginBottom: 20 }}>For Landlords</span>
            <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: 20 }}>
              List Directly.<br />
              <span className="text-gradient">Earn More. Stress Less.</span>
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 36 }}>
              Technispace connects KYC-verified landlords directly with quality tenants.
              No agents, no commission splits — just a transparent 5% platform fee deducted from your payout.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Link to="/register?role=landlord" className="btn btn-primary btn-lg" id="landlord-register-btn">
                Start as Landlord
                <ArrowRight size={18} />
              </Link>
              <Link to="/kyc" className="btn btn-ghost btn-lg">
                <ShieldCheck size={18} />
                Complete KYC
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
            <div>
              <span className="badge badge-primary" style={{ marginBottom: 16 }}>Why Technispace</span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 20 }}>Everything You Need to Rent with Confidence</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 28 }}>
                We built the tools landlords actually need — from identity verification to secure payments — so you can focus on your properties, not the paperwork.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {BENEFITS.map((b, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <CheckCircle size={18} color="var(--accent-teal)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fee Breakdown Card */}
            <div>
              <div style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: 'var(--radius-xl)',
                padding: '36px',
                boxShadow: 'var(--shadow-lg)',
              }}>
                <h3 style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: 24 }}>💰 Simple, Transparent Fees</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {[
                    { label: 'Tenant Registration', value: 'Free', good: true },
                    { label: 'Landlord Registration', value: 'Free', good: true },
                    { label: 'Property Listing Fee', value: 'Free', good: true },
                    { label: 'Agent Commission', value: 'None', good: true },
                    { label: 'Platform Fee (landlord only)', value: '5% of rent', good: false },
                    { label: 'Escrow Service', value: 'Included', good: true },
                  ].map(({ label, value, good }, i) => (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '14px 0',
                      borderBottom: i < 5 ? '1px solid var(--border-color)' : 'none',
                    }}>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{label}</span>
                      <span style={{
                        fontWeight: 700,
                        color: good ? 'var(--accent-teal)' : 'var(--text-primary)',
                        fontSize: '0.9rem',
                      }}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 24, padding: '16px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Example: You list at $3,000/mo → Technispace deducts $150 → You receive $2,850.
                  Tenants always pay exactly the listed rent.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section" style={{ background: 'var(--bg-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="badge badge-primary" style={{ marginBottom: 16 }}>The Process</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>How It Works for Landlords</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            {HOW.map((h, i) => (
              <div key={i} style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '32px 24px',
                position: 'relative',
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 'var(--radius-md)',
                  background: 'rgba(108,71,255,0.1)',
                  color: 'var(--brand-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 20,
                }}>
                  {h.icon}
                </div>
                <h3 style={{ fontWeight: 700, marginBottom: 10, fontSize: '1rem' }}>{h.title}</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 16 }}>Ready to List Your Property?</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 32, maxWidth: 480, margin: '0 auto 32px' }}>
            Join verified landlords already earning direct on Technispace.
          </p>
          <Link to="/register?role=landlord" className="btn btn-primary btn-lg" id="landlord-cta-btn">
            Get Started Free
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
