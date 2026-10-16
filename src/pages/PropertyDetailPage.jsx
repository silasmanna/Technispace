import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  MapPin, Bed, Bath, Square, Star, ShieldCheck,
  Calendar, MessageSquare, ArrowLeft, Heart,
  Wifi, Car, Dumbbell, Waves, Lock,
} from 'lucide-react';
import { useProperty } from '../context/PropertyContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const AMENITY_ICONS = {
  'WiFi': <Wifi size={15} />,
  'Parking': <Car size={15} />,
  'Gym': <Dumbbell size={15} />,
  'Pool': <Waves size={15} />,
};

export default function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { properties, sendInquiry, initiateEscrow } = useProperty();
  const { user } = useAuth();
  const { toast } = useToast();

  const [activeImg, setActiveImg] = useState(0);
  const [inquiryMsg, setInquiryMsg] = useState('');
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [showEscrow, setShowEscrow] = useState(false);
  const [escrowConfirmed, setEscrowConfirmed] = useState(false);

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

  const fee = Math.round(property.price * 0.05);
  const landlordGets = property.price - fee;

  const handleInquiry = (e) => {
    e.preventDefault();
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

  const handleEscrow = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'tenant') {
      toast.error('Tenants only', 'Only tenants can initiate payments.');
      return;
    }
    initiateEscrow(
      property.id, user.id, user.name,
      property.landlordId, property.landlordName,
      property.price, property.deposit,
    );
    setEscrowConfirmed(true);
    setShowEscrow(false);
    toast.success('Payment Secured!', 'Funds are now held in escrow. The landlord will be notified.');
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
              <div className="detail-meta-item">
                <span className="detail-meta-label">Area</span>
                <span className="detail-meta-value">{property.sqft.toLocaleString()} sqft</span>
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

            {/* Landlord Profile */}
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 16 }}>Meet the Landlord</h2>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 16,
              padding: 20, borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-elevated)', border: '1px solid var(--border-color)',
              marginBottom: 32,
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'var(--brand-gradient)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: '1rem', fontWeight: 700, color: 'white',
              }}>
                {property.landlordAvatar}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 4 }}>{property.landlordName}</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {property.landlordVerified && (
                    <span className="badge badge-verified">
                      <ShieldCheck size={11} /> KYC Verified
                    </span>
                  )}
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Direct Landlord</span>
                </div>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setShowInquiryForm(true)}
                id="contact-landlord-btn"
              >
                <MessageSquare size={15} />
                Message
              </button>
            </div>

            {/* Escrow Explainer */}
            <div className="escrow-card">
              <div className="escrow-header">
                <span className="escrow-title">🔒 Secure Escrow Payment</span>
                <Lock size={18} color="var(--escrow-text)" />
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.65 }}>
                Your rent payment is held securely in our escrow system. The landlord receives the funds only after confirmation,
                with our 5% platform fee already deducted from the landlord — not from you.
              </p>
              <div className="escrow-breakdown">
                <div className="escrow-row">
                  <span className="escrow-row-label">Monthly Rent</span>
                  <span className="escrow-row-value">${property.price.toLocaleString()}</span>
                </div>
                <div className="escrow-row">
                  <span className="escrow-row-label">You Pay</span>
                  <span className="escrow-row-value" style={{ color: 'var(--accent-teal)' }}>${property.price.toLocaleString()}</span>
                </div>
                <div className="escrow-divider" />
                <div className="escrow-row deduction">
                  <span className="escrow-row-label">Platform Fee (5%) — from landlord</span>
                  <span className="escrow-row-value">−${fee.toLocaleString()}</span>
                </div>
                <div className="escrow-row net">
                  <span className="escrow-row-label">Landlord Receives</span>
                  <span className="escrow-row-value">${landlordGets.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div>
            <div className="booking-card">
              <div className="booking-price">
                ${property.price.toLocaleString()}<span>/month</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 24 }}>
                + ${property.deposit.toLocaleString()} refundable deposit
              </div>

              {escrowConfirmed ? (
                <div style={{
                  padding: '16px', borderRadius: 'var(--radius-md)',
                  background: 'var(--success-bg)', color: 'var(--success-text)',
                  fontWeight: 600, textAlign: 'center', marginBottom: 16,
                }}>
                  ✓ Payment Secured in Escrow
                </div>
              ) : (
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', marginBottom: 12 }}
                  onClick={() => {
                    if (!user) { navigate('/login'); return; }
                    setShowEscrow(true);
                  }}
                  id="secure-payment-btn"
                >
                  🔒 Secure with Escrow
                </button>
              )}

              <button
                className="btn btn-ghost"
                style={{ width: '100%', marginBottom: 20 }}
                onClick={() => {
                  if (!user) { navigate('/login'); return; }
                  setShowInquiryForm(true);
                }}
                id="send-inquiry-btn"
              >
                <MessageSquare size={16} />
                Send Inquiry
              </button>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                  <span>Available From</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{property.available}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                  <span>Listing ID</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'monospace' }}>{property.id}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <span>Tenant Fee</span>
                  <span style={{ fontWeight: 700, color: 'var(--accent-teal)' }}>$0 — Free!</span>
                </div>
              </div>

              <div style={{ marginTop: 20, padding: '12px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                🛡️ This landlord is KYC-verified. Your payment is protected by Technispace Escrow.
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

      {/* Escrow Confirmation Modal */}
      {showEscrow && (
        <div className="modal-overlay" onClick={() => setShowEscrow(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">🔒 Confirm Escrow Payment</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowEscrow(false)}>✕</button>
            </div>

            <div className="escrow-card" style={{ marginBottom: 20 }}>
              <div className="escrow-breakdown">
                <div className="escrow-row">
                  <span className="escrow-row-label">Monthly Rent</span>
                  <span className="escrow-row-value">${property.price.toLocaleString()}</span>
                </div>
                <div className="escrow-row">
                  <span className="escrow-row-label">Deposit</span>
                  <span className="escrow-row-value">${property.deposit.toLocaleString()}</span>
                </div>
                <div className="escrow-divider" />
                <div className="escrow-row">
                  <span className="escrow-row-label" style={{ fontWeight: 700 }}>Total Charged to You</span>
                  <span className="escrow-row-value" style={{ color: 'var(--accent-teal)', fontSize: '1.1rem' }}>
                    ${(property.price + property.deposit).toLocaleString()}
                  </span>
                </div>
                <div className="escrow-divider" />
                <div className="escrow-row deduction">
                  <span className="escrow-row-label">Platform fee (from landlord)</span>
                  <span className="escrow-row-value">−${fee.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.65 }}>
              By confirming, your payment will be held securely in Technispace Escrow. Funds are released to the landlord within 5 business days after move-in confirmation.
            </p>

            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-ghost" onClick={() => setShowEscrow(false)} style={{ flex: 1 }}>Cancel</button>
              <button className="btn btn-primary" onClick={handleEscrow} style={{ flex: 2 }} id="confirm-escrow-btn">
                🔒 Confirm & Pay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
