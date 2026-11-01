import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search, ShieldCheck, CreditCard, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FAQS = [
  {
    category: 'Tenants & Renting',
    items: [
      {
        q: 'Is browsing and contacting landlords really free for tenants?',
        a: 'Yes, 100% free. Tenants never pay registration fees, browsing fees, or agency commissions. Once you create a free account, you can message landlords directly and unlock their phone numbers.',
      },
      {
        q: 'Do I have to pay an inspection fee before viewing a property?',
        a: 'Never. Technispace prohibits any landlord or representative from charging inspection, viewing, or “form” fees. If anyone asks for money before showing you a home, report them immediately.',
      },
      {
        q: 'Where is Technispace currently available?',
        a: 'We are active mostly in Lagos for now (Lekki, Ikeja, Victoria Island, Yaba, Ikoyi, Surulere, etc.), with rapid expansion planned for other major cities soon.',
      },
      {
        q: 'What is the 5% fee cap guarantee?',
        a: 'Unlike traditional renting where middleman agents charge 10% agency plus 10% legal fees, on Technispace there are zero agent commissions. Any platform or administrative documentation charges are capped strictly at 5%.',
      },
    ],
  },
  {
    category: 'Landlords & Subscriptions',
    items: [
      {
        q: 'How does KYC verification work for property owners?',
        a: 'Landlords submit their National Identity Number (NIN) or government-issued ID along with proof of property ownership (C of O, deed of assignment, or approved utility bill). Our verification team reviews submissions within 4 hours.',
      },
      {
        q: 'What subscription plans are available for landlords?',
        a: 'We offer Single Listing (₦10,000 / 30 days for 1 property), Starter Bundle (₦50,000 / 30 days for up to 10 properties), and the Unlimited Plan (₦100,000 / 30 days for unlimited properties with priority support).',
      },
      {
        q: 'How do plan upgrades work?',
        a: 'Landlords can upgrade their active plan sequentially: from Single Listing (1 property) to Starter Bundle (10 properties), and from Starter Bundle to the Unlimited Plan. You can also purchase additional listing slots for ₦5,000 per extra listing whenever you reach your current tier capacity.',
      },
      {
        q: 'How do listing promotional boosts work?',
        a: 'Optional 30-day add-ons to maximize visibility: Premium Tier (₦5,000), Gold Tier (₦10,000 with city top ranking and SMS alerts), Platinum Tier (₦20,000 with homepage feature and email blast), and Diamond Tier (₦30,000 for #1 nationwide placement and WhatsApp alert blast).',
      },
      {
        q: 'How are payments processed?',
        a: 'All landlord subscription packages and boosts are securely processed in Nigerian Naira via Paystack using debit cards, bank transfers, or USSD.',
      },
    ],
  },
  {
    category: 'Safety & Disputes',
    items: [
      {
        q: 'How are my phone number and email protected?',
        a: 'Landlord direct contact details are hidden from public web visitors and search engine bots. Only registered, signed-in users on Technispace can view phone numbers and send inquiries.',
      },
      {
        q: 'What if a property does not match what was advertised?',
        a: 'Technispace enforces strict utility and condition disclosures. If borehole water, parking, or amenities are misrepresented, tenants can file a ticket with our dispute resolution team at safety@technipal.com.ng.',
      },
      {
        q: 'How do I contact Technispace support directly?',
        a: 'You can email hello@technipal.com.ng, call our Lagos hotline at +234 800 TECHNISPACE (+234 803 900 1200), or submit an online inquiry from our Contact page.',
      },
    ],
  },
];

export default function FaqPage() {
  const navigate = useNavigate();
  const [openMap, setOpenMap] = useState({ '0-0': true, '1-0': true });
  const [search, setSearch] = useState('');

  const toggle = (catIdx, itemIdx) => {
    const key = `${catIdx}-${itemIdx}`;
    setOpenMap(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={{ paddingTop: 104, paddingBottom: 80 }}>
      <div className="container" style={{ maxWidth: 860 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <span className="badge badge-primary" style={{ marginBottom: 14 }}>
            <HelpCircle size={13} /> Common Questions Answered
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 900, marginBottom: 14 }}>
            Frequently Asked Questions
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: 640, margin: '0 auto 24px' }}>
            Everything you need to know about renting direct, KYC landlord verification, and Paystack subscriptions.
          </p>

          {/* Search Box */}
          <div style={{ maxWidth: 480, margin: '0 auto' }}>
            <div className="search-bar" style={{ width: '100%' }}>
              <Search size={16} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Search FAQs (e.g. fees, KYC, inspection)..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 36, marginBottom: 50 }}>
          {FAQS.map((cat, catIdx) => {
            const filteredItems = cat.items.filter(item =>
              !search ||
              item.q.toLowerCase().includes(search.toLowerCase()) ||
              item.a.toLowerCase().includes(search.toLowerCase())
            );

            if (filteredItems.length === 0) return null;

            return (
              <div key={cat.category}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 16, color: 'var(--brand-primary)' }}>
                  {cat.category}
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {filteredItems.map((item, itemIdx) => {
                    const isOpen = Boolean(openMap[`${catIdx}-${itemIdx}`]);
                    return (
                      <div
                        key={itemIdx}
                        style={{
                          background: 'var(--bg-elevated)',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--radius-lg)',
                          overflow: 'hidden',
                          transition: 'all var(--transition-fast)',
                        }}
                      >
                        <button
                          onClick={() => toggle(catIdx, itemIdx)}
                          style={{
                            width: '100%',
                            padding: '18px 22px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 16,
                            background: 'none',
                            border: 'none',
                            textAlign: 'left',
                            cursor: 'pointer',
                            color: 'var(--text-primary)',
                            fontSize: '1rem',
                            fontWeight: 700,
                          }}
                        >
                          <span>{item.q}</span>
                          <span style={{ color: 'var(--text-muted)' }}>
                            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </span>
                        </button>

                        {isOpen && (
                          <div style={{
                            padding: '0 22px 18px 22px',
                            color: 'var(--text-secondary)',
                            fontSize: '0.92rem',
                            lineHeight: 1.65,
                            borderTop: '1px solid var(--border-color)',
                            paddingTop: 14,
                          }}>
                            {item.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Still Have Questions CTA */}
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
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 6 }}>Still Have Questions?</h3>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>
              Our support specialists in Lagos are ready to assist you.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-secondary" onClick={() => navigate('/advisory')}>
              Read Advisory
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/contact')}>
              Contact Support <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
