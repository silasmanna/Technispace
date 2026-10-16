import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard, Building2, MessageSquare, Lock,
  Settings, Plus, Eye, Trash2, ShieldCheck, AlertCircle,
  TrendingUp, Clock, CheckCircle, Heart,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProperty } from '../context/PropertyContext';
import { useToast } from '../context/ToastContext';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { properties, inquiries, escrowTxns, deleteProperty, releaseEscrow } = useProperty();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');

  if (!user) {
    navigate('/login');
    return null;
  }

  const isLandlord = user.role === 'landlord';
  const myProperties = properties.filter(p => p.landlordId === user.id);
  const myInquiries = isLandlord
    ? inquiries.filter(i => i.landlordId === user.id)
    : inquiries.filter(i => i.tenantId === user.id);
  const myEscrow = escrowTxns.filter(e =>
    isLandlord ? e.landlordId === user.id : e.tenantId === user.id
  );

  const kycBanner = isLandlord && user.kycStatus !== 'verified' && (
    <div style={{
      padding: '16px 20px',
      background: user.kycStatus === 'pending' ? 'var(--badge-pending-bg)' : 'rgba(108,71,255,0.08)',
      border: `1px solid ${user.kycStatus === 'pending' ? 'var(--badge-pending-text)' : 'rgba(108,71,255,0.25)'}`,
      borderRadius: 'var(--radius-lg)',
      display: 'flex', alignItems: 'center', gap: 14,
      marginBottom: 28,
    }}>
      {user.kycStatus === 'pending'
        ? <AlertCircle size={22} color="var(--badge-pending-text)" />
        : <AlertCircle size={22} color="var(--brand-primary)" />
      }
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 2 }}>
          {user.kycStatus === 'pending' ? 'KYC Under Review' : 'KYC Required to List Properties'}
        </div>
        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          {user.kycStatus === 'pending'
            ? `Submitted on ${user.kycSubmittedAt}. Review takes 24–48 hours.`
            : 'Complete identity verification to list your properties on Technispace.'
          }
        </div>
      </div>
      {user.kycStatus !== 'pending' && (
        <button className="btn btn-primary btn-sm" onClick={() => navigate('/kyc')}>
          <ShieldCheck size={14} />
          Start KYC
        </button>
      )}
    </div>
  );

  const sidebarItems = isLandlord ? [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={17} /> },
    { id: 'properties', label: 'My Properties', icon: <Building2 size={17} />, count: myProperties.length },
    { id: 'inquiries', label: 'Inquiries', icon: <MessageSquare size={17} />, count: myInquiries.length },
    { id: 'escrow', label: 'Escrow', icon: <Lock size={17} />, count: myEscrow.filter(e => e.status === 'held').length },
    { id: 'settings', label: 'Settings', icon: <Settings size={17} /> },
  ] : [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={17} /> },
    { id: 'saved', label: 'Saved Homes', icon: <Heart size={17} /> },
    { id: 'inquiries', label: 'My Inquiries', icon: <MessageSquare size={17} />, count: myInquiries.length },
    { id: 'escrow', label: 'Payments', icon: <Lock size={17} />, count: myEscrow.length },
    { id: 'settings', label: 'Settings', icon: <Settings size={17} /> },
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div style={{ padding: '0 12px 20px', borderBottom: '1px solid var(--border-color)', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--brand-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>
              {user.avatar}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{user.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {isLandlord ? '🏠 Landlord' : '🔑 Tenant'}
              </div>
            </div>
          </div>
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

        {isLandlord && user.kycStatus === 'verified' && (
          <button
            className="btn btn-primary btn-sm"
            style={{ margin: '16px 12px 0', justifyContent: 'flex-start', gap: 8 }}
            onClick={() => navigate('/dashboard/properties/new')}
            id="new-listing-btn"
          >
            <Plus size={15} />
            New Listing
          </button>
        )}
      </aside>

      {/* Main */}
      <main className="dashboard-main">
        {kycBanner}

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
                  <StatCard
                    icon={<Building2 size={22} />}
                    color="rgba(108,71,255,0.12)"
                    iconColor="var(--brand-primary)"
                    value={myProperties.length}
                    label="Active Listings"
                    change="+2 this month"
                    changeType="up"
                  />
                  <StatCard
                    icon={<Eye size={22} />}
                    color="rgba(6,214,160,0.12)"
                    iconColor="var(--accent-teal)"
                    value={myProperties.reduce((s, p) => s + (p.views || 0), 0)}
                    label="Total Property Views"
                    change="+124 this week"
                    changeType="up"
                  />
                  <StatCard
                    icon={<MessageSquare size={22} />}
                    color="rgba(245,158,11,0.12)"
                    iconColor="var(--accent-amber)"
                    value={myInquiries.length}
                    label="Inquiries Received"
                    change={`${myInquiries.filter(i => i.status === 'pending').length} pending`}
                    changeType="up"
                  />
                  <StatCard
                    icon={<Lock size={22} />}
                    color="rgba(244,63,94,0.12)"
                    iconColor="var(--accent-rose)"
                    value={`$${myEscrow.filter(e => e.status === 'held').reduce((s, e) => s + e.landlordReceives, 0).toLocaleString()}`}
                    label="Pending Escrow"
                    change="awaiting release"
                    changeType="down"
                  />
                </>
              ) : (
                <>
                  <StatCard
                    icon={<MessageSquare size={22} />}
                    color="rgba(108,71,255,0.12)"
                    iconColor="var(--brand-primary)"
                    value={myInquiries.length}
                    label="Inquiries Sent"
                  />
                  <StatCard
                    icon={<Lock size={22} />}
                    color="rgba(6,214,160,0.12)"
                    iconColor="var(--accent-teal)"
                    value={myEscrow.length}
                    label="Active Payments"
                  />
                  <StatCard
                    icon={<Heart size={22} />}
                    color="rgba(244,63,94,0.12)"
                    iconColor="var(--accent-rose)"
                    value={user.savedProperties?.length || 0}
                    label="Saved Properties"
                  />
                </>
              )}
            </div>

            {isLandlord && myProperties.length > 0 && (
              <>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>Recent Listings</h2>
                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Property</th>
                        <th>Price</th>
                        <th>Views</th>
                        <th>Inquiries</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myProperties.slice(0, 5).map(p => (
                        <tr key={p.id}>
                          <td style={{ fontWeight: 600, color: 'var(--text-primary)', maxWidth: 220 }}>
                            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.city}, {p.state}</div>
                          </td>
                          <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>${p.price.toLocaleString()}/mo</td>
                          <td>{p.views || 0}</td>
                          <td>{p.inquiries || 0}</td>
                          <td>
                            <span className={`badge badge-${p.escrowStatus === 'held' ? 'pending' : 'verified'}`}>
                              {p.escrowStatus === 'held' ? 'Escrow Held' : 'Active'}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button className="btn btn-ghost btn-sm btn-icon" title="View" onClick={() => navigate(`/listings/${p.id}`)}>
                                <Eye size={14} />
                              </button>
                              <button className="btn btn-danger btn-sm btn-icon" title="Delete" onClick={() => {
                                deleteProperty(p.id);
                                toast.success('Listing Removed', `${p.title} has been deleted.`);
                              }}>
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {!isLandlord && myInquiries.length > 0 && (
              <>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>Recent Inquiries</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {myInquiries.slice(0, 3).map(inq => (
                    <div key={inq.id} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', padding: '16px 20px' }}>
                      <div style={{ fontWeight: 700, marginBottom: 4 }}>{inq.propertyTitle}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 8 }}>{inq.message}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sent {inq.sentAt}</span>
                        <span className={`badge badge-${inq.status === 'pending' ? 'pending' : 'verified'}`}>{inq.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* ── Properties Tab ── */}
        {activeTab === 'properties' && isLandlord && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <h1 className="dashboard-title" style={{ marginBottom: 0 }}>My Properties</h1>
              {user.kycStatus === 'verified' && (
                <button className="btn btn-primary" onClick={() => navigate('/dashboard/properties/new')} id="add-property-btn">
                  <Plus size={16} />
                  Add Property
                </button>
              )}
            </div>

            {myProperties.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon"><Building2 size={36} /></div>
                <h2 className="empty-state-title">No Listings Yet</h2>
                <p className="empty-state-desc">
                  {user.kycStatus === 'verified'
                    ? 'Create your first property listing to start receiving tenant inquiries.'
                    : 'Complete your KYC verification to start listing properties.'
                  }
                </p>
                <button className="btn btn-primary" onClick={() => navigate(user.kycStatus === 'verified' ? '/dashboard/properties/new' : '/kyc')}>
                  {user.kycStatus === 'verified' ? 'Add First Property' : 'Complete KYC'}
                </button>
              </div>
            ) : (
              <div className="properties-grid">
                {myProperties.map((p, i) => (
                  <div key={p.id} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                    <div style={{ height: 160, background: 'linear-gradient(135deg, #667eea, #764ba2)', position: 'relative', overflow: 'hidden' }}>
                      {p.images?.[0] && (
                        <img src={p.images[0]} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
                      )}
                      <div style={{ position: 'absolute', top: 10, right: 10 }}>
                        <span className={`badge badge-${p.escrowStatus === 'held' ? 'pending' : 'verified'}`}>
                          {p.escrowStatus === 'held' ? '🔒 Escrow' : '✓ Active'}
                        </span>
                      </div>
                    </div>
                    <div style={{ padding: '16px 20px' }}>
                      <div style={{ fontWeight: 700, marginBottom: 4, fontSize: '0.95rem' }}>{p.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12 }}>{p.city}, {p.state}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                        <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>${p.price.toLocaleString()}<span style={{ fontWeight: 400, fontSize: '0.8rem', color: 'var(--text-muted)' }}>/mo</span></span>
                        <div style={{ display: 'flex', gap: 6, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          <span>{p.views || 0} views</span>
                          <span>·</span>
                          <span>{p.inquiries || 0} inquiries</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => navigate(`/listings/${p.id}`)}>
                          <Eye size={14} /> View
                        </button>
                        <button className="btn btn-danger btn-sm btn-icon" onClick={() => {
                          deleteProperty(p.id);
                          toast.success('Listing Removed', p.title);
                        }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Inquiries Tab ── */}
        {activeTab === 'inquiries' && (
          <>
            <h1 className="dashboard-title">
              {isLandlord ? 'Tenant Inquiries' : 'My Inquiries'}
            </h1>
            {myInquiries.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon"><MessageSquare size={36} /></div>
                <h2 className="empty-state-title">No Inquiries Yet</h2>
                <p className="empty-state-desc">
                  {isLandlord ? 'Inquiries from potential tenants will appear here.' : 'Send inquiries to landlords from property listings.'}
                </p>
                {!isLandlord && <button className="btn btn-primary" onClick={() => navigate('/listings')}>Browse Listings</button>}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {myInquiries.map(inq => (
                  <div key={inq.id} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', padding: '20px 24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>{inq.propertyTitle}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {isLandlord ? `From: ${inq.tenantName}` : `To landlord`} · {inq.sentAt}
                        </div>
                      </div>
                      <span className={`badge badge-${inq.status === 'pending' ? 'pending' : 'verified'}`}>{inq.status}</span>
                    </div>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, padding: '12px 16px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', margin: 0 }}>
                      "{inq.message}"
                    </p>
                    {isLandlord && (
                      <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                        <button className="btn btn-primary btn-sm" onClick={() => { toast.success('Reply sent!', `Response sent to ${inq.tenantName}.`); }}>
                          Reply
                        </button>
                        <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/listings/${inq.propertyId}`)}>
                          View Property
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Escrow / Payments Tab ── */}
        {activeTab === 'escrow' && (
          <>
            <h1 className="dashboard-title">{isLandlord ? 'Escrow Payments' : 'My Payments'}</h1>

            {myEscrow.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon"><Lock size={36} /></div>
                <h2 className="empty-state-title">No Transactions</h2>
                <p className="empty-state-desc">
                  {isLandlord ? 'Escrow payments from tenants will appear here.' : 'Your rental payments and escrow status will appear here.'}
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {myEscrow.map(e => (
                  <div key={e.id} className="escrow-card">
                    <div className="escrow-header">
                      <div>
                        <div className="escrow-title">{e.propertyTitle}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
                          {isLandlord ? `Tenant: ${e.tenantName}` : `Landlord: ${e.landlordName}`} · {e.createdAt}
                        </div>
                      </div>
                      <span className={`badge badge-${e.status === 'released' ? 'verified' : e.status === 'held' ? 'pending' : 'primary'}`}>
                        {e.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="escrow-breakdown">
                      <div className="escrow-row">
                        <span className="escrow-row-label">Monthly Rent</span>
                        <span className="escrow-row-value">${e.amount.toLocaleString()}</span>
                      </div>
                      {isLandlord && (
                        <>
                          <div className="escrow-row deduction">
                            <span className="escrow-row-label">Platform Fee (5%)</span>
                            <span className="escrow-row-value">−${e.platformFee.toLocaleString()}</span>
                          </div>
                          <div className="escrow-divider" />
                          <div className="escrow-row net">
                            <span className="escrow-row-label">You Receive</span>
                            <span className="escrow-row-value">${e.landlordReceives.toLocaleString()}</span>
                          </div>
                        </>
                      )}
                      {!isLandlord && (
                        <>
                          <div className="escrow-divider" />
                          <div className="escrow-row">
                            <span className="escrow-row-label">Total Paid (incl. deposit)</span>
                            <span className="escrow-row-value">${(e.amount + e.deposit).toLocaleString()}</span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Timeline */}
                    <div className="escrow-timeline">
                      {e.timeline.map((ev, i) => (
                        <div key={i} className="escrow-event">
                          <div className="escrow-event-dot" style={{
                            background: ev.status === 'done' ? 'var(--accent-teal)'
                              : ev.status === 'active' ? 'var(--brand-primary)'
                              : 'var(--border-color)',
                          }} />
                          <div>
                            <div className="escrow-event-text">{ev.event}</div>
                            <div className="escrow-event-date">{ev.date}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {isLandlord && e.status === 'held' && (
                      <button
                        className="btn btn-success btn-sm"
                        style={{ marginTop: 16, width: '100%' }}
                        onClick={() => {
                          releaseEscrow(e.id);
                          toast.success('Funds Released!', `$${e.landlordReceives.toLocaleString()} will be deposited to your account.`);
                        }}
                        id={`release-escrow-${e.id}`}
                      >
                        <CheckCircle size={15} />
                        Confirm Move-in & Release Funds
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Saved Tab (Tenant) ── */}
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

        {/* ── Settings Tab ── */}
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
                <button className="btn btn-ghost" onClick={() => toast.info('Coming Soon', 'Profile editing will be available soon.')}>Edit Profile</button>
                <button className="btn btn-danger btn-sm" onClick={() => { logout(); navigate('/'); }}>Sign Out</button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function StatCard({ icon, color, iconColor, value, label, change, changeType }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: color, color: iconColor }}>{icon}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {change && <div className={`stat-change ${changeType}`}>{changeType === 'up' ? '↑' : '↓'} {change}</div>}
    </div>
  );
}
