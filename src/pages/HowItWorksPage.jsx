import { CheckCircle2, ShieldCheck, Search, MessageSquare, Key, CreditCard, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HowItWorksPage() {
  const navigate = useNavigate();

  return (
    <div style={{ paddingTop: 104, paddingBottom: 80 }}>
      <div className="container">
        {/* Hero Section */}
        <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 60px' }}>
          <span className="badge badge-primary" style={{ marginBottom: 16 }}>
            <Sparkles size={13} /> Direct & Transparent
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 900, lineHeight: 1.15, marginBottom: 18 }}>
            How Technispace Works
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.7 }}>
            The direct Nigerian rental platform connecting verified property owners with verified tenants.
            Zero agent commissions, zero middleman extortion, and total clarity.
          </p>
        </div>

        {/* Two Track Grid: Tenants vs Landlords */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 32, marginBottom: 70 }}>
          {/* For Tenants */}
          <div style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-xl)',
            padding: 36,
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: 'rgba(6, 182, 212, 0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--accent-teal)',
              }}>
                <Search size={22} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-teal)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  For Renters & Tenants
                </span>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Rent in 4 Simple Steps</h2>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, margin: '20px 0 32px' }}>
              {[
                {
                  step: '01',
                  title: 'Browse Verified Listings',
                  desc: 'Search direct rentals across Lagos (Lekki, Ikeja, Yaba, Victoria Island, etc.), with expansion coming soon to Abuja, Port Harcourt, and other cities.',
                },
                {
                  step: '02',
                  title: 'Sign In & Access Direct Contacts',
                  desc: 'Create your free tenant account to view the direct phone number, email, and start in-platform messaging with the actual property owner.',
                },
                {
                  step: '03',
                  title: 'Schedule Free In-Person Inspection',
                  desc: 'Coordinate an inspection directly with the owner. No agency inspection fees, no “form fees”, and no agent runarounds.',
                },
                {
                  step: '04',
                  title: 'Agree on Terms & Move In',
                  desc: 'Negotiate lease terms, sign agreements directly with the landlord, pay agreed rent, and collect your keys with zero middleman deductions.',
                },
              ].map(item => (
                <div key={item.step} style={{ display: 'flex', gap: 16 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: 'var(--bg-subtle)', border: '1px solid var(--border-color)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: '0.85rem', color: 'var(--accent-teal)',
                    flexShrink: 0,
                  }}>
                    {item.step}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 4 }}>{item.title}</h3>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 'auto', paddingTop: 20 }}>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => navigate('/listings')}>
                Browse Available Properties <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* For Landlords */}
          <div style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-xl)',
            padding: 36,
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: 'rgba(108, 71, 255, 0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--brand-primary)',
              }}>
                <ShieldCheck size={22} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--brand-primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  For Property Owners
                </span>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>List & Fill Vacancies Faster</h2>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, margin: '20px 0 32px' }}>
              {[
                {
                  step: '01',
                  title: 'Complete 1-Minute KYC Verification',
                  desc: 'Submit your NIN, phone number, and proof of ownership to receive the Verified Landlord badge that commands trust.',
                },
                {
                  step: '02',
                  title: 'Pick a Subscription Plan',
                  desc: 'Select Single Listing (1 property), Starter Bundle (up to 10), or Unlimited landlord subscription via secure Paystack billing.',
                },
                {
                  step: '03',
                  title: 'Publish Photos & Accurate Utility Details',
                  desc: 'Specify running water source, electricity status, parking spaces, and upload HD photos. Edit anytime from your dashboard.',
                },
                {
                  step: '04',
                  title: 'Screen Serious Tenants Directly',
                  desc: 'Receive direct calls and platform inquiries only from registered tenants. Select the right tenant with zero commission deductions.',
                },
              ].map(item => (
                <div key={item.step} style={{ display: 'flex', gap: 16 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: 'var(--bg-subtle)', border: '1px solid var(--border-color)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: '0.85rem', color: 'var(--brand-primary)',
                    flexShrink: 0,
                  }}>
                    {item.step}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 4 }}>{item.title}</h3>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 'auto', paddingTop: 20 }}>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => navigate('/landlords')}>
                Become a Verified Landlord <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Fee Guarantee Section */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(108, 71, 255, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          padding: '40px 32px',
          textAlign: 'center',
          maxWidth: 900,
          margin: '0 auto',
        }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 12 }}>Our 5% Total Fee Cap Guarantee</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 680, margin: '0 auto 24px', lineHeight: 1.7 }}>
            In traditional Nigerian leasing, agents charge 10% agency + 10% legal + caution fees, inflating moving costs by 30%+.
            On Technispace, there are NO agent fees. All platform fees, agreements, or ancillary charges across our network are strictly capped at 5%, saving renters hundreds of thousands of Naira.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <button className="btn btn-secondary" onClick={() => navigate('/pricing')}>
              View Landlord Pricing
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/register')}>
              Join Technispace Today
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
