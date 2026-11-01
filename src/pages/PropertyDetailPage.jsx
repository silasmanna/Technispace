import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  MapPin, Bed, Bath, Square, Star, ShieldCheck,
  Calendar, MessageSquare, ArrowLeft, Heart,
  Wifi, Car, Dumbbell, Waves, Lock, Phone, Mail, UserCheck, Edit3,
} from 'lucide-react';
import { useProperty } from '../context/PropertyContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useSubscription } from '../context/SubscriptionContext';
import { BOOST_TIERS, formatNaira } from '../lib/pricing';

const AMENITY_ICONS = {
  'WiFi': <Wifi size={15} />,
  'Parking': <Car size={15} />,
  'Gym': <Dumbbell size={15} />,
  'Pool': <Waves size={15} />,
};

export default function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { properties, sendInquiry } = useProperty();
  const { user } = useAuth();
  const { toast } = useToast();
  const { getBoost } = useSubscription();

  const [activeImg, setActiveImg] = useState(0);
  const [inquiryMsg, setInquiryMsg] = useState('');
  const [showInquiryForm, setShowInquiryForm] = useState(false);

  const property = properties.find(p => p.id === id);

  if (!property) {
    return (
      <div style={{ paddingTop: 120, textAlign: 'center' }}>
        <h2>Property not found</h2>
        <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => navigate('/listings')}>
          Back to Listings
        </button>
      </div>
    );
  }

  const boost = getBoost(property.id);
  const boostTier = boost ? BOOST_TIERS[boost.tier] : null;

  const isOwner = Boolean(user && property && user.id === property.landlordId);

  const handleInquiry = (e) => {
    e.preventDefault();
    if (isOwner) {
      navigate(`/dashboard/properties/new?edit=${property.id}`);
      return;
    }
    if (!user) {
      toast.error('Sign in required', 'Please sign in to send an inquiry.');
      navigate('/login');
      return;
    }
    if (user.role !== 'tenant') {
      toast.error('Tenants only', 'Only tenants can send inquiries.');
      return;
    }
    sendInquiry(property.id, property.title, user.id, user.name, property.landlordId, inquiryMsg);
    toast.success('Inquiry Sent!', 'The landlord will respond shortly.');
    setInquiryMsg('');
    setShowInquiryForm(false);
  };

  return (
    <div className="property-detail-page">
      {/* Gallery */}
      <div className="property-gallery">
        {property.images?.[activeImg] && (
          <img src={property.images[activeImg]} alt={property.title} />
        )}
        <div className="property-gallery-overlay" />

        <button
          className="btn btn-ghost btn-sm"
          style={{ position: 'absolute', top: 80, left: 24, zIndex: 10, background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none' }}
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {property.images?.length > 1 && (
          <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, zIndex: 10 }}>
            {property.images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                style={{
                  width: i === activeImg ? 24 : 8,
                  height: 8, borderRadius: 4, border: 'none',
                  background: i === activeImg ? 'white' : 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="container">
        <div className="property-detail-body">
          {/* Main */}
          <div className="property-detail-main">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              {property.landlordVerified && (
                <span className="badge badge-verified">
                  <ShieldCheck size={12} />
                  Verified Landlord
                </span>
              )}
              <span className="badge badge-primary">{property.type?.toUpperCase() || 'RENTAL'}</span>
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 10 }}>{property.title}</h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                <MapPin size={15} color="var(--brand-primary)" />
                {property.address}, {property.city}, {property.state}
              </div>
              {property.rating > 0 && (
                <div className="rating" style={{ fontSize: '0.95rem' }}>
                  <Star size={15} fill="var(--accent-amber)" />
                  {property.rating} ({property.reviews} reviews)
                </div>
              )}
            </div>

            <div className="property-detail-meta">
              <div className="detail-meta-item">
                <span className="detail-meta-label">Bedrooms</span>
                <span className="detail-meta-value">
                  {property.type === 'studio' || property.bedrooms === 0 ? 'Studio' : property.bedrooms}
                </span>
              </div>
              <div className="detail-meta-item">
                <span className="detail-meta-label">Bathrooms</span>
                <span className="detail-meta-value">{property.bathrooms}</span>
              </div>
              {property.toilets && (
                <div className="detail-meta-item">
                  <span className="detail-meta-label">Toilets</span>
                  <span className="detail-meta-value">{property.toilets}</span>
                </div>
              )}
              <div className="detail-meta-item">
                <span className="detail-meta-label">Size</span>
                <span className="detail-meta-value">
                  {property.sizeValue
                    ? `${Number(property.sizeValue).toLocaleString()} ${property.sizeUnit || 'sqm'}`
                    : property.sqft
                    ? `${property.sqft.toLocaleString()} sqft`
                    : '—'}
                </span>
              </div>
              <div className="detail-meta-item">
                <span className="detail-meta-label">Available</span>
                <span className="detail-meta-value">{property.available}</span>
              </div>
              <div className="detail-meta-item">
                <span className="detail-meta-label">Deposit</span>
                <span className="detail-meta-value">${property.deposit.toLocaleString()}</span>
              </div>
            </div>

            {/* Description */}
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 12 }}>About this Property</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 32, fontSize: '0.95rem' }}>
              {property.description}
            </p>

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 16 }}>Amenities</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 32 }}>
                  {property.amenities.map(a => (
                    <div key={a} style={{
                      display: 'flex', alignItems: 'center', gap: 7,
                      padding: '8px 16px',
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      color: 'var(--text-secondary)',
                    }}>
                      {AMENITY_ICONS[a] || <span>✓</span>}
                      {a}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Utilities & Essentials */}
            {(property.runningWater || property.parking || property.landlordOnPremises) && (
              <>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 14 }}>Utilities & Essentials</h2>
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: 12, marginBottom: 32,
                }}>
                  {/* Water */}
                  {property.runningWater && (
                    <UtilityCard
                      emoji="🚿"
                      title="Running Water"
                      status={property.runningWater === 'yes'}
                      lines={[
                        property.runningWater === 'yes' ? 'Available' : 'Not available',
                        property.waterLocation && `Location: ${property.waterLocation}`,
                        property.waterSource && `Source: ${property.waterSource}`,
                        property.hotWater && `Hot water: ${property.hotWater}`,
                      ].filter(Boolean)}
                    />
                  )}
                  {/* Parking */}
                  {property.parking && (
                    <UtilityCard
                      emoji="🚗"
                      title="Parking"
                      status={property.parking === 'yes'}
                      lines={[
                        property.parking === 'yes' ? 'Available' : 'No parking',
                        property.parkingType && `Type: ${property.parkingType}`,
                        property.parkingSpaces > 0 && `${property.parkingSpaces} space${property.parkingSpaces > 1 ? 's' : ''}`,
                      ].filter(Boolean)}
                    />
                  )}
                  {/* Landlord */}
                  {property.landlordOnPremises && (
                    <UtilityCard
                      emoji="👤"
                      title="Landlord Presence"
                      status={!property.landlordOnPremises.startsWith('no')}
                      neutral
                      lines={[
                        property.landlordOnPremises === 'yes_same_floor' ? 'Lives on same floor' :
                        property.landlordOnPremises === 'yes_diff_floor' ? 'Lives in same building' :
                        property.landlordOnPremises === 'yes_compound' ? 'Lives in same compound' :
                        'Does not live on-site',
                      ]}
                    />
                  )}
                </div>
              </>
            )}

            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 16 }}>Meet the Landlord</h2>
            <div style={{
              padding: 24, borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-elevated)', border: '1px solid var(--border-color)',
              marginBottom: 32,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: 'var(--brand-gradient)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: '1rem', fontWeight: 700, color: 'white', flexShrink: 0,
                }}>
                  {property.landlordAvatar}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 4 }}>
                    {user ? property.landlordName : `${property.landlordName?.split(' ')[0]} (Verified Landlord)`}
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {property.landlordVerified && (
                      <span className="badge badge-verified">
                        <ShieldCheck size={11} /> KYC Verified
                      </span>
                    )}
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Direct Landlord</span>
                  </div>
                </div>

                {isOwner ? (
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => navigate(`/dashboard/properties/new?edit=${property.id}`)}
                    id="edit-listing-btn"
                  >
                    <Edit3 size={15} />
                    Edit Listing
                  </button>
                ) : user ? (
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowInquiryForm(true)}
                    id="contact-landlord-btn"
                  >
                    <MessageSquare size={15} />
                    Message Landlord
                  </button>
                ) : (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => navigate('/login')}
                    id="contact-login-btn"
                  >
                    <Lock size={14} />
                    Log in to Message
                  </button>
                )}
              </div>

              {/* Landlord Contact Details Section: Revealed only to logged-in users */}
              {user ? (
                <div style={{
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: 16,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: 12,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                    <Phone size={16} color="var(--accent-teal)" />
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>DIRECT PHONE</div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>{property.landlordPhone || '+234 803 123 4567'}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                    <Mail size={16} color="var(--brand-primary)" />
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>DIRECT EMAIL</div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>{property.landlordEmail || 'landlord@technipal.com.ng'}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 12,
                  background: 'rgba(108, 71, 255, 0.05)',
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-md)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Lock size={18} color="var(--brand-primary)" />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Landlord Contact Info Protected</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Sign in or register free to view phone number, email, and message the landlord directly.
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate('/login')}>Sign In</button>
                    <button className="btn btn-primary btn-sm" onClick={() => navigate('/register')}>Register Free</button>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Booking Sidebar */}
          <div>
            <div className="booking-card">
              {/* Boost badge */}
              {boostTier && (
                <div style={{
                  marginBottom: 16, padding: '8px 12px',
                  background: boostTier.gradient, borderRadius: 'var(--radius-md)',
                  display: 'flex', alignItems: 'center', gap: 6,
                  color: 'white', fontWeight: 700, fontSize: '0.82rem',
                }}>
                  {boostTier.emoji} {boostTier.name} Listing — Boosted for {boost.expiresAt}
                </div>
              )}

              <div className="booking-price">
                {formatNaira(property.price)}<span>/month</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 24 }}>
                + {formatNaira(property.deposit)} refundable deposit
              </div>

              {isOwner ? (
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', marginBottom: 12 }}
                  onClick={() => navigate(`/dashboard/properties/new?edit=${property.id}`)}
                  id="owner-edit-listing-btn"
                >
                  <Edit3 size={16} />
                  Edit Listing
                </button>
              ) : user ? (
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', marginBottom: 12 }}
                  onClick={() => setShowInquiryForm(true)}
                  id="send-inquiry-btn"
                >
                  <MessageSquare size={16} />
                  Send Inquiry to Landlord
                </button>
              ) : (
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', marginBottom: 12 }}
                  onClick={() => navigate('/login')}
                  id="login-to-inquire-btn"
                >
                  <Lock size={16} />
                  Log in to Message Landlord
                </button>
              )}

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 16 }}>
                {[
                  { label: 'Available From', value: property.available },
                  { label: 'Property Size', value: property.sizeValue ? `${property.sizeValue} ${property.sizeUnit || 'sqm'}` : property.sqft ? `${property.sqft} sqft` : '—' },
                  { label: 'Listing ID', value: property.id, mono: true },
                  { label: 'Tenant Registration', value: 'Free 🎉', accent: true },
                ].map(({ label, value, mono, accent }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                    <span>{label}</span>
                    <span style={{ fontWeight: 600, color: accent ? 'var(--accent-teal)' : 'var(--text-primary)', fontFamily: mono ? 'monospace' : 'inherit', fontSize: mono ? '0.75rem' : 'inherit' }}>{value}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 20, padding: '12px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                🛡️ KYC-verified landlord. Negotiate terms, agree on payment, and move in. Tenant browsing is always free.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
      {showInquiryForm && (
        <div className="modal-overlay" onClick={() => setShowInquiryForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Send Inquiry</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowInquiryForm(false)}>✕</button>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 20 }}>
              Message <strong>{property.landlordName}</strong> about <em>{property.title}</em>.
            </p>
            <form onSubmit={handleInquiry}>
              <div className="form-group">
                <label className="form-label">Your Message</label>
                <textarea
                  className="form-input form-textarea"
                  placeholder="Hi! I'm interested in your property. Is it available from…"
                  value={inquiryMsg}
                  onChange={e => setInquiryMsg(e.target.value)}
                  required
                  id="inquiry-message"
                />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowInquiryForm(false)} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }} id="submit-inquiry-btn">
                  <MessageSquare size={16} />
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


    </div>
  );
}

function UtilityCard({ emoji, title, status, neutral, lines }) {
  const color = neutral
    ? 'var(--text-muted)'
    : status
    ? 'var(--accent-teal)'
    : 'var(--accent-rose)';

  return (
    <div style={{
      padding: '16px 18px',
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-md)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: '1.1rem' }}>{emoji}</span>
        <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{title}</span>
        <span style={{
          marginLeft: 'auto',
          width: 8, height: 8, borderRadius: '50%',
          background: color, flexShrink: 0,
        }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {lines.map((line, i) => (
          <span key={i} style={{
            fontSize: '0.8rem',
            color: i === 0 ? color : 'var(--text-secondary)',
            fontWeight: i === 0 ? 600 : 400,
            textTransform: 'capitalize',
          }}>
            {i > 0 ? '· ' : ''}{line}
          </span>
        ))}
      </div>
    </div>
  );
}
