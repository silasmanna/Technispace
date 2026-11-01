import { Shield, Lock, Eye, CheckCircle2 } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div style={{ paddingTop: 104, paddingBottom: 80 }}>
      <div className="container" style={{ maxWidth: 840 }}>
        <div style={{ marginBottom: 40 }}>
          <span className="badge badge-primary" style={{ marginBottom: 12 }}>
            <Lock size={13} /> Data Protection & NDPR
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.6rem)', fontWeight: 900, marginBottom: 8 }}>
            Privacy Policy
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Last Updated: October 2026 · Compliant with the Nigeria Data Protection Act (NDPA)
          </p>
        </div>

        <div style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          padding: '36px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
          lineHeight: 1.7,
          color: 'var(--text-secondary)',
          fontSize: '0.95rem',
        }}>
          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>
              1. Information We Collect
            </h2>
            <p>
              Technispace collects personal data required to maintain a safe, fraud-free peer-to-peer real estate ecosystem. This includes:
            </p>
            <ul style={{ paddingLeft: 20, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li><strong>Account Data:</strong> Name, verified email address, phone number, and password hash.</li>
              <li><strong>Landlord Identity & KYC:</strong> National Identity Number (NIN), government ID, proof of property ownership (Title deed, Certificate of Occupancy, or utility bills).</li>
              <li><strong>Listing Data:</strong> Property location, amenities, rental prices, photos, and utility disclosures.</li>
              <li><strong>Payment Records:</strong> Paystack transaction reference IDs, plan details, and receipt logs (we do NOT store raw card details or PINs).</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>
              2. How Contact Numbers Are Protected
            </h2>
            <p>
              To protect landlords from unvetted scrapers and marketing spam, landlord direct phone numbers and emails are only accessible to authenticated, logged-in tenants. Public visitors can view property specifications and photos, but must create a free account to unlock direct contacts.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>
              3. NDPR Compliance & Data Storage
            </h2>
            <p>
              All user data is encrypted at rest and in transit using TLS 1.3 and AES-256 standard encryption. We adhere strictly to the Nigeria Data Protection Regulation (NDPR) and the Nigeria Data Protection Act (NDPA). Your personal details are never sold or rented to third-party marketing companies.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>
              4. Your Rights
            </h2>
            <p>
              Under Nigerian data protection laws, you possess the right to access, rectify, or request the erasure of your personal data stored on our servers. To exercise any of these rights, contact our Data Protection Officer at <a href="mailto:privacy@technipal.com.ng" style={{ color: 'var(--brand-primary)' }}>privacy@technipal.com.ng</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
