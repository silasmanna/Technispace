import { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle2, KeyRound } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
    toast.success('Reset Link Sent', `Password reset instructions sent to ${email}`);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      background: 'var(--bg-base)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 440,
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: 36,
        boxShadow: 'var(--shadow-lg)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: 'rgba(108, 71, 255, 0.12)', color: 'var(--brand-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <KeyRound size={26} />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 8 }}>
            Reset Password
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
            Enter your registered email and we'll send you a secure link to reset your account password.
          </p>
        </div>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <CheckCircle2 size={46} color="var(--accent-teal)" style={{ marginBottom: 14 }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 8 }}>Check Your Inbox</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: 24 }}>
              We've dispatched recovery instructions to <strong>{email}</strong>.
            </p>
            <button className="btn btn-secondary" style={{ width: '100%', marginBottom: 12 }} onClick={() => setSent(false)}>
              Try another email
            </button>
            <Link to="/login" style={{ fontSize: '0.85rem', color: 'var(--brand-primary)', textDecoration: 'none', fontWeight: 600 }}>
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: 20 }}>
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="form-input"
                  placeholder="e.g. emeka@demo.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  id="reset-email-input"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: 20 }} id="reset-submit-btn">
              Send Reset Link
            </button>

            <div style={{ textAlign: 'center' }}>
              <Link to="/login" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                color: 'var(--text-secondary)', fontSize: '0.85rem', textDecoration: 'none',
              }}>
                <ArrowLeft size={14} /> Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
