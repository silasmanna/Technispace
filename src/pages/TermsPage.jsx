import { Shield, FileText, CheckCircle, AlertTriangle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div style={{ paddingTop: 104, paddingBottom: 80 }}>
      <div className="container" style={{ maxWidth: 840 }}>
        <div style={{ marginBottom: 40 }}>
          <span className="badge badge-primary" style={{ marginBottom: 12 }}>
            <FileText size={13} /> Legal Agreement
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.6rem)', fontWeight: 900, marginBottom: 8 }}>
            Terms of Service
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Effective Date: October 2026 · Technispace Real Estate Technologies Nigeria Limited
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
              1. Platform Nature & Direct Relationship
            </h2>
            <p>
              Technispace operates strictly as a peer-to-peer real estate discovery and verification platform in Nigeria. Technispace does NOT act as an estate agent, broker, or legal representative for any user. All tenancy agreements, negotiations, and payments are concluded directly between verified landlords and prospective tenants.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>
              2. 5% Total Fee Cap & Platform Charges
            </h2>
            <p>
              Technispace commits to total transparency. There are no agency commissions. Any optional ancillary administrative charges, legal documentation templates, or service fees facilitated through Technispace are capped at an aggregate maximum of 5%. Landlords purchase listing subscriptions and promotional boosts transparently via Paystack.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>
              3. Landlord Verification & Listing Rules
            </h2>
            <p>
              To maintain the integrity of our marketplace, all landlords must submit valid government-issued identification (National Identity Number - NIN, International Passport, or Driver’s License) and verifiable proof of ownership or legal power of attorney. Creating misleading listings, posting false rental rates, or impersonating a property owner will lead to immediate account termination and reporting to the appropriate authorities.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>
              4. Tenant Conduct & Direct Inspection
            </h2>
            <p>
              Tenants must provide valid contact details to access direct landlord contacts. Technispace mandates that tenant inspections remain free of charge. No landlord or representative listed on Technispace is authorized to demand "inspection fees", "registration fees", or "viewing forms" before property inspection.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>
              5. Payments & Paystack Processing
            </h2>
            <p>
              All landlord subscription plans and listing promotions are billed securely in Nigerian Naira (₦) through Paystack. By confirming a checkout transaction, you authorize Paystack to process the stated fee. All purchases include digital itemized receipts with verifiable transaction reference codes.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>
              6. Governing Law & Jurisdiction
            </h2>
            <p>
              These Terms are governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any disputes arising under these Terms shall be subject to amicable resolution or the jurisdiction of the courts of Lagos State.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
