import { useState } from 'react';
import { Star, ShieldCheck, CheckCircle2, ThumbsUp, Filter } from 'lucide-react';

const REVIEWS_DATA = [
  {
    id: 1,
    name: 'Chinedu Eze',
    role: 'Tenant',
    city: 'Lekki Phase 1, Lagos',
    rating: 5,
    date: '3 days ago',
    title: 'Saved ₦450,000 in agency fees!',
    comment: 'I was so tired of estate agents demanding 10% agency plus 10% legal for an apartment in Lekki. With Technispace, I contacted Chief Emeka directly, inspected the next day, and signed the lease with zero agent wahala. Best platform ever.',
    propertyTitle: 'Modern 2-Bedroom Luxury Flat',
    landlordName: 'Emeka Johnson',
  },
  {
    id: 2,
    name: 'Olumide Bakare',
    role: 'Verified Landlord',
    city: 'Ikeja GRA, Lagos',
    rating: 5,
    date: '1 week ago',
    title: 'Filled my 3-bedroom unit in 4 days',
    comment: 'The KYC verification gave tenants instant confidence. Boosted my listing to Gold Tier with Paystack and got over 12 qualified inquiries within 48 hours. Direct communication saves months of delay.',
    propertyTitle: 'Executive 3-Bedroom Duplex',
    landlordName: 'Olumide Bakare',
  },
  {
    id: 3,
    name: 'Amina Bello',
    role: 'Tenant',
    city: 'Maitama, Abuja',
    rating: 5,
    date: '2 weeks ago',
    title: 'Accurate water and power details',
    comment: 'In Abuja, water supply is everything. The utility disclosure card showed exactly that this property has a dedicated industrial borehole and solar backup. Everything was 100% accurate when I visited.',
    propertyTitle: 'Contemporary Studio Apartment',
    landlordName: 'Hajiya Fatima',
  },
  {
    id: 4,
    name: 'Dr. Kelechi Nwosu',
    role: 'Verified Landlord',
    city: 'GRA Phase 2, Port Harcourt',
    rating: 5,
    date: '3 weeks ago',
    title: 'No more rogue agents duplicating my listings',
    comment: 'Previously, random agents would copy my property photos, inflate the rent, and turn serious tenants away. Technispace locks the property directly to verified owners. The subscription is worth every kobo.',
    propertyTitle: 'Waterfront Penthouse',
    landlordName: 'Dr. Kelechi Nwosu',
  },
  {
    id: 5,
    name: 'Toyin Adesanya',
    role: 'Tenant',
    city: 'Yaba, Lagos',
    rating: 4.9,
    date: '1 month ago',
    title: 'No inspection fee scam',
    comment: 'Every agent on the street wanted ₦5,000 just to show me a dirty room. On Technispace, every inspection was completely free and coordinated directly with the owner.',
    propertyTitle: 'Furnished 1-Bedroom Loft',
    landlordName: 'Tunde Adeleke',
  },
];

export default function ReviewsPage() {
  const [filter, setFilter] = useState('all');

  const filtered = REVIEWS_DATA.filter(r => {
    if (filter === 'tenants') return r.role === 'Tenant';
    if (filter === 'landlords') return r.role === 'Verified Landlord';
    return true;
  });

  return (
    <div style={{ paddingTop: 104, paddingBottom: 80 }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 40px' }}>
          <span className="badge badge-primary" style={{ marginBottom: 14 }}>
            <ShieldCheck size={13} /> 100% Real Experiences
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 900, marginBottom: 14 }}>
            Verified Community Reviews
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Hear how verified Nigerian landlords and happy tenants connected directly with zero middleman deductions.
          </p>
        </div>

        {/* Rating summary banner */}
        <div style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px 32px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
          marginBottom: 36,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ fontSize: '2.8rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>
              4.9
            </div>
            <div>
              <div style={{ display: 'flex', gap: 4, color: 'var(--accent-amber)', marginBottom: 4 }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="var(--accent-amber)" />
                ))}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Based on 1,420+ verified tenant & landlord connections
              </div>
            </div>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { id: 'all', label: 'All Reviews' },
              { id: 'tenants', label: 'From Tenants' },
              { id: 'landlords', label: 'From Landlords' },
            ].map(tab => (
              <button
                key={tab.id}
                className={`btn btn-sm ${filter === tab.id ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setFilter(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {filtered.map(item => (
            <div key={item.id} style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: 28,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: 'var(--brand-gradient)', color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: '0.85rem',
                    }}>
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.city}</div>
                    </div>
                  </div>
                </div>
                <span className={`badge ${item.role.includes('Landlord') ? 'badge-primary' : 'badge-verified'}`} style={{ fontSize: '0.72rem' }}>
                  {item.role}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 12 }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="var(--accent-amber)" color="var(--accent-amber)" />
                ))}
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 6 }}>{item.date}</span>
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>
                "{item.title}"
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, flex: 1, margin: 0, marginBottom: 16 }}>
                {item.comment}
              </p>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>Property: <strong>{item.propertyTitle}</strong></span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--accent-teal)' }}>
                  <CheckCircle2 size={13} /> Verified Deal
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
