import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, CheckCircle, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const STEPS = ['Personal Info', 'Identity Document', 'Address Proof', 'Review'];

export default function KycPage() {
  const { user, submitKyc } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [uploads, setUploads] = useState({ idFront: null, idBack: null, addressProof: null });
  const [form, setForm] = useState({
    legalName: user?.name || '',
    dateOfBirth: '',
    nationality: '',
    idType: 'passport',
    idNumber: '',
    address: '',
    city: '',
    state: '',
    postcode: '',
  });

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  if (!user || user.role !== 'landlord') {
    navigate('/');
    return null;
  }

  if (user.kycStatus === 'verified') {
    return (
      <div className="kyc-container">
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--badge-verified-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--badge-verified-text)' }}>
            <ShieldCheck size={36} />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 12 }}>You're KYC Verified!</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>Your identity has been verified. You can list properties on Technispace.</p>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/dashboard/properties/new')}>
            List a Property
          </button>
        </div>
      </div>
    );
  }

  if (user.kycStatus === 'pending') {
    return (
      <div className="kyc-container">
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--badge-pending-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--badge-pending-text)' }}>
            <AlertCircle size={36} />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 12 }}>KYC Under Review</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>
            Your documents were submitted on <strong>{user.kycSubmittedAt}</strong>.
          </p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>
            We typically review within <strong>24–48 hours</strong>. You'll receive an email when approved.
          </p>
          <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
        </div>
      </div>
    );
  }

  const handleUpload = (field) => (e) => {
    const file = e.target.files?.[0];
    if (file) setUploads(u => ({ ...u, [field]: file.name }));
  };

  const handleSubmit = () => {
    const result = submitKyc({ ...form, ...uploads });
    if (result.success) {
      toast.success('KYC Submitted!', 'We\'ll review your documents within 24–48 hours.');
      navigate('/dashboard');
    }
  };

  const isStepValid = () => {
    if (step === 0) return form.legalName && form.dateOfBirth && form.nationality && form.idNumber;
    if (step === 1) return uploads.idFront && uploads.idBack;
    if (step === 2) return uploads.addressProof && form.address && form.city;
    return true;
  };

  return (
    <div className="kyc-container">
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <span className="badge badge-primary" style={{ marginBottom: 12 }}>Landlord Verification</span>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 8 }}>Complete Your KYC</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: 440, margin: '0 auto' }}>
          Verify your identity to start listing properties. This protects tenants and builds trust.
        </p>
      </div>

      {/* Step Indicator */}
      <div className="kyc-steps">
        {STEPS.map((label, i) => (
          <>
            <div className="kyc-step" key={label}>
              <div className={`kyc-step-circle ${i === step ? 'active' : i < step ? 'done' : ''}`}>
                {i < step ? <CheckCircle size={18} /> : i + 1}
              </div>
              <div className={`kyc-step-label ${i === step ? 'active' : i < step ? 'done' : ''}`}>{label}</div>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`kyc-step-line ${i < step ? 'done' : ''}`} key={`line-${i}`} />
            )}
          </>
        ))}
      </div>

      <div className="kyc-card">
        {/* Step 0: Personal Info */}
        {step === 0 && (
          <>
            <h2 className="kyc-title">Personal Information</h2>
            <p className="kyc-subtitle">Enter your legal details exactly as they appear on your ID.</p>

            <div className="form-group">
              <label className="form-label">Legal Full Name</label>
              <input className="form-input" id="kyc-legal-name" placeholder="As on government ID" value={form.legalName} onChange={set('legalName')} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input className="form-input" id="kyc-dob" type="date" value={form.dateOfBirth} onChange={set('dateOfBirth')} />
              </div>
              <div className="form-group">
                <label className="form-label">Nationality</label>
                <input className="form-input" id="kyc-nationality" placeholder="e.g. American" value={form.nationality} onChange={set('nationality')} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">ID Type</label>
                <select className="form-input form-select" id="kyc-id-type" value={form.idType} onChange={set('idType')}>
                  <option value="passport">Passport</option>
                  <option value="drivers_license">Driver's License</option>
                  <option value="national_id">National ID</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">ID Number</label>
                <input className="form-input" id="kyc-id-number" placeholder="Document number" value={form.idNumber} onChange={set('idNumber')} />
              </div>
            </div>
          </>
        )}

        {/* Step 1: Identity Document */}
        {step === 1 && (
          <>
            <h2 className="kyc-title">Upload Identity Document</h2>
            <p className="kyc-subtitle">Upload a clear photo of both sides of your government-issued ID.</p>

            <UploadZone
              label="Front of ID / Passport Photo Page"
              id="kyc-upload-front"
              value={uploads.idFront}
              onChange={handleUpload('idFront')}
            />
            <div style={{ marginTop: 16 }}>
              <UploadZone
                label="Back of ID (if applicable)"
                id="kyc-upload-back"
                value={uploads.idBack}
                onChange={handleUpload('idBack')}
              />
            </div>

            <div style={{ marginTop: 20, padding: '14px 16px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              📋 <strong>Requirements:</strong> JPG, PNG or PDF. Max 10 MB. Document must be fully visible, unobstructed, and in good light.
            </div>
          </>
        )}

        {/* Step 2: Address Proof */}
        {step === 2 && (
          <>
            <h2 className="kyc-title">Proof of Address</h2>
            <p className="kyc-subtitle">Upload a recent utility bill, bank statement, or government letter (within 3 months).</p>

            <UploadZone
              label="Address Proof Document"
              id="kyc-upload-address"
              value={uploads.addressProof}
              onChange={handleUpload('addressProof')}
            />

            <div style={{ marginTop: 24 }}>
              <div className="form-group">
                <label className="form-label">Street Address</label>
                <input className="form-input" id="kyc-address" placeholder="123 Main Street" value={form.address} onChange={set('address')} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input className="form-input" id="kyc-city" placeholder="City" value={form.city} onChange={set('city')} />
                </div>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input className="form-input" id="kyc-state" placeholder="State" value={form.state} onChange={set('state')} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">ZIP / Post Code</label>
                <input className="form-input" id="kyc-postcode" placeholder="00000" value={form.postcode} onChange={set('postcode')} />
              </div>
            </div>
          </>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <>
            <h2 className="kyc-title">Review & Submit</h2>
            <p className="kyc-subtitle">Review your information before submitting for verification.</p>

            {[
              { label: 'Legal Name', value: form.legalName },
              { label: 'Date of Birth', value: form.dateOfBirth },
              { label: 'Nationality', value: form.nationality },
              { label: 'ID Type', value: form.idType.replace('_', ' ').toUpperCase() },
              { label: 'ID Number', value: form.idNumber },
              { label: 'Address', value: `${form.address}, ${form.city}, ${form.state} ${form.postcode}` },
              { label: 'ID Front', value: uploads.idFront || '—' },
              { label: 'ID Back', value: uploads.idBack || '—' },
              { label: 'Address Proof', value: uploads.addressProof || '—' },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-color)', fontSize: '0.88rem' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{label}</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>{value}</span>
              </div>
            ))}

            <div style={{ marginTop: 20, padding: '14px 16px', background: 'rgba(108,71,255,0.08)', border: '1px solid rgba(108,71,255,0.2)', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', color: 'var(--brand-secondary)', lineHeight: 1.6 }}>
              🔒 Your data is encrypted and only used for verification. We never share it with third parties without your consent.
            </div>
          </>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
          {step > 0 && (
            <button className="btn btn-ghost" onClick={() => setStep(s => s - 1)} style={{ flex: 1 }}>
              ← Back
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button
              className="btn btn-primary"
              style={{ flex: 2 }}
              disabled={!isStepValid()}
              onClick={() => setStep(s => s + 1)}
              id={`kyc-next-step-${step}`}
            >
              Continue →
            </button>
          ) : (
            <button
              className="btn btn-primary"
              style={{ flex: 2 }}
              onClick={handleSubmit}
              id="kyc-submit-btn"
            >
              <ShieldCheck size={17} />
              Submit for Verification
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function UploadZone({ label, id, value, onChange }) {
  return (
    <div>
      <label className="form-label" style={{ marginBottom: 8 }}>{label}</label>
      <label htmlFor={id} className="upload-zone" style={{ display: 'block', cursor: 'pointer' }}>
        <input type="file" id={id} accept="image/*,.pdf" style={{ display: 'none' }} onChange={onChange} />
        {value ? (
          <div className="upload-success">
            <CheckCircle size={18} />
            {value}
          </div>
        ) : (
          <>
            <div className="upload-icon"><Upload size={24} /></div>
            <div className="upload-label">Click to upload or drag & drop</div>
            <div className="upload-hint">JPG, PNG, PDF up to 10 MB</div>
          </>
        )}
      </label>
    </div>
  );
}
