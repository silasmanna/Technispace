import { ShieldAlert, CheckCircle, Scale, MessageSquare, PhoneCall, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DisputesPage() {
  const navigate = useNavigate();

  return (
    <div style={{ paddingTop: 104, paddingBottom: 80 }}>
      <div className="container" style={{ maxWidth: 880 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <span className="badge badge-primary" style={{ marginBottom: 14 }}>
            <Scale size={13} /> Fairness & Protection
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.8rem)', fontWeight: 900, marginBottom: 12 }}>
            Dispute Resolution & Mediation
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: 660, margin: '0 auto' }}>
            Transparent processes to peacefully resolve landlord-tenant discrepancies, false listing disclosures, or tenancy miscommunications.
          </p>
        </div>

        {/* 3 Step Resolution Framework */}
        <div style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          padding: 36,
          marginBottom: 36,
        }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: 24 }}>The 3-Tier Resolution Framework</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {[
              {
                step: 'Step 1',
                title: 'Direct Amicable Discussion',
                desc: 'Because Technispace connects direct landlords with tenants, over 85% of issues (move-in dates, minor repairs) are solved directly between the two verified parties.',
              },
              {
                step: 'Step 2',
                title: 'Technispace Mediation Desk',
                desc: 'If an issue relates to misrepresentation of utilities (e.g. running water was listed as available but absent), our Lagos trust & safety team investigates listing audit logs.',
              },
              {
                step: 'Step 3',
                title: 'Sanctions & Legal Referral',
                desc: 'Verified landlords found intentionally defrauding tenants lose their KYC status, have listings delisted, and cases are forwarded to legal mediators or civil courts.',
              },
            ].map(col => (
              <div key={col.step} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: 20,
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--brand-primary)', marginBottom: 6 }}>
                  {col.step}
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 8 }}>{col.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{col.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Report an Issue CTA */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(108, 71, 255, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%)',
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
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 6 }}>Need Help With an Active Case?</h3>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>
              Our trust & safety team answers dispute tickets within 4 hours.
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/contact')}>
            Open Dispute Ticket
          </button>
        </div>
      </div>
    </div>
  );
}
