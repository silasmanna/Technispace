import { Briefcase, MapPin, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OPENINGS = [
  {
    id: 1,
    title: 'Senior Fullstack Engineer (React / Node / Postgres)',
    dept: 'Engineering',
    location: 'Lagos, Nigeria (Hybrid / Remote)',
    type: 'Full-Time',
    desc: 'Build out our high-throughput direct real estate marketplace, Paystack billing flows, and instant messaging engine.',
  },
  {
    id: 2,
    title: 'KYC & Field Verification Specialist',
    dept: 'Trust & Safety',
    location: 'Lagos & Abuja, Nigeria',
    type: 'Full-Time',
    desc: 'Verify landlord property ownership records, conduct spot audits on listed buildings, and maintain platform integrity.',
  },
  {
    id: 3,
    title: 'Landlord Community Growth Manager',
    dept: 'Growth & Partnerships',
    location: 'Lagos, Nigeria',
    type: 'Full-Time',
    desc: 'Onboard residential landlords, property management syndicates, and real estate developers to Technispace direct portal.',
  },
];

export default function CareersPage() {
  const navigate = useNavigate();

  return (
    <div style={{ paddingTop: 104, paddingBottom: 80 }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 50px' }}>
          <span className="badge badge-primary" style={{ marginBottom: 14 }}>
            <Sparkles size={13} /> Work With Us
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 900, marginBottom: 14 }}>
            Build the Future of Renting in Africa
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Join our mission to eliminate middleman extortion and give millions of Nigerians transparent, dignifying access to quality housing.
          </p>
        </div>

        {/* Culture highlights */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 20, marginBottom: 50,
        }}>
          {[
            { title: 'Competitive Remuneration', desc: 'Above-market base salary in NGN with annual performance bonuses.' },
            { title: 'Remote-First Flexibility', desc: 'Work from our Victoria Island innovation hub or anywhere across Nigeria.' },
            { title: 'Comprehensive Health Cover', desc: 'Full HMO medical coverage for you and your direct dependents.' },
            { title: 'Housing Subsidy', desc: 'Enjoy annual housing perks and rent advances as a valued team member.' },
          ].map(c => (
            <div key={c.title} style={{
              background: 'var(--bg-elevated)', border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)', padding: 22,
            }}>
              <CheckCircle size={20} color="var(--accent-teal)" style={{ marginBottom: 10 }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 6 }}>{c.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{c.desc}</p>
            </div>
          ))}
        </div>

        {/* Open Positions */}
        <div style={{ maxWidth: 840, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 24 }}>Open Positions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {OPENINGS.map(job => (
              <div key={job.id} style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-xl)',
                padding: 28,
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 16,
              }}>
                <div>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>{job.dept}</span>
                    <span className="badge" style={{ fontSize: '0.72rem', background: 'var(--bg-subtle)' }}>{job.type}</span>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 6 }}>{job.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: 10 }}>
                    <MapPin size={13} color="var(--brand-primary)" /> {job.location}
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0, maxWidth: 560, lineHeight: 1.5 }}>
                    {job.desc}
                  </p>
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => navigate('/contact')}>
                  Apply Now <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
