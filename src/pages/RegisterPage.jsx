import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Building2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register, user } = useAuth();
  const { toast } = useToast();

  const defaultRole = searchParams.get('role') === 'landlord' ? 'landlord' : 'tenant';
  const [role, setRole] = useState(defaultRole);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(f => ({ ...f, [field]: val }));
    setErrors(er => ({ ...er, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required.';
    if (!form.email.includes('@')) e.email = 'Enter a valid email.';
    if (form.password.length < 8) e.password = 'Password must be at least 8 characters.';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match.';
    if (!form.agreeTerms) e.agreeTerms = 'You must agree to the terms.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    const result = register({ ...form, role });
    setLoading(false);

    if (result.success) {
      toast.success('Welcome to Technispace!', role === 'landlord'
        ? 'Complete your KYC to start listing properties.'
        : 'Start browsing verified listings now.');
      navigate(role === 'landlord' ? '/kyc' : '/listings');
    } else {
      setErrors({ email: result.error });
    }
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

          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join thousands of landlords and tenants on the platform that skips the middlemen.</p>

          {/* Role Selector */}
          <div className="role-tabs">
            <button
              id="role-tenant"
              className={`role-tab ${role === 'tenant' ? 'active' : ''}`}
              onClick={() => setRole('tenant')}
              type="button"
            >
              🔑 I'm a Tenant
            </button>
            <button
              id="role-landlord"
              className={`role-tab ${role === 'landlord' ? 'active' : ''}`}
              onClick={() => setRole('landlord')}
              type="button"
            >
              🏠 I'm a Landlord
            </button>
          </div>

          {role === 'landlord' && (
            <div style={{
              padding: '12px 16px',
              background: 'rgba(108,71,255,0.08)',
              border: '1px solid rgba(108,71,255,0.2)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.82rem',
              color: 'var(--brand-secondary)',
              marginBottom: 20,
              lineHeight: 1.55,
            }}>
              🛡️ <strong>KYC Required:</strong> Landlords must complete identity verification before listing properties. This keeps our platform safe for tenants.
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-name">Full Name</label>
              <input id="reg-name" className="form-input" type="text" placeholder="Jane Smith" value={form.name} onChange={set('name')} />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Email Address</label>
              <input id="reg-email" className="form-input" type="email" placeholder="jane@email.com" value={form.email} onChange={set('email')} />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-phone">Phone Number</label>
              <input id="reg-phone" className="form-input" type="tel" placeholder="+1 (555) 000-0000" value={form.phone} onChange={set('phone')} />
            </div>

            <div className="form-row">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="reg-password">Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="reg-password"
                    className="form-input"
                    type={showPass ? 'text' : 'password'}
                    placeholder="Min. 8 characters"
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
                {errors.password && <span className="form-error">{errors.password}</span>}
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="reg-confirm">Confirm Password</label>
                <input id="reg-confirm" className="form-input" type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={set('confirmPassword')} />
                {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
              </div>
            </div>

            <div className="form-group" style={{ marginTop: 16 }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <input
                  id="reg-terms"
                  type="checkbox"
                  checked={form.agreeTerms}
                  onChange={set('agreeTerms')}
                  style={{ marginTop: 2, accentColor: 'var(--brand-primary)' }}
                />
                I agree to the{' '}
                <Link to="/terms" style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>Privacy Policy</Link>.
              </label>
              {errors.agreeTerms && <span className="form-error">{errors.agreeTerms}</span>}
            </div>

            <button
              type="submit"
              id="register-submit-btn"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 8 }}
              disabled={loading}
            >
              {loading ? 'Creating Account…' : role === 'landlord' ? 'Create Account & Start KYC' : 'Create Account'}
            </button>
          </form>

          <p className="auth-footer-link">
            Already have an account?{' '}
            <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
