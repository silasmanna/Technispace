import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const { toast } = useToast();

  const [role, setRole] = useState('tenant');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    const result = login(form.email, form.password, role);
    setLoading(false);
    if (result.success) {
      toast.success('Welcome back!', 'You have signed in successfully.');
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  const fillDemo = (demoRole) => {
    const demos = {
      landlord: { email: 'marcus@demo.com', password: 'demo123' },
      tenant: { email: 'sofia@demo.com', password: 'demo123' },
    };
    setRole(demoRole);
    setForm(demos[demoRole]);
    setError('');
  };

  return (
    <div className="auth-page">
      <div className="auth-panel">
        <div className="auth-card">
          <div className="auth-logo">
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--brand-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <Building2 size={16} />
            </div>
            Technispace
          </div>

          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your Technispace account.</p>

          {/* Role Selector */}
          <div className="role-tabs">
            <button id="login-tenant-tab" className={`role-tab ${role === 'tenant' ? 'active' : ''}`} onClick={() => setRole('tenant')} type="button">
              🔑 Tenant
            </button>
            <button id="login-landlord-tab" className={`role-tab ${role === 'landlord' ? 'active' : ''}`} onClick={() => setRole('landlord')} type="button">
              🏠 Landlord
            </button>
          </div>

          {/* Demo Buttons */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              style={{ flex: 1, fontSize: '0.78rem' }}
              onClick={() => fillDemo('tenant')}
              id="demo-tenant-btn"
            >
              Demo Tenant
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              style={{ flex: 1, fontSize: '0.78rem' }}
              onClick={() => fillDemo('landlord')}
              id="demo-landlord-btn"
            >
              Demo Landlord
            </button>
          </div>

          {error && (
            <div style={{
              padding: '12px 16px', borderRadius: 'var(--radius-md)',
              background: 'var(--error-bg)', color: 'var(--error-text)',
              fontSize: '0.85rem', marginBottom: 16,
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email Address</label>
              <input id="login-email" className="form-input" type="email" placeholder="you@email.com" value={form.email} onChange={set('email')} />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">
                Password
                <Link to="/forgot-password" style={{ float: 'right', color: 'var(--brand-primary)', fontSize: '0.8rem', fontWeight: 600 }}>
                  Forgot?
                </Link>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  className="form-input"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={set('password')}
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" id="login-submit-btn" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Signing In…' : 'Sign In'}
            </button>
          </form>

          <p className="auth-footer-link">
            New to Technispace?{' '}
            <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
