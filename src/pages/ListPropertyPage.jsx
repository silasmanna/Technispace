import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertCircle, Edit3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProperty } from '../context/PropertyContext';
import { useToast } from '../context/ToastContext';
import { useSubscription } from '../context/SubscriptionContext';
import PhotoUploader from '../components/PhotoUploader';
import { saveProperty } from '../lib/firestore';
import { LISTING_PLANS, EXTRA_SLOT_PRICE, UPGRADE_PATHS, formatNaira } from '../lib/pricing';

// ─── Constants ──────────────────────────────────────────────────────────────

const STEPS = ['Basic Info', 'Size & Price', 'Utilities', 'Amenities', 'Photos', 'Review'];

const PROPERTY_TYPES = [
  { value: 'studio', label: 'Studio' },
  { value: '1br', label: '1 Bedroom' },
  { value: '2br', label: '2 Bedrooms' },
  { value: '3br', label: '3 Bedrooms' },
  { value: '4br', label: '4 Bedrooms' },
  { value: '5br+', label: '5+ Bedrooms' },
  { value: 'loft', label: 'Loft' },
  { value: 'penthouse', label: 'Penthouse' },
  { value: 'duplex', label: 'Duplex' },
  { value: 'house', label: 'Full House' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'bungalow', label: 'Bungalow' },
];

const SIZE_UNITS = ['sqft', 'sqm'];

// ─── Amenity Categories ───────────────────────────────────────────────────────
const AMENITY_CATEGORIES = [
  {
    label: '🛋️ Furniture',
    items: [
      'Bed Frame', 'Mattress', 'Wardrobe / Closet', 'Sofa / Couch',
      'Dining Table & Chairs', 'Study Desk & Chair', 'Bookshelf', 'Chest of Drawers',
      'Curtains / Blinds', 'Mirrors',
    ],
  },
  {
    label: '🏠 Kitchen',
    items: [
      'Equipped Kitchen', 'Gas Cooker', 'Electric Cooker / Hob', 'Oven',
      'Kitchen Cabinets', 'Kitchen Sink', 'Exhaust Fan / Hood',
    ],
  },
  {
    label: '🔌 Appliances',
    items: [
      'Refrigerator', 'Washing Machine', 'Tumble Dryer',
      'Microwave', 'Dishwasher', 'Air Conditioner', 'Ceiling Fan(s)',
      'Electric Kettle', 'Toaster', 'Iron & Ironing Board',
      'Television (TV)', 'Cable / Satellite TV',
    ],
  },
  {
    label: '⚡ Infrastructure',
    items: [
      'Prepaid Electricity Meter', 'Generator / Inverter Backup',
      'Solar Panel System', 'Borehole / Private Water',
      'Rooftop Water Tank', 'Street Light Outside', 'Intercom System',
    ],
  },
  {
    label: '🔒 Security',
    items: [
      'CCTV Cameras', 'Security Guard', 'Perimeter Fence / Gate',
      'Electronic Door Lock', 'Smoke Detectors', 'Fire Extinguisher',
      'Burglar-Proof Windows', 'Burglar-Proof Doors',
    ],
  },
  {
    label: '🏊 Building Facilities',
    items: [
      'Elevator / Lift', 'Swimming Pool', 'Gym / Fitness Room',
      'Rooftop Access', 'Balcony / Patio', 'Communal Garden / Lawn',
      'Children\'s Play Area', 'BBQ / Outdoor Area',
      'Laundry Room', 'Bicycle Storage',
    ],
  },
  {
    label: '🌐 Connectivity',
    items: [
      'WiFi / Internet Ready', 'Fibre-Optic Cable Point', 'TV Aerial Point',
    ],
  },
  {
    label: '🐾 Lifestyle',
    items: [
      'Pet-Friendly', 'Smoking Allowed Outdoors', 'EV Charging Point',
      'Visitor Parking', 'Concierge / Reception Desk',
    ],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function ListPropertyPage() {
  const { user } = useAuth();
  const { properties, addProperty, updateProperty } = useProperty();
  const { toast } = useToast();
  const { getLandlordPlan, getMaxListingCapacity, canListProperty, incrementPropertyCount } = useSubscription();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = useParams();

  // Check if we are in edit mode (via /dashboard/properties/edit/:id or ?edit=:id)
  const editId = params.id || searchParams.get('edit');
  const existingProp = editId ? properties.find(p => p.id === editId) : null;
  const isEditing = Boolean(existingProp);

  const currentPlan = user ? getLandlordPlan(user.id) : null;
  const planInfo = currentPlan ? LISTING_PLANS[currentPlan.planId] : null;

  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  // Photos state
  const [photos, setPhotos] = useState(() => {
    if (existingProp?.images) {
      return existingProp.images.map(url => ({
        id: `img-${Math.random()}`,
        url,
        status: 'done',
      }));
    }
    return [];
  });
  const [exteriorIdx, setExteriorIdx] = useState(existingProp?.exteriorPhotoIndex ?? 0);

  // Amenities
  const [selectedAmenities, setSelectedAmenities] = useState(existingProp?.amenities || []);

  // Form data
  const [form, setForm] = useState({
    title: existingProp?.title || '',
    description: existingProp?.description || '',
    propertyType: existingProp?.type || 'studio',
    address: existingProp?.address || '',
    city: existingProp?.city || '',
    state: existingProp?.state || '',
    country: existingProp?.country || 'Nigeria',
    sizeValue: existingProp?.sizeValue ? String(existingProp.sizeValue) : '',
    sizeUnit: existingProp?.sizeUnit || 'sqm',
    bedrooms: existingProp?.bedrooms ?? 0,
    bathrooms: existingProp?.bathrooms ?? 1,
    toilets: existingProp?.toilets ?? 1,
    price: existingProp?.price ? String(existingProp.price) : '',
    deposit: existingProp?.deposit ? String(existingProp.deposit) : '',
    available: existingProp?.available || '',
    runningWater: existingProp?.runningWater || '',
    waterLocation: existingProp?.waterLocation || '',
    waterSource: existingProp?.waterSource || '',
    hotWater: existingProp?.hotWater || '',
    parking: existingProp?.parking || '',
    parkingType: existingProp?.parkingType || '',
    parkingSpaces: existingProp?.parkingSpaces ? String(existingProp.parkingSpaces) : '1',
    landlordOnPremises: existingProp?.landlordOnPremises || '',
  });

  // ── Guards ──────────────────────────────────────────────────────────────────
  if (!user || user.role !== 'landlord') {
    navigate('/');
    return null;
  }

  if (user.kycStatus !== 'verified') {
    return (
      <div className="list-property-page" style={{ textAlign: 'center', paddingTop: 120 }}>
        <div style={{ fontSize: '3rem', marginBottom: 20 }}>🛡️</div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 12 }}>KYC Required</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: 400, margin: '0 auto 28px' }}>
          Complete identity verification before listing any property.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={() => navigate('/kyc')}>Complete KYC</button>
          <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>Dashboard</button>
        </div>
      </div>
    );
  }

  if (!currentPlan && !isEditing) {
    return (
      <div className="list-property-page" style={{ textAlign: 'center', paddingTop: 80, paddingBottom: 80, maxWidth: 560 }}>
        <div style={{ fontSize: '3rem', marginBottom: 20 }}>💳</div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 12 }}>Listing Plan Required</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: 400, margin: '0 auto 20px' }}>
          Purchase a listing plan to publish properties on Technispace. Plans start from{' '}
          <strong>₦10,000</strong> for a single listing (30 days).
        </p>
        <div style={{
          background: 'var(--card-bg)', border: '1px solid var(--card-border)',
          borderRadius: 'var(--radius-xl)', padding: '24px', marginBottom: 28, textAlign: 'left',
        }}>
          {Object.values(LISTING_PLANS).map(plan => (
            <div key={plan.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 0', borderBottom: '1px solid var(--border-color)',
            }}>
              <div>
                <div style={{ fontWeight: 700 }}>{plan.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{plan.description}</div>
              </div>
              <div style={{ fontWeight: 900, fontSize: '1rem', color: 'var(--brand-primary)', whiteSpace: 'nowrap', marginLeft: 16 }}>
                {formatNaira(plan.price)}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/pricing')}>View Listing Plans</button>
          <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>Dashboard</button>
        </div>
      </div>
    );
  }

  // Quota guard: if landlord reached their listing limit and is adding a new property
  const myProperties = properties.filter(p => p.landlordId === user.id);
  const currentCapacity = getMaxListingCapacity(user.id);
  const isCapacityExhausted = !isEditing && currentCapacity !== Infinity && myProperties.length >= currentCapacity;

  if (isCapacityExhausted) {
    const nextUpgradeId = UPGRADE_PATHS[currentPlan.planId];
    const nextPlan = nextUpgradeId ? LISTING_PLANS[nextUpgradeId] : null;

    return (
      <div className="list-property-page" style={{ textAlign: 'center', paddingTop: 80, paddingBottom: 80, maxWidth: 600 }}>
        <div style={{ fontSize: '3rem', marginBottom: 20 }}>📊</div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 12 }}>Listing Capacity Reached</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto 24px', lineHeight: 1.6 }}>
          You have active listings using all <strong>{currentCapacity} available slots</strong> ({planInfo?.name} + {currentPlan.extraSlots || 0} extra slots).
          To list additional properties, you can upgrade your plan or purchase an extra listing slot for {formatNaira(EXTRA_SLOT_PRICE)}.
        </p>

        <div style={{
          background: 'var(--card-bg)', border: '1px solid var(--card-border)',
          borderRadius: 'var(--radius-xl)', padding: '24px 28px', marginBottom: 32, textAlign: 'left',
          display: 'flex', flexDirection: 'column', gap: 14,
        }}>
          {nextPlan && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 14, borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Upgrade to {nextPlan.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Expand capacity to {nextPlan.maxProperties === Infinity ? 'Unlimited' : `up to ${nextPlan.maxProperties}`} properties
                </div>
              </div>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate(`/checkout?type=plan&id=${nextPlan.id}`)}
              >
                Upgrade ({formatNaira(nextPlan.price)})
              </button>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Buy Additional Listing Slot</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Add +1 property slot for {formatNaira(EXTRA_SLOT_PRICE)} without jumping full tiers
              </div>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => navigate('/checkout?type=slot&count=1')}
            >
              Add +1 Slot ({formatNaira(EXTRA_SLOT_PRICE)})
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const set = (field) => (e) => {
    const val = e.target.type === 'number' ? e.target.value : e.target.value;
    setForm(f => ({ ...f, [field]: val }));
  };

  const toggleAmenity = (a) =>
    setSelectedAmenities(prev =>
      prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]
    );

  const donePhotos = photos.filter(p => p.status === 'done');
  const uploadingPhotos = photos.filter(p => p.status === 'uploading' || p.status === 'pending');

  const stepValid = () => {
    if (step === 0) return form.title && form.address && form.city && form.state && form.country;
    if (step === 1) return form.sizeValue && form.price && form.deposit && form.available;
    if (step === 2)
      return (
        form.runningWater &&
        (form.runningWater === 'no' || (form.waterLocation && form.waterSource)) &&
        form.parking &&
        (form.parking === 'no' || form.parkingType) &&
        form.landlordOnPremises
      );
    if (step === 3) return true; // amenities optional
    if (step === 4)
      return (
        donePhotos.length >= 3 &&
        exteriorIdx !== null &&
        photos[exteriorIdx]?.status === 'done' &&
        uploadingPhotos.length === 0
      );
    return true;
  };

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setSaving(true);
    try {
      const imageUrls = donePhotos.map(p => p.url);
      const exteriorUrl = exteriorIdx !== null ? photos[exteriorIdx]?.url : imageUrls[0];

      const propertyData = {
        title: form.title,
        description: form.description,
        type: form.propertyType,
        address: form.address,
        city: form.city,
        state: form.state,
        country: form.country,
        sizeValue: Number(form.sizeValue),
        sizeUnit: form.sizeUnit,
        sqft: form.sizeUnit === 'sqm'
          ? Math.round(Number(form.sizeValue) * 10.764)
          : Number(form.sizeValue),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        toilets: Number(form.toilets),
        price: Number(form.price),
        deposit: Number(form.deposit),
        available: form.available,
        // Utilities
        runningWater: form.runningWater,
        waterLocation: form.waterLocation || null,
        waterSource: form.waterSource || null,
        hotWater: form.hotWater || null,
        parking: form.parking,
        parkingType: form.parkingType || null,
        parkingSpaces: form.parking === 'yes' ? Number(form.parkingSpaces) : 0,
        landlordOnPremises: form.landlordOnPremises,
        // Amenities & photos
        amenities: selectedAmenities,
        images: imageUrls,
        exteriorPhoto: exteriorUrl,
        exteriorPhotoIndex: exteriorIdx,
      };

      if (isEditing) {
        // Update existing listing
        await updateProperty(existingProp.id, propertyData);
        toast.success('Listing Updated! ✨', `${form.title} has been updated.`);
        navigate(`/listings/${existingProp.id}`);
      } else {
        // Persist to Firestore (no-op in demo mode)
        const firestoreId = await saveProperty({
          ...propertyData,
          landlordId: user.id,
          landlordName: user.name,
          status: 'active',
        });

        // Add to local context
        await addProperty(propertyData, user.id, user.name, user.avatar);

        // Track property usage against listing plan
        incrementPropertyCount(user.id);

        toast.success('Property Listed! 🎉', `${form.title} is now live on Technispace.`);
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error('Submission failed', err.message);
    } finally {
      setSaving(false);
    }
  };

  const progress = (step / (STEPS.length - 1)) * 100;

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="list-property-page">
      <button className="btn btn-ghost btn-sm" onClick={() => navigate(isEditing ? `/listings/${existingProp.id}` : '/dashboard')}
        style={{ marginBottom: 24, display: 'flex', gap: 6, alignItems: 'center' }}>
        <ArrowLeft size={15} /> {isEditing ? 'Back to Property' : 'Back to Dashboard'}
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {isEditing && <Edit3 size={24} color="var(--brand-primary)" />}
        <h1 style={{ fontSize: '2rem', fontWeight: 900, margin: 0 }}>
          {isEditing ? 'Edit Property Listing' : 'List a Property'}
        </h1>
      </div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 32, marginTop: 6 }}>
        {isEditing ? `Editing "${existingProp.title}". Update details, photos, or pricing.` : 'Complete all steps to publish your verified listing.'}
      </p>

      {/* Progress bar */}
      <div className="progress-bar-container">
        <div className="step-indicator">Step {step + 1} of {STEPS.length} — {STEPS[step]}</div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Step pills */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
        {STEPS.map((label, i) => (
          <button
            key={i}
            onClick={() => i < step && setStep(i)}
            style={{
              padding: '6px 14px', borderRadius: 'var(--radius-full)',
              fontSize: '0.78rem', fontWeight: 600, border: 'none',
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

      <div style={{
        background: 'var(--card-bg)', border: '1px solid var(--card-border)',
        borderRadius: 'var(--radius-xl)', padding: '40px', boxShadow: 'var(--shadow-lg)',
      }}>

        {/* ── STEP 0: Basic Info ─────────────────────────────────────────────── */}
        {step === 0 && (
          <>
            <StepHeader title="Basic Information" subtitle="Tell us about your property." />

            <div className="form-group">
              <label className="form-label">Property Title *</label>
              <input className="form-input" id="prop-title" value={form.title} onChange={set('title')}
                placeholder="e.g. Spacious 2-Bedroom Flat in Lekki Phase 1" />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input form-textarea" id="prop-desc" value={form.description}
                onChange={set('description')}
                placeholder="Describe your property — highlight unique features, neighbourhood, transport links, what makes it special…" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Property Type *</label>
                <select className="form-input form-select" id="prop-type" value={form.propertyType} onChange={set('propertyType')}>
                  {PROPERTY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Country *</label>
                <input className="form-input" id="prop-country" value={form.country} onChange={set('country')} placeholder="Nigeria" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Street Address *</label>
              <input className="form-input" id="prop-address" value={form.address} onChange={set('address')}
                placeholder="12 Admiralty Way, Apartment 3B" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">City *</label>
                <input className="form-input" id="prop-city" value={form.city} onChange={set('city')} placeholder="Lagos" />
              </div>
              <div className="form-group">
                <label className="form-label">State *</label>
                <input className="form-input" id="prop-state" value={form.state} onChange={set('state')} placeholder="Lagos State" />
              </div>
            </div>
          </>
        )}

        {/* ── STEP 1: Size & Price ───────────────────────────────────────────── */}
        {step === 1 && (
          <>
            <StepHeader title="Size & Pricing" subtitle="Set exact measurements and pricing." />

            {/* Size — required */}
            <div style={{
              padding: '16px 20px', background: 'rgba(108,71,255,0.06)',
              border: '1px solid rgba(108,71,255,0.2)', borderRadius: 'var(--radius-md)', marginBottom: 24,
            }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--brand-secondary)', marginBottom: 4 }}>
                📐 Property Size is Required
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                Accurate size information helps tenants make informed decisions and makes your listing more trustworthy.
              </p>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Property Size *</label>
                <input className="form-input" id="prop-size" type="number" min="1"
                  value={form.sizeValue} onChange={set('sizeValue')}
                  placeholder="e.g. 85" />
              </div>
              <div className="form-group">
                <label className="form-label">Unit *</label>
                <select className="form-input form-select" id="prop-size-unit" value={form.sizeUnit} onChange={set('sizeUnit')}>
                  <option value="sqm">Square Metres (sqm)</option>
                  <option value="sqft">Square Feet (sqft)</option>
                </select>
              </div>
            </div>

            {form.sizeValue && (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: -12, marginBottom: 20 }}>
                ≈ {form.sizeUnit === 'sqm'
                  ? `${Math.round(Number(form.sizeValue) * 10.764).toLocaleString()} sqft`
                  : `${Math.round(Number(form.sizeValue) / 10.764).toLocaleString()} sqm`}
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Bedrooms</label>
                <select className="form-input form-select" id="prop-beds" value={form.bedrooms} onChange={set('bedrooms')}>
                  <option value={0}>Studio / 0</option>
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Bathrooms</label>
                <select className="form-input form-select" id="prop-baths" value={form.bathrooms} onChange={set('bathrooms')}>
                  {[1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Toilets</label>
                <select className="form-input form-select" id="prop-toilets" value={form.toilets} onChange={set('toilets')}>
                  {[1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Monthly Rent (₦ or $) *</label>
                <input className="form-input" id="prop-price" type="number" min="0"
                  value={form.price} onChange={set('price')} placeholder="e.g. 150000" />
              </div>
              <div className="form-group">
                <label className="form-label">Security Deposit *</label>
                <input className="form-input" id="prop-deposit" type="number" min="0"
                  value={form.deposit} onChange={set('deposit')} placeholder="e.g. 300000" />
              </div>
            </div>

            {/* Rent direct note */}
            {form.price > 0 && (
              <div style={{
                background: 'rgba(108,71,255,0.06)', border: '1px solid rgba(108,71,255,0.2)',
                borderRadius: 'var(--radius-lg)', padding: '16px 20px', marginBottom: 20,
              }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--brand-primary)', marginBottom: 4 }}>
                  🛡️ Direct Landlord-Tenant Rent
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Tenants pay rent directly to you. Rent payments are handled 100% between you and your tenant.
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Available From *</label>
              <input className="form-input" id="prop-available" type="date"
                value={form.available} onChange={set('available')} />
            </div>
          </>
        )}

        {/* ── STEP 2: Utilities & Essentials ────────────────────────────────── */}
        {step === 2 && (
          <>
            <StepHeader title="Utilities & Essentials" subtitle="Tenants rely on this information before applying." />

            {/* Running Water */}
            <FieldSection title="🚿 Running Water" required>
              <RadioGroup
                name="runningWater"
                value={form.runningWater}
                onChange={val => setForm(f => ({ ...f, runningWater: val, waterLocation: '', waterSource: '' }))}
                options={[
                  { value: 'yes', label: 'Yes — Water is available' },
                  { value: 'no', label: 'No — No running water' },
                ]}
              />

              {form.runningWater === 'yes' && (
                <>
                  <div style={{ marginTop: 16, marginBottom: 8 }}>
                    <label className="form-label">Water Location *</label>
                    <RadioGroup
                      name="waterLocation"
                      value={form.waterLocation}
                      onChange={val => setForm(f => ({ ...f, waterLocation: val }))}
                      options={[
                        { value: 'inside', label: 'Inside the apartment (private bathroom / kitchen tap)' },
                        { value: 'outside', label: 'Outside / Shared (communal tap or borehole)' },
                        { value: 'both', label: 'Both — inside & shared communal access' },
                      ]}
                    />
                  </div>

                  <div style={{ marginTop: 16, marginBottom: 8 }}>
                    <label className="form-label">Water Source *</label>
                    <RadioGroup
                      name="waterSource"
                      value={form.waterSource}
                      onChange={val => setForm(f => ({ ...f, waterSource: val }))}
                      options={[
                        { value: 'municipal', label: 'Municipal / Government supply' },
                        { value: 'borehole', label: 'Borehole (private)' },
                        { value: 'well', label: 'Well water' },
                        { value: 'tanker', label: 'Water tanker delivery' },
                        { value: 'other', label: 'Other source' },
                      ]}
                    />
                  </div>

                  <div style={{ marginTop: 16 }}>
                    <label className="form-label">Hot Water Available?</label>
                    <RadioGroup
                      name="hotWater"
                      value={form.hotWater}
                      onChange={val => setForm(f => ({ ...f, hotWater: val }))}
                      options={[
                        { value: 'yes', label: 'Yes — Hot water available' },
                        { value: 'no', label: 'No — Cold water only' },
                      ]}
                    />
                  </div>
                </>
              )}
            </FieldSection>

            {/* Parking */}
            <FieldSection title="🚗 Parking Space" required>
              <RadioGroup
                name="parking"
                value={form.parking}
                onChange={val => setForm(f => ({ ...f, parking: val, parkingType: '' }))}
                options={[
                  { value: 'yes', label: 'Yes — Parking available' },
                  { value: 'no', label: 'No — No dedicated parking' },
                ]}
              />

              {form.parking === 'yes' && (
                <>
                  <div style={{ marginTop: 16, marginBottom: 8 }}>
                    <label className="form-label">Parking Type *</label>
                    <RadioGroup
                      name="parkingType"
                      value={form.parkingType}
                      onChange={val => setForm(f => ({ ...f, parkingType: val }))}
                      options={[
                        { value: 'covered', label: 'Covered / Garage parking' },
                        { value: 'open', label: 'Open compound parking' },
                        { value: 'street', label: 'On-street parking nearby' },
                      ]}
                    />
                  </div>
                  <div className="form-group" style={{ marginTop: 16, maxWidth: 200 }}>
                    <label className="form-label">Number of Spaces</label>
                    <select className="form-input form-select" id="parking-spaces"
                      value={form.parkingSpaces} onChange={set('parkingSpaces')}>
                      {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                </>
              )}
            </FieldSection>

            {/* Landlord on premises */}
            <FieldSection title="👤 Landlord Presence" required>
              <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.55 }}>
                Does the landlord live in the same building or compound? Tenants have the right to know.
              </p>
              <RadioGroup
                name="landlordOnPremises"
                value={form.landlordOnPremises}
                onChange={val => setForm(f => ({ ...f, landlordOnPremises: val }))}
                options={[
                  { value: 'yes_same_floor', label: 'Yes — Same floor / building (same staircase)' },
                  { value: 'yes_diff_floor', label: 'Yes — Same building, different floor' },
                  { value: 'yes_compound', label: 'Yes — Same compound / estate, separate unit' },
                  { value: 'no', label: 'No — Landlord does not live on-site' },
                ]}
              />
            </FieldSection>
          </>
        )}

        {/* ── STEP 3: Amenities ─────────────────────────────────────────────── */}
        {step === 3 && (
          <>
            <StepHeader
              title="What's in the Property?"
              subtitle="Select everything available. The more detail, the more inquiries you'll get."
            />

            {AMENITY_CATEGORIES.map(cat => (
              <div key={cat.label} style={{ marginBottom: 28 }}>
                <div style={{
                  fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.9rem',
                  marginBottom: 12, color: 'var(--text-primary)',
                }}>
                  {cat.label}
                </div>
                <div className="amenity-grid">
                  {cat.items.map(a => (
                    <button
                      key={a}
                      id={`amenity-${a.toLowerCase().replace(/[\s/]+/g, '-')}`}
                      className={`amenity-chip ${selectedAmenities.includes(a) ? 'selected' : ''}`}
                      onClick={() => toggleAmenity(a)}
                      type="button"
                    >
                      {selectedAmenities.includes(a) && <CheckCircle size={13} />}
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {selectedAmenities.length > 0 && (
              <div style={{
                padding: '12px 16px', background: 'var(--badge-verified-bg)',
                borderRadius: 'var(--radius-md)', fontSize: '0.82rem', color: 'var(--badge-verified-text)',
              }}>
                ✓ {selectedAmenities.length} item{selectedAmenities.length > 1 ? 's' : ''} selected
              </div>
            )}
          </>
        )}

        {/* ── STEP 4: Photos ────────────────────────────────────────────────── */}
        {step === 4 && (
          <>
            <StepHeader
              title="Property Photos"
              subtitle="Minimum 3, maximum 10. At least one must be the full exterior / building photo."
            />
            <PhotoUploader
              photos={photos}
              onChange={setPhotos}
              exteriorIdx={exteriorIdx}
              onExteriorChange={setExteriorIdx}
            />
          </>
        )}

        {/* ── STEP 5: Review ────────────────────────────────────────────────── */}
        {step === 5 && (
          <>
            <StepHeader title="Review & Publish" subtitle="Double-check everything before going live." />

            <ReviewSection title="📋 Basic Info">
              <ReviewRow label="Title" value={form.title} />
              <ReviewRow label="Type" value={form.propertyType} />
              <ReviewRow label="Address" value={`${form.address}, ${form.city}, ${form.state}, ${form.country}`} />
            </ReviewSection>

            <ReviewSection title="📐 Size & Pricing">
              <ReviewRow label="Size" value={`${form.sizeValue} ${form.sizeUnit}`} />
              <ReviewRow label="Bedrooms" value={form.bedrooms === 0 ? 'Studio' : form.bedrooms} />
              <ReviewRow label="Bathrooms / Toilets" value={`${form.bathrooms} / ${form.toilets}`} />
              <ReviewRow label="Monthly Rent" value={`₦${Number(form.price).toLocaleString()}`} />
              <ReviewRow label="Security Deposit" value={`₦${Number(form.deposit).toLocaleString()}`} />
              <ReviewRow label="Available From" value={form.available} />
            </ReviewSection>

            <ReviewSection title="🚿 Utilities">
              <ReviewRow label="Running Water" value={form.runningWater} />
              {form.waterLocation && <ReviewRow label="Water Location" value={form.waterLocation} />}
              {form.waterSource && <ReviewRow label="Water Source" value={form.waterSource} />}
              {form.hotWater && <ReviewRow label="Hot Water" value={form.hotWater} />}
              <ReviewRow label="Parking" value={form.parking} />
              {form.parkingType && <ReviewRow label="Parking Type" value={form.parkingType} />}
              {form.parking === 'yes' && <ReviewRow label="Parking Spaces" value={form.parkingSpaces} />}
              <ReviewRow label="Landlord on Premises" value={form.landlordOnPremises?.replace(/_/g, ' ')} />
            </ReviewSection>

            <ReviewSection title="🏠 Amenities">
              <ReviewRow
                label={`${selectedAmenities.length} items selected`}
                value={selectedAmenities.length > 0 ? selectedAmenities.join(', ') : 'None'}
              />
            </ReviewSection>

            <ReviewSection title="📸 Photos">
              <ReviewRow label="Photos uploaded" value={`${donePhotos.length}`} />
              <ReviewRow label="Exterior photo" value={exteriorIdx !== null ? `Photo #${exteriorIdx + 1}` : '—'} />
            </ReviewSection>

            {/* Photo preview strip */}
            {donePhotos.length > 0 && (
              <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 20 }}>
                {donePhotos.map((p, i) => (
                  <img key={i} src={p.url} alt={`Preview ${i + 1}`}
                    style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 8, flexShrink: 0,
                      border: exteriorIdx === i ? '2px solid var(--brand-primary)' : '1px solid var(--border-color)',
                    }}
                  />
                ))}
              </div>
            )}

            <div style={{
              padding: '14px 16px', background: 'rgba(108,71,255,0.07)',
              border: '1px solid rgba(108,71,255,0.2)', borderRadius: 'var(--radius-md)',
              fontSize: '0.82rem', color: 'var(--brand-secondary)', lineHeight: 1.6,
            }}>
              🚀 Your listing goes live immediately. You can edit or remove it anytime from your dashboard.
            </div>
          </>
        )}

        {/* ── Navigation ───────────────────────────────────────────────────── */}
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
              disabled={!stepValid()}
              onClick={() => setStep(s => s + 1)}
              id={`list-next-step-${step}`}
            >
              Continue →
            </button>
          ) : (
            <button
              className="btn btn-primary"
              style={{ flex: 2 }}
              onClick={handleSubmit}
              disabled={saving}
              id="submit-listing-btn"
            >
              {saving ? '⏳ Publishing…' : '🚀 Publish Listing'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StepHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 6 }}>{title}</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>{subtitle}</p>
    </div>
  );
}

function FieldSection({ title, children, required }) {
  return (
    <div style={{
      marginBottom: 28, padding: '20px 24px',
      background: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-color)',
    }}>
      <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1rem', marginBottom: 14 }}>
        {title}
        {required && <span style={{ color: 'var(--accent-rose)', marginLeft: 4, fontSize: '0.85rem' }}>*</span>}
      </div>
      {children}
    </div>
  );
}

function RadioGroup({ name, value, onChange, options }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {options.map(opt => (
        <label key={opt.value} style={{
          display: 'flex', alignItems: 'flex-start', gap: 10,
          cursor: 'pointer', padding: '10px 14px',
          borderRadius: 'var(--radius-md)',
          border: `1.5px solid ${value === opt.value ? 'var(--brand-primary)' : 'var(--border-color)'}`,
          background: value === opt.value ? 'rgba(108,71,255,0.07)' : 'var(--bg-surface)',
          transition: 'all 0.15s ease',
        }}>
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            style={{ marginTop: 2, accentColor: 'var(--brand-primary)', flexShrink: 0 }}
          />
          <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            {opt.label}
          </span>
          {value === opt.value && (
            <CheckCircle size={16} color="var(--brand-primary)" style={{ marginLeft: 'auto', flexShrink: 0 }} />
          )}
        </label>
      ))}
    </div>
  );
}

function ReviewSection({ title, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.9rem', marginBottom: 8, color: 'var(--text-secondary)' }}>
        {title}
      </div>
      <div style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}

function ReviewRow({ label, value, accent }) {
  const colors = { teal: 'var(--accent-teal)', rose: 'var(--accent-rose)' };
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      padding: '9px 14px', borderBottom: '1px solid var(--border-color)',
      fontSize: '0.85rem',
    }}>
      <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{label}</span>
      <span style={{
        color: accent ? colors[accent] : 'var(--text-primary)',
        fontWeight: 600, textAlign: 'right', maxWidth: '60%',
      }}>
        {String(value)}
      </span>
    </div>
  );
}
