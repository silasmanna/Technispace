import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, CheckCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProperty } from '../context/PropertyContext';
import { useToast } from '../context/ToastContext';

const AMENITIES_LIST = [
  'WiFi', 'Parking', 'Gym', 'Pool', 'Rooftop', 'Balcony', 'Doorman',
  'Concierge', 'Laundry', 'Dishwasher', 'Air Conditioning', 'Heating',
  'Pet-Friendly', 'Bike Storage', 'EV Charging', 'Storage', 'Smart Home',
  'Garden', 'Backyard', 'Utilities Included', 'Wine Cellar',
];

const STEPS = ['Basic Info', 'Details & Price', 'Amenities', 'Photos', 'Review'];

const PROPERTY_TYPES = [
  { value: 'studio', label: 'Studio' },
  { value: '1br', label: '1 Bedroom' },
  { value: '2br', label: '2 Bedrooms' },
  { value: '3br', label: '3 Bedrooms' },
  { value: 'loft', label: 'Loft' },
  { value: 'penthouse', label: 'Penthouse' },
  { value: 'house', label: 'House' },
  { value: 'townhouse', label: 'Townhouse' },
];

export default function ListPropertyPage() {
  const { user } = useAuth();
  const { addProperty } = useProperty();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    address: '',
    city: '',
    state: '',
    country: 'USA',
    type: 'studio',
    bedrooms: 0,
    bathrooms: 1,
    sqft: '',
    price: '',
    deposit: '',
    available: '',
    imageUrl: '',
  });

  if (!user || user.role !== 'landlord') {
    navigate('/');
    return null;
  }

  if (user.kycStatus !== 'verified') {
    return (
      <div className="list-property-page">
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '3rem', marginBottom: 20 }}>🛡️</div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 12 }}>KYC Required</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 28, maxWidth: 400, margin: '0 auto 28px' }}>
            You need to complete identity verification before listing properties on Technispace.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => navigate('/kyc')}>Complete KYC</button>
            <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  const set = (field) => (e) => {
    const val = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setForm(f => ({ ...f, [field]: val }));
  };

  const toggleAmenity = (a) => {
    setSelectedAmenities(prev =>
      prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]
    );
  };

  const isStepValid = () => {
    if (step === 0) return form.title && form.address && form.city && form.state;
    if (step === 1) return form.price && form.deposit && form.sqft && form.available;
    return true;
  };

  const handleSubmit = () => {
    const newProp = addProperty(
      {
        ...form,
        amenities: selectedAmenities,
        images: form.imageUrl
          ? [form.imageUrl]
          : ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop'],
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        sqft: Number(form.sqft),
        price: Number(form.price),
        deposit: Number(form.deposit),
      },
      user.id, user.name, user.avatar,
    );
    toast.success('Property Listed!', `${form.title} is now live on Technispace.`);
    navigate('/dashboard');
  };

  const progress = ((step) / (STEPS.length - 1)) * 100;

  return (
    <div className="list-property-page">
      <button className="btn btn-ghost btn-sm" onClick={() => navigate('/dashboard')} style={{ marginBottom: 24, display: 'flex', gap: 6, alignItems: 'center' }}>
        <ArrowLeft size={15} />
        Back to Dashboard
      </button>

      <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 4 }}>List a Property</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 40 }}>
        Complete all steps to publish your listing on Technispace.
      </p>

      {/* Progress */}
      <div className="progress-bar-container">
        <div className="step-indicator">Step {step + 1} of {STEPS.length} — {STEPS[step]}</div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Step Nav Pills */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
        {STEPS.map((label, i) => (
          <button
            key={i}
            onClick={() => i < step && setStep(i)}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              fontWeight: 600,
              border: 'none',
              cursor: i < step ? 'pointer' : 'default',
              background: i === step ? 'var(--brand-gradient)' : i < step ? 'var(--bg-elevated)' : 'transparent',
              color: i === step ? 'white' : i < step ? 'var(--brand-primary)' : 'var(--text-muted)',
              border: `1px solid ${i <= step ? 'transparent' : 'var(--border-color)'}`,
            }}
          >
            {i < step ? '✓ ' : ''}{label}
          </button>
        ))}
      </div>

      <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-xl)', padding: '40px', boxShadow: 'var(--shadow-lg)' }}>

        {/* Step 0: Basic Info */}
        {step === 0 && (
          <>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 8 }}>Basic Information</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>Tell us about your property.</p>

            <div className="form-group">
              <label className="form-label">Property Title *</label>
              <input className="form-input" id="prop-title" placeholder="e.g. Modern 1BR in Downtown Manhattan" value={form.title} onChange={set('title')} />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input form-textarea" id="prop-desc" placeholder="Describe your property — highlight unique features, neighborhood, transit access…" value={form.description} onChange={set('description')} />
            </div>

            <div className="form-group">
              <label className="form-label">Property Type</label>
              <select className="form-input form-select" id="prop-type" value={form.type} onChange={set('type')}>
                {PROPERTY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Street Address *</label>
              <input className="form-input" id="prop-address" placeholder="123 Main Street, Apt 4B" value={form.address} onChange={set('address')} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">City *</label>
                <input className="form-input" id="prop-city" placeholder="New York" value={form.city} onChange={set('city')} />
              </div>
              <div className="form-group">
                <label className="form-label">State *</label>
                <input className="form-input" id="prop-state" placeholder="NY" value={form.state} onChange={set('state')} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Country</label>
              <input className="form-input" id="prop-country" value={form.country} onChange={set('country')} />
            </div>
          </>
        )}

        {/* Step 1: Details & Price */}
        {step === 1 && (
          <>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 8 }}>Property Details & Pricing</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>Set the specifics and pricing for your listing.</p>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Bedrooms</label>
                <select className="form-input form-select" id="prop-beds" value={form.bedrooms} onChange={set('bedrooms')}>
                  <option value={0}>Studio / 0</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4+</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Bathrooms</label>
                <select className="form-input form-select" id="prop-baths" value={form.bathrooms} onChange={set('bathrooms')}>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4+</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Area (sqft) *</label>
              <input className="form-input" id="prop-sqft" type="number" placeholder="850" value={form.sqft} onChange={set('sqft')} min={0} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Monthly Rent (USD) *</label>
                <input className="form-input" id="prop-price" type="number" placeholder="2500" value={form.price} onChange={set('price')} min={0} />
              </div>
              <div className="form-group">
                <label className="form-label">Security Deposit (USD) *</label>
                <input className="form-input" id="prop-deposit" type="number" placeholder="5000" value={form.deposit} onChange={set('deposit')} min={0} />
              </div>
            </div>

            {form.price > 0 && (
              <div className="escrow-card" style={{ marginBottom: 20 }}>
                <div className="escrow-title" style={{ marginBottom: 12, fontSize: '0.9rem' }}>💰 Escrow Fee Preview</div>
                <div className="escrow-breakdown">
                  <div className="escrow-row">
                    <span className="escrow-row-label">Rent Collected</span>
                    <span className="escrow-row-value">${Number(form.price).toLocaleString()}</span>
                  </div>
                  <div className="escrow-row deduction">
                    <span className="escrow-row-label">Platform Fee (5%)</span>
                    <span className="escrow-row-value">−${Math.round(form.price * 0.05).toLocaleString()}</span>
                  </div>
                  <div className="escrow-divider" />
                  <div className="escrow-row net">
                    <span className="escrow-row-label">You Receive</span>
                    <span className="escrow-row-value">${Math.round(form.price * 0.95).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Available From *</label>
              <input className="form-input" id="prop-available" type="date" value={form.available} onChange={set('available')} />
            </div>
          </>
        )}

        {/* Step 2: Amenities */}
        {step === 2 && (
          <>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 8 }}>Amenities</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>Select all amenities available at your property.</p>

            <div className="amenity-grid">
              {AMENITIES_LIST.map(a => (
                <button
                  key={a}
                  id={`amenity-${a.toLowerCase().replace(/\s+/g, '-')}`}
                  className={`amenity-chip ${selectedAmenities.includes(a) ? 'selected' : ''}`}
                  onClick={() => toggleAmenity(a)}
                  type="button"
                >
                  {selectedAmenities.includes(a) && <CheckCircle size={14} />}
                  {a}
                </button>
              ))}
            </div>

            {selectedAmenities.length > 0 && (
              <div style={{ marginTop: 20, padding: '12px 16px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                ✓ {selectedAmenities.length} amenities selected: {selectedAmenities.join(', ')}
              </div>
            )}
          </>
        )}

        {/* Step 3: Photos */}
        {step === 3 && (
          <>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 8 }}>Property Photos</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>Add a main photo URL for your listing (photo upload integration ready for production).</p>

            <div className="form-group">
              <label className="form-label">Main Photo URL</label>
              <input className="form-input" id="prop-image-url" type="url" placeholder="https://images.unsplash.com/…" value={form.imageUrl} onChange={set('imageUrl')} />
              <span className="form-hint">Paste a URL to a high-quality photo of your property. Minimum 800px width recommended.</span>
            </div>

            {form.imageUrl && (
              <div style={{ marginTop: 16, borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: 220 }}>
                <img src={form.imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
              </div>
            )}

            {!form.imageUrl && (
              <div className="upload-zone" style={{ marginTop: 12 }}>
                <div className="upload-icon"><Upload size={24} /></div>
                <div className="upload-label">A default photo will be used if none provided</div>
                <div className="upload-hint">Full file upload support coming in production</div>
              </div>
            )}
          </>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 8 }}>Review Your Listing</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>Everything looks good? Submit to publish.</p>

            {[
              { label: 'Title', value: form.title },
              { label: 'Type', value: form.type },
              { label: 'Address', value: `${form.address}, ${form.city}, ${form.state}` },
              { label: 'Bedrooms', value: form.bedrooms === 0 ? 'Studio' : form.bedrooms },
              { label: 'Bathrooms', value: form.bathrooms },
              { label: 'Area', value: `${form.sqft} sqft` },
              { label: 'Monthly Rent', value: `$${Number(form.price).toLocaleString()}` },
              { label: 'Security Deposit', value: `$${Number(form.deposit).toLocaleString()}` },
              { label: 'Available From', value: form.available },
              { label: 'Amenities', value: selectedAmenities.length > 0 ? selectedAmenities.join(', ') : 'None selected' },
              { label: 'Platform Fee', value: '5% (deducted from your payout)' },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-color)', fontSize: '0.88rem' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{label}</span>
                <span style={{ color: 'var(--text-primary)', textAlign: 'right', maxWidth: '55%' }}>{value}</span>
              </div>
            ))}

            <div style={{ marginTop: 20, padding: '14px 16px', background: 'rgba(108,71,255,0.08)', border: '1px solid rgba(108,71,255,0.2)', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', color: 'var(--brand-secondary)', lineHeight: 1.6 }}>
              🚀 Your listing will be live immediately after submission. You can edit or remove it anytime from your dashboard.
            </div>
          </>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', gap: 12, marginTop: 36 }}>
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
              id={`list-next-${step}`}
            >
              Continue →
            </button>
          ) : (
            <button
              className="btn btn-primary"
              style={{ flex: 2 }}
              onClick={handleSubmit}
              id="submit-listing-btn"
            >
              🚀 Publish Listing
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
