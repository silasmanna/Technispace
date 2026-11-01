import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sun, Moon, Menu, X, Home, Building2, Shield } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const handleLogout = () => {
    logout();
    setAvatarOpen(false);
    navigate('/');
  };

  // Dynamic navigation links based on user role
  const isLandlord = user?.role === 'landlord';
  const isTenant = user?.role === 'tenant';

  const navLinks = isLandlord
    ? [
        { label: 'My Dashboard', path: '/dashboard' },
        { label: 'My Listings', path: '/dashboard' },
        { label: 'List New Property', path: '/dashboard/properties/new' },
        { label: 'Plans & Boosts', path: '/pricing' },
        { label: 'Browse Homes', path: '/listings' },
      ]
    : isTenant
    ? [
        { label: 'Find Homes', path: '/listings' },
        { label: 'Saved Homes', path: '/dashboard' },
        { label: 'How It Works', path: '/how-it-works' },
      ]
    : [
        { label: 'Find Homes', path: '/listings' },
        { label: 'For Landlords', path: '/landlords' },
        { label: 'Listing Plans', path: '/pricing' },
        { label: 'How It Works', path: '/how-it-works' },
      ];

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-inner">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <div className="navbar-logo-icon">
              <Building2 size={18} />
            </div>
            Technispace
          </Link>

          {/* Nav Links */}
          <ul className="navbar-nav">
            {navLinks.map(link => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="navbar-actions">
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              id="theme-toggle-btn"
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {user ? (
              <div style={{ position: 'relative' }}>
                <button
                  id="avatar-btn"
                  onClick={() => setAvatarOpen(o => !o)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <div style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    background: 'var(--brand-gradient)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: 'white',
                  }}>
                    {user.avatar}
                  </div>
                  <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                    {user.name.split(' ')[0]}
                  </span>
                  {user.role === 'landlord' && user.kycStatus === 'verified' && (
                    <Shield size={13} color="var(--accent-teal)" />
                  )}
                </button>

                {avatarOpen && (
                  <>
                    <div
                      style={{ position: 'fixed', inset: 0, zIndex: 999 }}
                      onClick={() => setAvatarOpen(false)}
                    />
                    <div style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '8px',
                      minWidth: 200,
                      boxShadow: 'var(--shadow-lg)',
                      zIndex: 1000,
                    }}>
                      <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border-color)', marginBottom: 6 }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{user.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{user.email}</div>
                        <div style={{ marginTop: 6 }}>
                          <span className={`badge badge-${user.role === 'landlord' ? 'primary' : 'verified'}`}>
                            {user.role === 'landlord' ? '🏠 Landlord' : '🔑 Tenant'}
                          </span>
                        </div>
                      </div>
                      <DropdownLink label="Dashboard" onClick={() => { navigate('/dashboard'); setAvatarOpen(false); }} />
                      {user.role === 'landlord' && (
                        <>
                          <DropdownLink label="My Properties" onClick={() => { navigate('/dashboard/properties'); setAvatarOpen(false); }} />
                          {user.kycStatus !== 'verified' && (
                            <DropdownLink label="Complete KYC" onClick={() => { navigate('/kyc'); setAvatarOpen(false); }} accent />
                          )}
                        </>
                      )}
                      {user.role === 'tenant' && (
                        <DropdownLink label="Saved Homes" onClick={() => { navigate('/dashboard/saved'); setAvatarOpen(false); }} />
                      )}
                      <DropdownLink label="Settings" onClick={() => { navigate('/dashboard/settings'); setAvatarOpen(false); }} />
                      <div style={{ borderTop: '1px solid var(--border-color)', marginTop: 6, paddingTop: 6 }}>
                        <DropdownLink label="Sign Out" onClick={handleLogout} danger />
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function DropdownLink({ label, onClick, accent, danger }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'block',
        width: '100%',
        padding: '9px 12px',
        borderRadius: 'var(--radius-sm)',
        fontSize: '0.88rem',
        fontWeight: 500,
        color: danger ? 'var(--accent-rose)' : accent ? 'var(--brand-primary)' : 'var(--text-secondary)',
        background: 'none',
        border: 'none',
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'all var(--transition-fast)',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
      onMouseLeave={e => e.currentTarget.style.background = 'none'}
    >
      {label}
    </button>
  );
}
