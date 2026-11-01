import { ShieldAlert, AlertTriangle, CheckCircle, FileText, Lock, Eye, HelpCircle, PhoneCall } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ADVISORIES = [
  {
    id: 1,
    badge: 'Rental Security Alert',
    badgeColor: 'var(--accent-red)',
    badgeBg: 'rgba(239, 68, 68, 0.12)',
    title: 'Never Pay Inspection or "Form" Fees',
    summary: 'Rogue street agents in Lagos often charge ₦5,000 to ₦20,000 upfront just to view a house. On Technispace, all viewings are 100% free with the actual property owner.',
    details: [
      'Technispace landlords are contractually barred from charging viewing fees or registration charges.',
      'If anyone asking to show you a property demands a "gate fee" or "inspection charge", report them immediately to safety@technipal.com.ng.',
      'Never send mobile money or bank transfers to an individual claiming to hold keys on behalf of an overseas owner.',
    ],
  },
  {
    id: 2,
    badge: 'Legal & Caution Notice',
    badgeColor: 'var(--accent-amber)',
    badgeBg: 'rgba(245, 158, 11, 0.12)',
    title: 'Verify Physical Possession Before Rent Transfer',
    summary: 'Always carry out a physical walkthrough of the property in person and inspect the compound before transferring your final rent and caution deposit.',
    details: [
      'Meet the landlord or their verified attorney directly at the premises during daylight hours.',
      'Test essential utilities: ensure the borehole or water pump works, check the prepaid meter serial number, and test drainage.',
      'Confirm the tenancy agreement explicitly caps all platform fees and ancillary documentation at a maximum of 5%.',
    ],
  },
  {
    id: 3,
    badge: 'Landlord Best Practice',
    badgeColor: 'var(--brand-primary)',
    badgeBg: 'rgba(108, 71, 255, 0.12)',
    title: 'Safeguard Your Property Ownership Documents',
    summary: 'Fraudulent agents frequently duplicate real property listings and pose as landlords online. How Technispace protects real property owners.',
    details: [
      'Our team verifies government ID (NIN) and proof of title before granting the Verified Landlord badge.',
      'Your direct contact phone number and email are hidden from unauthenticated internet bots and scrapers.',
      'Only registered, logged-in tenants on Technispace can access direct host messaging.',
    ],
  },
  {
    id: 4,
    badge: 'Tenancy Rights Notice',
    badgeColor: 'var(--accent-teal)',
    badgeBg: 'rgba(6, 214, 160, 0.12)',
    title: 'Understanding Lagos Tenancy Law Regulations',
    summary: 'Know your statutory rights as a tenant or landlord under the Lagos State Tenancy Law regarding rent advances and notice periods.',
    details: [
      'For yearly tenancies, statutory advance rent is standardly payable in accordance with Lagos housing regulations.',
      'Landlords cannot arbitrarily evict tenants without formal written notice to quit in accordance with the law.',
      'Keep copies of all Paystack subscription invoices, rent receipts, and signed inventory lists in writing.',
    ],
  },
];

export default function AdvisoryPage() {
  const navigate = useNavigate();

  return (
    <div style={{ paddingTop: 104, paddingBottom: 80 }}>
      <div className="container" style={{ maxWidth: 900 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <span className="badge badge-primary" style={{ marginBottom: 14 }}>
            <ShieldAlert size={13} /> Official Safety & Compliance Desk
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 900, marginBottom: 14 }}>
            Technispace Rental Advisory
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: 680, margin: '0 auto' }}>
            Official consumer protection advisories, fraud prevention bulletins, and verified tenancy guidelines for renting in Lagos.
          </p>
        </div>

        {/* Warning Banner */}
        <div style={{
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px 28px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 16,
          marginBottom: 36,
        }}>
          <AlertTriangle size={24} color="var(--accent-red)" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--accent-red)', marginBottom: 4 }}>
              Consumer Alert: Zero Viewing Fees Guaranteed
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, lineHeight: 1.6 }}>
              Technispace does not charge inspection fees. Any individual asking for money to show you a property listed on this platform is acting fraudulently. Report suspicious numbers directly to <strong>safety@technipal.com.ng</strong>.
            </p>
          </div>
        </div>

        {/* Advisory Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 48 }}>
          {ADVISORIES.map(item => (
            <div key={item.id} style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-xl)',
              padding: 32,
              boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: item.badgeColor,
                  background: item.badgeBg,
                  letterSpacing: '0.04em',
                }}>
                  {item.badge}
                </span>
              </div>

              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: 8, color: 'var(--text-primary)' }}>
                {item.title}
              </h2>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: 20 }}>
                {item.summary}
              </p>

              <div style={{
                background: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '16px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}>
                {item.details.map((detail, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <CheckCircle size={16} color="var(--accent-teal)" style={{ flexShrink: 0, marginTop: 3 }} />
                    <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {detail}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Need Help Banner */}
        <div style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          padding: 32,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
        }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 6 }}>Need Urgent Guidance on a Listing?</h3>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>
              Our Lagos legal & compliance team reviews suspicious listings and tenancy inquiries daily.
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/contact')}>
            Contact Compliance Desk
          </button>
        </div>
      </div>
    </div>
  );
}
