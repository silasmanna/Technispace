import { Link } from 'react-router-dom';
import { Building2, ShieldCheck, Banknote, MessageSquare, ArrowRight, CheckCircle } from 'lucide-react';

const BENEFITS = [
  'List properties easily with flexible listing plans',
  'KYC verification builds tenant trust',
  'Direct tenant communication, no middleman agents',
  'Detailed analytics on views and inquiries',
  'Collect 100% of your rent directly from tenants',
];

const HOW = [
  {
    icon: <ShieldCheck size={28} />,
    title: '1. Register & Complete KYC',
    desc: 'Create your landlord account and submit identity documents. Our team reviews within 24–48 hours.',
  },
  {
    icon: <Building2 size={28} />,
    title: '2. Choose Plan & List Property',
    desc: 'Select a listing plan from ₦10,000/month. Add photos, pricing in Naira, amenities, and utilities.',
  },
  {
    icon: <MessageSquare size={28} />,
    title: '3. Receive Direct Inquiries',
    desc: 'Tenants browse and message you directly. No agent in between — just clear, fast communication.',
  },
  {
    icon: <Banknote size={28} />,
    title: '4. Direct Payment & Move-In',
    desc: 'Collect rent directly from your tenants on your own terms. Keep 100% of your rental income.',
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
              Technispace connects KYC-verified landlords directly with quality tenants across Nigeria.
              No middlemen, no agent hassle — straightforward listing subscriptions and 100% direct rent collection.
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
                We built the tools landlords actually need — from identity verification to direct inquiries and flexible listing plans — so you can focus on your properties, not agent hassles.
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

            {/* Plan Breakdown Card */}
            <div>
              <div style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: 'var(--radius-xl)',
                padding: '36px',
                boxShadow: 'var(--shadow-lg)',
              }}>
                <h3 style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: 24 }}>✨ Simple Plans & Direct Rentals</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {[
                    { label: 'Tenant Registration', value: 'Free', good: true },
                    { label: 'Landlord Registration & KYC', value: 'Free', good: true },
                    { label: 'Single Listing (30 days)', value: '₦10,000', good: true },
                    { label: '10 Properties Plan (30 days)', value: '₦50,000', good: true },
                    { label: 'Unlimited Properties (30 days)', value: '₦100,000', good: true },
                    { label: 'Agent Middlemen', value: 'None', good: true },
                    { label: 'Rent Collected by Landlord', value: '100% Direct', good: true },
                  ].map(({ label, value, good }, i) => (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '14px 0',
                      borderBottom: i < 6 ? '1px solid var(--border-color)' : 'none',
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
