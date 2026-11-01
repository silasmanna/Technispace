import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard, Building2, MessageSquare,
  CreditCard, Settings, Plus, Eye, Trash2,
  ShieldCheck, AlertCircle, Zap, Heart, CheckCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProperty } from '../context/PropertyContext';
import { useSubscription } from '../context/SubscriptionContext';
import { useToast } from '../context/ToastContext';
import { LISTING_PLANS, BOOST_TIERS, EXTRA_SLOT_PRICE, UPGRADE_PATHS, formatNaira } from '../lib/pricing';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { properties, inquiries, deleteProperty } = useProperty();
  const { getLandlordPlan, getMaxListingCapacity, getBoost, getLandlordTransactions, canListProperty } = useSubscription();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');

  if (!user) { navigate('/login'); return null; }

  const isLandlord = user.role === 'landlord';
  const myProperties = properties.filter(p => p.landlordId === user.id);
  const myInquiries = isLandlord
    ? inquiries.filter(i => i.landlordId === user.id)
    : inquiries.filter(i => i.tenantId === user.id);

  const currentPlan = isLandlord ? getLandlordPlan(user.id) : null;
  const planInfo = currentPlan ? LISTING_PLANS[currentPlan.planId] : null;
  const myTxns = isLandlord ? getLandlordTransactions(user.id) : [];
  const canList = isLandlord ? canListProperty(user.id, myProperties.length) : false;

  // ── KYC Banner ────────────────────────────────────────────────────────────
  const kycBanner = isLandlord && user.kycStatus !== 'verified' && (
    <div style={{
      padding: '16px 20px',
      background: user.kycStatus === 'pending' ? 'var(--badge-pending-bg)' : 'rgba(108,71,255,0.08)',
      border: `1px solid ${user.kycStatus === 'pending' ? 'var(--badge-pending-text)' : 'rgba(108,71,255,0.25)'}`,
      borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28,
    }}>
      <AlertCircle size={22} color={user.kycStatus === 'pending' ? 'var(--badge-pending-text)' : 'var(--brand-primary)'} />
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 2 }}>
          {user.kycStatus === 'pending' ? 'KYC Under Review' : 'KYC Required to List Properties'}
        </div>
        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          {user.kycStatus === 'pending'
            ? `Submitted on ${user.kycSubmittedAt}. Review takes 24–48 hours.`
            : 'Complete identity verification before you can list properties.'}
        </div>
      </div>
      {user.kycStatus !== 'pending' && (
        <button className="btn btn-primary btn-sm" onClick={() => navigate('/kyc')}>
          <ShieldCheck size={14} /> Start KYC
        </button>
      )}
    </div>
  );

  // ── Subscription Banner ────────────────────────────────────────────────────
  const subBanner = isLandlord && user.kycStatus === 'verified' && !currentPlan && (
    <div style={{
      padding: '16px 20px',
      background: 'rgba(108,71,255,0.08)',
      border: '1px solid rgba(108,71,255,0.25)',
      borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28,
    }}>
      <CreditCard size={22} color="var(--brand-primary)" />
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 2 }}>No Active Listing Plan</div>
        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          Purchase a listing plan to start publishing properties on Technispace.
        </div>
      </div>
      <button className="btn btn-primary btn-sm" onClick={() => navigate('/pricing')}>
        View Plans
      </button>
    </div>
  );

  const sidebarItems = isLandlord ? [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={17} /> },
    { id: 'properties', label: 'My Properties', icon: <Building2 size={17} />, count: myProperties.length },
    { id: 'inquiries', label: 'Inquiries', icon: <MessageSquare size={17} />, count: myInquiries.length },
    { id: 'billing', label: 'Plans & Billing', icon: <CreditCard size={17} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={17} /> },
  ] : [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={17} /> },
    { id: 'saved', label: 'Saved Homes', icon: <Heart size={17} /> },
    { id: 'inquiries', label: 'My Inquiries', icon: <MessageSquare size={17} />, count: myInquiries.length },
    { id: 'settings', label: 'Settings', icon: <Settings size={17} /> },
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div style={{ padding: '0 12px 20px', borderBottom: '1px solid var(--border-color)', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 42, height: 42, borderRadius: '50%',
              background: 'var(--brand-gradient)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700, color: 'white',
            }}>
              {user.avatar}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{user.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {isLandlord ? '🏠 Landlord' : '🔑 Tenant'}
              </div>
            </div>
          </div>
          {/* Plan pill */}
          {planInfo && (
            <div style={{
              marginTop: 10, display: 'flex', alignItems: 'center', gap: 6,
              padding: '4px 10px', borderRadius: 'var(--radius-full)',
              background: 'rgba(108,71,255,0.12)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--brand-primary)',
            }}>
              <Zap size={11} /> {planInfo.name}
            </div>
          )}
        </div>

        {sidebarItems.map(item => (
          <button
            key={item.id}
            id={`sidebar-${item.id}`}
            className={`sidebar-link ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            {item.icon}
            {item.label}
            {item.count > 0 && <span className="badge-count">{item.count}</span>}
          </button>
        ))}

        {isLandlord && user.kycStatus === 'verified' && canList && (
          <button
            className="btn btn-primary btn-sm"
            style={{ margin: '16px 12px 0', justifyContent: 'flex-start', gap: 8 }}
            onClick={() => navigate('/dashboard/properties/new')}
            id="new-listing-btn"
          >
            <Plus size={15} /> New Listing
          </button>
        )}
      </aside>

      {/* Main */}
      <main className="dashboard-main">
        {kycBanner}
        {subBanner}

        {/* ── Overview ── */}
        {activeTab === 'overview' && (
          <>
            <div className="dashboard-header">
              <div className="dashboard-greeting">Good day,</div>
              <h1 className="dashboard-title">{user.name.split(' ')[0]}'s Dashboard</h1>
            </div>

            <div className="stat-cards">
              {isLandlord ? (
                <>
                  <StatCard icon={<Building2 size={22} />} color="rgba(108,71,255,0.12)" iconColor="var(--brand-primary)"
                    value={myProperties.length}
                    label="Active Listings" />
                  <StatCard icon={<Eye size={22} />} color="rgba(6,214,160,0.12)" iconColor="var(--accent-teal)"
                    value={myProperties.reduce((s, p) => s + (p.views || 0), 0)}
                    label="Total Views" />
                  <StatCard icon={<MessageSquare size={22} />} color="rgba(245,158,11,0.12)" iconColor="var(--accent-amber)"
                    value={myInquiries.length}
                    label="Inquiries" />
                  <StatCard icon={<CreditCard size={22} />} color="rgba(244,63,94,0.12)" iconColor="var(--accent-rose)"
                    value={planInfo ? planInfo.name : 'No Plan'}
                    label="Listing Plan" />
                </>
              ) : (
                <>
                  <StatCard icon={<MessageSquare size={22} />} color="rgba(108,71,255,0.12)" iconColor="var(--brand-primary)"
                    value={myInquiries.length} label="Inquiries Sent" />
                  <StatCard icon={<Heart size={22} />} color="rgba(244,63,94,0.12)" iconColor="var(--accent-rose)"
                    value={user.savedProperties?.length || 0} label="Saved Properties" />
                </>
              )}
            </div>

            {/* Current plan card */}
            {isLandlord && (
              <div style={{
                background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                borderRadius: 'var(--radius-xl)', padding: '24px 28px', marginBottom: 28,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Active Listing Plan</h2>
                  <button className="btn btn-ghost btn-sm" onClick={() => navigate('/pricing')}>
                    View Plans
                  </button>
                </div>

                {currentPlan ? (
                  <>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: 'var(--radius-md)',
                        background: 'var(--brand-gradient)', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', color: 'white', flexShrink: 0,
                      }}>
                        <Building2 size={22} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '1rem' }}>{planInfo.name}</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          Expires: {currentPlan.expiresAt}
                        </div>
                      </div>
                      <span className="badge badge-verified" style={{ marginLeft: 'auto' }}>Active</span>
                    </div>
                    <div style={{ display: 'flex', gap: 12, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <span>
                        <strong style={{ color: 'var(--text-primary)' }}>{currentPlan.propertiesUsed || 0}</strong>
                        {' '}/ {planInfo.maxProperties === Infinity ? '∞' : planInfo.maxProperties} properties used
                      </span>
                      <span>·</span>
                      <span>{formatNaira(planInfo.price)} / 30 days</span>
                    </div>
                  </>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <AlertCircle size={20} color="var(--accent-amber)" />
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No active plan.</span>
                    <button className="btn btn-primary btn-sm" onClick={() => navigate('/pricing')}>Get a Plan</button>
                  </div>
                )}
              </div>
            )}

            {/* Recent properties */}
            {isLandlord && myProperties.length > 0 && (
              <>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>Recent Listings</h2>
                <div style={{
                  background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                  borderRadius: 'var(--radius-lg)', overflow: 'hidden',
                }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Property</th>
                        <th>Rent</th>
                        <th>Views</th>
                        <th>Boost</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myProperties.slice(0, 5).map(p => {
                        const boost = getBoost(p.id);
                        const tier = boost ? BOOST_TIERS[boost.tier] : null;
                        return (
                          <tr key={p.id}>
                            <td>
                              <div style={{ fontWeight: 600, maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.city}, {p.state}</div>
                            </td>
                            <td style={{ fontWeight: 700 }}>₦{p.price.toLocaleString()}/mo</td>
                            <td>{p.views || 0}</td>
                            <td>
                              {tier
                                ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 'var(--radius-full)', background: `${tier.color}20`, color: tier.color, fontSize: '0.72rem', fontWeight: 700 }}>{tier.emoji} {tier.name}</span>
                                : <button className="btn btn-ghost btn-sm" style={{ fontSize: '0.72rem', padding: '3px 10px' }} onClick={e => { e.stopPropagation(); navigate(`/checkout?type=boost&id=premium&propertyId=${p.id}`); }}>
                                    <Zap size={11} /> Boost
                                  </button>
                              }
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: 6 }}>
                                <button className="btn btn-ghost btn-sm btn-icon" title="View" onClick={() => navigate(`/listings/${p.id}`)}>
                                  <Eye size={14} />
                                </button>
                                <button className="btn btn-danger btn-sm btn-icon" title="Delete" onClick={() => {
                                  deleteProperty(p.id);
                                  toast.success('Listing Removed', p.title);
                                }}>
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* Tenant recent inquiries */}
            {!isLandlord && myInquiries.length > 0 && (
              <>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>Recent Inquiries</h2>
                {myInquiries.slice(0, 3).map(inq => (
                  <div key={inq.id} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', padding: '16px 20px', marginBottom: 12 }}>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>{inq.propertyTitle}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 8 }}>{inq.message}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sent {inq.sentAt}</span>
                      <span className={`badge badge-${inq.status === 'pending' ? 'pending' : 'verified'}`}>{inq.status}</span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        )}

        {/* ── Properties Tab ── */}
        {activeTab === 'properties' && isLandlord && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <h1 className="dashboard-title" style={{ marginBottom: 0 }}>My Properties</h1>
              {canList && (
                <button className="btn btn-primary" onClick={() => navigate('/dashboard/properties/new')} id="add-property-btn">
                  <Plus size={16} /> Add Property
                </button>
              )}
            </div>

            {myProperties.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon"><Building2 size={36} /></div>
                <h2 className="empty-state-title">No Listings Yet</h2>
                <p className="empty-state-desc">
                  {!currentPlan
                    ? 'Purchase a listing plan to start publishing properties.'
                    : user.kycStatus !== 'verified'
                    ? 'Complete KYC verification first.'
                    : 'Create your first listing.'}
                </p>
                <button className="btn btn-primary" onClick={() => navigate(!currentPlan ? '/pricing' : user.kycStatus !== 'verified' ? '/kyc' : '/dashboard/properties/new')}>
                  {!currentPlan ? 'Get Listing Plan' : user.kycStatus !== 'verified' ? 'Complete KYC' : 'Add First Property'}
                </button>
              </div>
            ) : (
              <div className="properties-grid">
                {myProperties.map((p) => {
                  const boost = getBoost(p.id);
                  const tier = boost ? BOOST_TIERS[boost.tier] : null;
                  return (
                    <div key={p.id} style={{
                      background: 'var(--card-bg)', border: `2px solid ${tier ? tier.color : 'var(--card-border)'}`,
                      borderRadius: 'var(--radius-lg)', overflow: 'hidden',
                    }}>
                      <div style={{ height: 160, background: 'linear-gradient(135deg, #667eea, #764ba2)', position: 'relative', overflow: 'hidden' }}>
                        {p.images?.[0] && (
                          <img src={p.images[0]} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
                        )}
                        {tier && (
                          <div style={{
                            position: 'absolute', top: 8, left: 8,
                            background: tier.gradient, color: 'white',
                            padding: '3px 10px', borderRadius: 'var(--radius-full)',
                            fontSize: '0.7rem', fontWeight: 800,
                          }}>{tier.emoji} {tier.name}</div>
                        )}
                        <div style={{ position: 'absolute', top: 8, right: 8 }}>
                          <span className="badge badge-verified">Active</span>
                        </div>
                      </div>
                      <div style={{ padding: '16px 20px' }}>
                        <div style={{ fontWeight: 700, marginBottom: 4, fontSize: '0.95rem' }}>{p.title}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12 }}>{p.city}, {p.state}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                          <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>
                            ₦{p.price.toLocaleString()}<span style={{ fontWeight: 400, fontSize: '0.78rem', color: 'var(--text-muted)' }}>/mo</span>
                          </span>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{p.views || 0} views</span>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => navigate(`/listings/${p.id}`)}>
                            <Eye size={14} /> View
                          </button>
                          {!tier && (
                            <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/checkout?type=boost&id=premium&propertyId=${p.id}`)}>
                              <Zap size={13} /> Boost
                            </button>
                          )}
                          <button className="btn btn-danger btn-sm btn-icon" onClick={() => { deleteProperty(p.id); toast.success('Removed', p.title); }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ── Inquiries Tab ── */}
        {activeTab === 'inquiries' && (
          <>
            <h1 className="dashboard-title">{isLandlord ? 'Tenant Inquiries' : 'My Inquiries'}</h1>
            {myInquiries.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon"><MessageSquare size={36} /></div>
                <h2 className="empty-state-title">No Inquiries Yet</h2>
                <p className="empty-state-desc">{isLandlord ? 'Inquiries from tenants will appear here.' : 'Browse listings and send inquiries to landlords.'}</p>
                {!isLandlord && <button className="btn btn-primary" onClick={() => navigate('/listings')}>Browse Listings</button>}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {myInquiries.map(inq => (
                  <div key={inq.id} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', padding: '20px 24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>{inq.propertyTitle}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {isLandlord ? `From: ${inq.tenantName}` : 'To landlord'} · {inq.sentAt}
                        </div>
                      </div>
                      <span className={`badge badge-${inq.status === 'pending' ? 'pending' : 'verified'}`}>{inq.status}</span>
                    </div>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', padding: '12px 16px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', margin: 0 }}>
                      "{inq.message}"
                    </p>
                    {isLandlord && (
                      <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                        <button className="btn btn-primary btn-sm" onClick={() => toast.success('Reply sent!', `Response sent to ${inq.tenantName}.`)}>Reply</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/listings/${inq.propertyId}`)}>View Property</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Billing Tab ── */}
        {activeTab === 'billing' && isLandlord && (
          <>
            <h1 className="dashboard-title">Plans & Billing</h1>

            {/* Current plan */}
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 14 }}>Current Plan</h2>
              {currentPlan ? (
                <div style={{
                  background: 'var(--card-bg)', border: '2px solid var(--brand-primary)',
                  borderRadius: 'var(--radius-xl)', padding: '24px 28px',
                  display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center',
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <span style={{ fontWeight: 800, fontSize: '1.2rem' }}>{planInfo.name}</span>
                      <span className="badge badge-verified">Active</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {formatNaira(planInfo.price)} / 30 days ·{' '}
                      {planInfo.maxProperties === Infinity
                        ? 'Unlimited properties'
                        : `Capacity: ${getMaxListingCapacity(user.id)} properties (${planInfo.maxProperties} base + ${currentPlan.extraSlots || 0} extra)`}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 4 }}>
                      Expires: <strong>{currentPlan.expiresAt}</strong> · {currentPlan.propertiesUsed || 0} properties currently listed
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {UPGRADE_PATHS[currentPlan.planId] && (
                      <button
                        className="btn btn-primary"
                        onClick={() => navigate(`/checkout?type=plan&id=${UPGRADE_PATHS[currentPlan.planId]}`)}
                      >
                        Upgrade to {LISTING_PLANS[UPGRADE_PATHS[currentPlan.planId]]?.name}
                      </button>
                    )}
                    {planInfo.maxProperties !== Infinity && (
                      <button
                        className="btn btn-secondary"
                        onClick={() => navigate('/checkout?type=slot&count=1')}
                      >
                        + Add Extra Slot ({formatNaira(EXTRA_SLOT_PRICE)})
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{
                  background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                  borderRadius: 'var(--radius-xl)', padding: '32px', textAlign: 'center',
                }}>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>You have no active listing plan.</p>
                  <button className="btn btn-primary" onClick={() => navigate('/pricing')}>Browse Plans</button>
                </div>
              )}
            </div>

            {/* Boost your listings */}
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 14 }}>Boost a Listing</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
                {Object.values(BOOST_TIERS).map(tier => (
                  <div key={tier.id} style={{
                    background: 'var(--card-bg)', border: `1.5px solid ${tier.color}`,
                    borderRadius: 'var(--radius-lg)', padding: '18px 20px',
                  }}>
                    <div style={{ fontSize: '1.6rem', marginBottom: 8 }}>{tier.emoji}</div>
                    <div style={{ fontWeight: 800, marginBottom: 2 }}>{tier.name}</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 900, color: tier.color, marginBottom: 8 }}>
                      {formatNaira(tier.price)}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 14, lineHeight: 1.5 }}>
                      {tier.description}
                    </div>
                    <button
                      onClick={() => navigate(`/pricing?tab=boost`)}
                      style={{
                        width: '100%', padding: '8px', border: 'none', cursor: 'pointer',
                        background: tier.gradient, color: 'white', borderRadius: 'var(--radius-full)',
                        fontWeight: 700, fontSize: '0.8rem',
                      }}
                    >
                      Learn More
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Transaction history */}
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 14 }}>Transaction History</h2>
              {myTxns.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No transactions yet.</p>
              ) : (
                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Reference</th>
                        <th>Type</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myTxns.map(t => (
                        <tr key={t.id}>
                          <td style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--text-muted)' }}>{t.ref}</td>
                          <td><span className="badge badge-primary" style={{ fontSize: '0.68rem' }}>{t.type}</span></td>
                          <td style={{ fontSize: '0.85rem' }}>
                            {t.type === 'extra_slot'
                              ? `+${t.slotCount || 1} Additional Listing Slot${(t.slotCount || 1) > 1 ? 's' : ''}`
                              : t.type === 'upgrade'
                              ? `Upgrade to ${LISTING_PLANS[t.planId]?.name}`
                              : t.type === 'subscription'
                              ? LISTING_PLANS[t.planId]?.name
                              : `${BOOST_TIERS[t.boostTier]?.name} Boost`}
                          </td>
                          <td style={{ fontWeight: 700 }}>{formatNaira(t.amount)}</td>
                          <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{t.date}</td>
                          <td><span className="badge badge-verified" style={{ fontSize: '0.68rem' }}>{t.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── Saved (Tenant) ── */}
        {activeTab === 'saved' && !isLandlord && (
          <>
            <h1 className="dashboard-title">Saved Homes</h1>
            <div className="empty-state">
              <div className="empty-state-icon"><Heart size={36} /></div>
              <h2 className="empty-state-title">No Saved Properties</h2>
              <p className="empty-state-desc">Save properties from listings to view them here.</p>
              <button className="btn btn-primary" onClick={() => navigate('/listings')}>Browse Listings</button>
            </div>
          </>
        )}

        {/* ── Settings ── */}
        {activeTab === 'settings' && (
          <>
            <h1 className="dashboard-title">Account Settings</h1>
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-xl)', padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--brand-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 700, color: 'white' }}>
                  {user.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{user.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{user.email}</div>
                  <div style={{ marginTop: 6 }}>
                    <span className={`badge badge-${isLandlord && user.kycStatus === 'verified' ? 'verified' : 'primary'}`}>
                      {isLandlord ? `Landlord · ${user.kycStatus}` : 'Tenant'}
                    </span>
                  </div>
                </div>
              </div>

              {[
                { label: 'Full Name', value: user.name },
                { label: 'Email', value: user.email },
                { label: 'Phone', value: user.phone || 'Not provided' },
                { label: 'Member Since', value: user.joinedAt },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{label}</span>
                  <span style={{ fontSize: '0.9rem' }}>{value}</span>
                </div>
              ))}

              <div style={{ marginTop: 28, display: 'flex', gap: 12 }}>
                <button className="btn btn-ghost" onClick={() => toast.info('Coming Soon', 'Profile editing soon.')}>Edit Profile</button>
                <button className="btn btn-danger btn-sm" onClick={() => { logout(); navigate('/'); }}>Sign Out</button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}


// ─── StatCard ─────────────────────────────────────────────────────────────────
function StatCard({ icon, color, iconColor, value, label }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: color, color: iconColor }}>{icon}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

