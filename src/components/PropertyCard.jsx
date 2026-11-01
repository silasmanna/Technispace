import { MapPin, Bed, Bath, Square, Star, ShieldCheck, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import { BOOST_TIERS } from '../lib/pricing';

function gradientFor(index) {
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #06b6d4 0%, #6c47ff 100%)',
    'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
    'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    'linear-gradient(135deg, #a78bfa 0%, #f472b6 100%)',
    'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
  ];
  return gradients[index % gradients.length];
}

export default function PropertyCard({ property, index = 0 }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getBoost } = useSubscription();
  const boost = getBoost(property.id);
  const tier = boost ? BOOST_TIERS[boost.tier] : null;
  const isOwner = Boolean(user && property && user.id === property.landlordId);

  const sizeLabel = () => {
    if (property.sizeValue) return `${Number(property.sizeValue).toLocaleString()} ${property.sizeUnit || 'sqm'}`;
    if (property.sqft) return `${property.sqft.toLocaleString()} sqft`;
    return null;
  };

  const bedroomLabel = () => {
    if (property.type === 'studio') return 'Studio';
    if (property.bedrooms === 0) return 'Studio';
    return `${property.bedrooms} BR`;
  };

  return (
    <div
      className="property-card"
      id={`property-card-${property.id}`}
      onClick={() => navigate(`/listings/${property.id}`)}
      style={tier ? { outline: `2px solid ${tier.color}`, outlineOffset: 2 } : {}}
    >
      <div className="property-img">
        {property.images?.[0] ? (
          <img
            src={property.images[0]}
            alt={property.title}
            loading="lazy"
            onError={e => {
              e.target.style.display = 'none';
              e.target.parentNode.style.background = gradientFor(index);
            }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: gradientFor(index) }} />
        )}
        <div className="property-img-overlay" />

        {/* Boost badge — top left */}
        {tier && (
          <div style={{
            position: 'absolute', top: 10, left: 10,
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '3px 10px', borderRadius: 'var(--radius-full)',
            background: tier.gradient, color: 'white',
            fontSize: '0.68rem', fontWeight: 800,
            boxShadow: `0 2px 10px ${tier.color}66`,
            letterSpacing: '0.04em',
          }}>
            {tier.emoji} {tier.name.toUpperCase()}
          </div>
        )}

        {/* Owner listing indicator */}
        {isOwner && (
          <div style={{
            position: 'absolute', top: 10, right: 10,
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '3px 10px', borderRadius: 'var(--radius-full)',
            background: 'var(--brand-primary)', color: 'white',
            fontSize: '0.68rem', fontWeight: 800,
            boxShadow: '0 2px 8px rgba(108, 71, 255, 0.4)',
            letterSpacing: '0.04em',
          }}>
            <Edit3 size={11} /> YOUR LISTING · EDIT
          </div>
        )}

        {/* Verified badge — only if no boost and not owner (avoid clutter) */}
        {!tier && !isOwner && property.landlordVerified && (
          <div className="property-badge-verified">
            <ShieldCheck size={11} />
            Verified
          </div>
        )}

        {/* Price badge */}
        <div className="property-price-badge">
          ₦{property.price.toLocaleString()}<span style={{ fontSize: '0.7rem', fontWeight: 400, marginLeft: 2 }}>/mo</span>
        </div>
      </div>

      <div className="property-body">
        <h3 className="property-title">{property.title}</h3>
        <div className="property-location">
          <MapPin size={12} />
          {property.city}, {property.state}
        </div>

        <div className="property-meta">
          <div className="property-meta-item">
            <Bed size={14} />
            {bedroomLabel()}
          </div>
          <div className="property-meta-item">
            <Bath size={14} />
            {property.bathrooms} Bath
          </div>
          {sizeLabel() && (
            <div className="property-meta-item">
              <Square size={14} />
              {sizeLabel()}
            </div>
          )}
        </div>

        <div className="property-footer">
          <div className="landlord-info">
            <div className="landlord-avatar">{property.landlordAvatar}</div>
            <span className="landlord-name">{property.landlordName}</span>
          </div>
          {property.rating > 0 && (
            <div className="rating">
              <Star size={13} fill="var(--accent-amber)" />
              {property.rating.toFixed(1)}
              <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({property.reviews})</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
