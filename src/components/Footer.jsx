import { Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';

export default function Footer() {
  const handleLinkClick = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'var(--brand-gradient)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
              }}>
                <Building2 size={16} />
              </div>
              Technispace
            </div>
            <p className="footer-tagline">
              Connecting KYC-verified landlords directly with tenants across Nigeria.
              No agents, no middlemen — just transparent, direct rentals.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {['𝕏', 'in', 'IG', 'YT'].map((label) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  style={{
                    width: 36, height: 36,
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-color)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 700,
                    transition: 'all var(--transition-fast)', textDecoration: 'none',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = 'var(--brand-primary)';
                    e.currentTarget.style.borderColor = 'var(--brand-primary)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = 'var(--text-muted)';
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                  }}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="footer-col-title">Platform</h4>
            <ul className="footer-links">
              <li><Link to="/listings" onClick={handleLinkClick}>Browse Listings</Link></li>
              <li><Link to="/landlords" onClick={handleLinkClick}>For Landlords</Link></li>
              <li><Link to="/pricing" onClick={handleLinkClick}>Plans & Pricing</Link></li>
              <li><Link to="/how-it-works" onClick={handleLinkClick}>How It Works</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col-title">Trust & Safety</h4>
            <ul className="footer-links">
              <li><Link to="/advisory" onClick={handleLinkClick}>Rental Advisory</Link></li>
              <li><Link to="/reviews" onClick={handleLinkClick}>Verified Reviews</Link></li>
              <li><Link to="/disputes" onClick={handleLinkClick}>Dispute Resolution</Link></li>
              <li><Link to="/faq" onClick={handleLinkClick}>FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col-title">Company</h4>
            <ul className="footer-links">
              <li><Link to="/about" onClick={handleLinkClick}>About Us</Link></li>
              <li><Link to="/advisory" onClick={handleLinkClick}>Advisory</Link></li>
              <li><Link to="/careers" onClick={handleLinkClick}>Careers</Link></li>
              <li><Link to="/contact" onClick={handleLinkClick}>Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Technispace Inc. All rights reserved. Nigeria 🇳🇬</p>
          <div style={{ display: 'flex', gap: 20 }}>
            <Link to="/privacy" onClick={handleLinkClick} style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Privacy Policy</Link>
            <Link to="/terms" onClick={handleLinkClick} style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
