import { Link } from 'react-router-dom';
// import { Building2, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              <div className="navbar-logo-icon" style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--brand-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                {/* <Building2 size={16} /> */}
              </div>
              Technispace
            </div>
            <p className="footer-tagline">
              Connecting verified landlords directly with tenants. No agents, no hidden fees — just transparent, secure rentals.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              {/* {[Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  style={{
                    width: 36, height: 36,
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-color)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--text-muted)',
                    transition: 'all var(--transition-fast)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--brand-primary)'; e.currentTarget.style.borderColor = 'var(--brand-primary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                >
                  <Icon size={15} />
                </a>
              ))} */}
            </div>
          </div>

          <div>
            <h4 className="footer-col-title">Platform</h4>
            <ul className="footer-links">
              <li><Link to="/listings">Browse Listings</Link></li>
              <li><Link to="/landlords">For Landlords</Link></li>
              <li><Link to="/how-it-works">How It Works</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col-title">Trust & Safety</h4>
            <ul className="footer-links">
              <li><Link to="/kyc">KYC Verification</Link></li>
              <li><Link to="/escrow">Escrow System</Link></li>
              <li><Link to="/reviews">Verified Reviews</Link></li>
              <li><Link to="/disputes">Dispute Resolution</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col-title">Company</h4>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Technispace Inc. All rights reserved.</p>
          <div style={{ display: 'flex', gap: 20 }}>
            <Link to="/privacy" style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Privacy Policy</Link>
            <Link to="/terms" style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
