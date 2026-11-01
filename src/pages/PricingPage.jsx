import { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Zap, PlusCircle, ArrowUpCircle, ShieldCheck } from 'lucide-react';
import { LISTING_PLANS, BOOST_TIERS, EXTRA_SLOT_PRICE, UPGRADE_PATHS, formatNaira } from '../lib/pricing';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';

export default function PricingPage() {
  const { user } = useAuth();
  const { getLandlordPlan, getMaxListingCapacity } = useSubscription();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') === 'boost' ? 'boost' : 'plans'); // 'plans' | 'boost'

  const currentSub = user && user.role === 'landlord' ? getLandlordPlan(user.id) : null;
  const currentPlanId = currentSub?.planId || null;
  const nextAllowedUpgradeId = currentPlanId ? UPGRADE_PATHS[currentPlanId] : null;

  const handleSelect = (type, id) => {
    if (!user) { navigate('/register?role=landlord'); return; }
    if (user.role !== 'landlord') return;
    navigate(`/checkout?type=${type}&id=${id}`);
  };

  const handleExtraSlot = () => {
    if (!user) { navigate('/register?role=landlord'); return; }
    if (user.role !== 'landlord') return;
    navigate(`/checkout?type=slot&count=1`);
  };

  return (
    <div style={{ paddingTop: 68, minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{
        background: 'var(--bg-subtle)',
        borderBottom: '1px solid var(--border-color)',
        padding: '72px 0 56px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(108,71,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(108,71,255,0.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          pointerEvents: 'none',
        }} />
        <div className="container" style={{ position: 'relative' }}>
          <span className="badge badge-primary" style={{ marginBottom: 16 }}>Transparent Pricing</span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 14 }}>
            List Your Property in <span className="text-gradient">Minutes</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: 520, margin: '0 auto 32px' }}>
            Choose a listing plan that works for you. Tenants browse for free — landlords pay a simple subscription to publish.
          </p>

          {/* Tab switch */}
          <div style={{
            display: 'inline-flex', background: 'var(--bg-elevated)',
            border: '1px solid var(--border-color)', borderRadius: 'var(--radius-full)', padding: 4,
          }}>
            {[
              { id: 'plans', label: '🏠 Listing Plans' },
              { id: 'boost', label: '🚀 Boost Tiers' },
            ].map(t => (
              <button key={t.id}
                id={`tab-btn-${t.id}`}
                onClick={() => setActiveTab(t.id)}
                style={{
                  padding: '10px 24px', borderRadius: 'var(--radius-full)',
                  fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.9rem',
                  border: 'none', cursor: 'pointer',
                  background: activeTab === t.id ? 'var(--brand-gradient)' : 'transparent',
                  color: activeTab === t.id ? 'white' : 'var(--text-secondary)',
                  transition: 'all 0.2s',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container section">

        {/* ── Listing Plans ─────────────────────────────────────────────────── */}
        {activeTab === 'plans' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 8 }}>Choose Your Listing Plan</h2>
              <p style={{ color: 'var(--text-secondary)' }}>All plans are valid for <strong>30 days</strong>. Upgrades unlock higher capacity instantly.</p>
              
              {currentSub && (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  marginTop: 12, padding: '8px 18px', borderRadius: 'var(--radius-full)',
                  background: 'rgba(108,71,255,0.08)', border: '1px solid rgba(108,71,255,0.2)',
                  fontSize: '0.85rem', fontWeight: 600, color: 'var(--brand-primary)',
                }}>
                  <ShieldCheck size={16} />
                  Current Active Plan: <strong>{LISTING_PLANS[currentPlanId]?.name}</strong>
                  {nextAllowedUpgradeId && (
                    <span>· Next upgrade: <strong>{LISTING_PLANS[nextAllowedUpgradeId]?.name}</strong></span>
                  )}
                  {currentPlanId === 'unlimited' && (
                    <span>· You are on the highest tier!</span>
                  )}
                </div>
              )}
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 24, maxWidth: 960, margin: '0 auto 40px',
            }}>
              {Object.values(LISTING_PLANS).map((plan) => {
                const isCurrent = currentPlanId === plan.id;
                const isNextUpgrade = nextAllowedUpgradeId === plan.id;
                // If user already has a plan: they can ONLY upgrade to the direct next tier (single -> starter, starter -> unlimited)
                const isLocked = currentPlanId && !isCurrent && !isNextUpgrade;

                return (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    isCurrent={isCurrent}
                    isNextUpgrade={isNextUpgrade}
                    isLocked={isLocked}
                    currentPlanId={currentPlanId}
                    onSelect={() => handleSelect('plan', plan.id)}
                    isLandlord={user?.role === 'landlord'}
                  />
                );
              })}
            </div>

            {/* ── Extra Listing Slot Add-on Card ── */}
            <div style={{
              maxWidth: 960, margin: '0 auto 48px',
              background: 'linear-gradient(135deg, rgba(6, 214, 160, 0.08) 0%, rgba(108, 71, 255, 0.08) 100%)',
              border: '1.5px dashed var(--accent-teal)',
              borderRadius: 'var(--radius-xl)',
              padding: '28px 32px',
              display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between',
              gap: 20,
            }}>
              <div style={{ maxWidth: 600 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span className="badge" style={{ background: 'var(--accent-teal)', color: 'white', fontWeight: 800 }}>
                    Add-on Available
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>For active landlords</span>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 6px' }}>
                  Need More Slots? Add Extra Listings for {formatNaira(EXTRA_SLOT_PRICE)} / slot
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.55 }}>
                  Ran out of property capacity on your current plan? Purchase additional listing slots at <strong>₦5,000 per extra property</strong> without having to jump full tiers immediately.
                </p>
              </div>

              <div>
                <button
                  className="btn btn-primary"
                  onClick={handleExtraSlot}
                  id="buy-extra-slot-btn"
                  style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  <PlusCircle size={17} />
                  Add Listing Slot ({formatNaira(EXTRA_SLOT_PRICE)})
                </button>
              </div>
            </div>

            {/* FAQ strip */}
            <div style={{
              marginTop: 56, display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 20, maxWidth: 960, margin: '56px auto 0',
            }}>
              {[
                { q: 'Can I list immediately?', a: 'Yes — as soon as your Paystack payment is confirmed, your listing goes live instantly.' },
                { q: 'How do payments work?', a: 'All payments are handled securely via Paystack using card, bank transfer, or USSD.' },
                { q: 'What happens after 30 days?', a: 'Your listing is paused. Simply renew your plan via Paystack to reactivate it without losing data.' },
                { q: 'Do tenants pay anything?', a: 'Never. Browsing, inquiring, and viewing listings is completely free for tenants.' },
              ].map(({ q, a }) => (
                <div key={q} style={{
                  background: 'var(--bg-elevated)', border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)', padding: '20px 22px',
                }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 8 }}>{q}</div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{a}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Boost Tiers ───────────────────────────────────────────────────── */}
        {activeTab === 'boost' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 8 }}>Boost Your Listing Visibility</h2>
              <p style={{ color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto' }}>
                Stand out from the crowd. Boosted listings get significantly more views and inquiries in 30 days.
              </p>
            </div>

            {/* Comparison visual */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
              gap: 20, maxWidth: 1100, margin: '0 auto 56px',
            }}>
              {Object.values(BOOST_TIERS).map((tier, i) => (
                <BoostCard
                  key={tier.id}
                  tier={tier}
                  isMostPopular={i === 1}
                  onSelect={() => handleSelect('boost', tier.id)}
                  isLandlord={user?.role === 'landlord'}
                />
              ))}
            </div>

            {/* How boost works */}
            <div style={{
              background: 'var(--bg-subtle)', border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-xl)', padding: '36px 40px',
              maxWidth: 760, margin: '0 auto',
            }}>
              <h3 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: 20 }}>
                <Zap size={18} style={{ display: 'inline', marginRight: 6, color: 'var(--accent-amber)' }} />
                How Listing Boost Works
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                  { step: '01', title: 'Select a Boost Tier', desc: 'Choose from Premium, Gold, Platinum, or Diamond based on your target reach.' },
                  { step: '02', title: 'Complete Payment', desc: 'One-time payment per property. No recurring charges — valid for exactly 30 days.' },
                  { step: '03', title: 'Go Live Immediately', desc: 'Your listing moves up in search results and gets a distinctive badge instantly.' },
                  { step: '04', title: 'Track Performance', desc: 'Monitor views and inquiries in your dashboard analytics to measure ROI.' },
                ].map(s => (
                  <div key={s.step} style={{ display: 'flex', gap: 12 }}>
                    <div style={{
                      fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1.4rem',
                      background: 'var(--brand-gradient)', WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                      lineHeight: 1, flexShrink: 0,
                    }}>{s.step}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 4 }}>{s.title}</div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.55 }}>{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Bottom CTA */}
        {!user && (
          <div style={{ textAlign: 'center', marginTop: 56 }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 20, fontSize: '0.95rem' }}>
              Ready to start listing? Create your landlord account first — it's free.
            </p>
            <Link to="/register?role=landlord" className="btn btn-primary btn-lg" id="pricing-register-btn">
              Create Landlord Account
              <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PlanCard({ plan, isCurrent, isNextUpgrade, isLocked, currentPlanId, onSelect, isLandlord }) {
  const isHighlighted = isNextUpgrade || (!currentPlanId && plan.id === 'starter');

  let buttonText = isLandlord ? `Get ${plan.name}` : 'Start as Landlord';
  let buttonDisabled = false;
  let statusBadge = null;

  if (isLandlord && currentPlanId) {
    if (isCurrent) {
      buttonText = `Current Plan (Renew for ${formatNaira(plan.price)})`;
      statusBadge = 'Active';
    } else if (isNextUpgrade) {
      buttonText = `Upgrade to ${plan.name} (${formatNaira(plan.price)})`;
      statusBadge = 'Next Upgrade Tier';
    } else if (isLocked) {
      buttonDisabled = true;
      if (currentPlanId === 'unlimited') {
        buttonText = 'Highest Tier Active';
      } else if (currentPlanId === 'starter' && plan.id === 'single') {
        buttonText = 'Cannot Downgrade to Single';
      } else if (currentPlanId === 'single' && plan.id === 'unlimited') {
        buttonText = 'Upgrade to 10 Properties First';
      } else {
        buttonText = 'Tier Locked';
      }
    }
  }

  return (
    <div style={{
      background: 'var(--card-bg)',
      border: `2px solid ${isCurrent ? 'var(--accent-teal)' : isHighlighted ? 'var(--brand-primary)' : 'var(--card-border)'}`,
      borderRadius: 'var(--radius-xl)',
      padding: '32px 28px',
      position: 'relative',
      display: 'flex', flexDirection: 'column',
      transition: 'all 0.25s ease',
      opacity: isLocked ? 0.72 : 1,
      boxShadow: isHighlighted ? '0 8px 32px rgba(108,71,255,0.18)' : 'var(--card-shadow)',
    }}>
      {/* Plan badge or upgrade status badge */}
      {(statusBadge || plan.badge) && (
        <div style={{
          position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
          background: isCurrent ? 'var(--accent-teal)' : isNextUpgrade ? 'var(--brand-gradient)' : 'var(--bg-elevated)',
          color: isCurrent || isNextUpgrade ? 'white' : 'var(--text-secondary)',
          border: isCurrent || isNextUpgrade ? 'none' : '1px solid var(--border-color)',
          padding: '4px 16px', borderRadius: 'var(--radius-full)',
          fontSize: '0.75rem', fontWeight: 800, whiteSpace: 'nowrap',
          boxShadow: 'var(--shadow-sm)',
        }}>
          {statusBadge || plan.badge}
        </div>
      )}

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.15rem', marginBottom: 8 }}>
          {plan.name}
        </div>
        <div style={{ fontSize: '2.4rem', fontWeight: 900, fontFamily: 'Outfit, sans-serif', lineHeight: 1, marginBottom: 6 }}>
          {formatNaira(plan.price)}
        </div>
        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          per {plan.durationDays} days
        </div>
      </div>

      <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.6 }}>
        {plan.description}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28, flex: 1 }}>
        {(plan.features || [
          plan.maxProperties === Infinity
            ? 'Unlimited property listings'
            : `Up to ${plan.maxProperties} propert${plan.maxProperties > 1 ? 'ies' : 'y'}`,
          `${plan.durationDays}-day active period`,
          'KYC-verified landlord badge',
          'Direct tenant inquiries',
          'Analytics dashboard',
        ]).map((feat, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <CheckCircle size={15} color={isLocked ? 'var(--text-muted)' : 'var(--accent-teal)'} style={{ flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontSize: '0.85rem', color: isLocked ? 'var(--text-muted)' : 'var(--text-secondary)' }}>{feat}</span>
          </div>
        ))}
      </div>

      <button
        className={`btn ${isCurrent ? 'btn-secondary' : isHighlighted ? 'btn-primary' : 'btn-secondary'}`}
        style={{
          width: '100%',
          cursor: buttonDisabled ? 'not-allowed' : 'pointer',
          opacity: buttonDisabled ? 0.6 : 1,
        }}
        onClick={buttonDisabled ? undefined : onSelect}
        disabled={buttonDisabled}
        id={`plan-select-${plan.id}`}
      >
        {buttonText}
        {!buttonDisabled && <ArrowRight size={16} />}
      </button>
    </div>
  );
}

function BoostCard({ tier, isMostPopular, onSelect, isLandlord }) {
  return (
    <div style={{
      background: 'var(--card-bg)',
      border: `2px solid ${isMostPopular ? tier.color : 'var(--card-border)'}`,
      borderRadius: 'var(--radius-xl)',
      padding: '28px 22px',
      position: 'relative',
      display: 'flex', flexDirection: 'column',
      transition: 'all 0.25s ease',
      boxShadow: isMostPopular ? `0 8px 32px ${tier.color}30` : 'var(--card-shadow)',
    }}>
      {isMostPopular && (
        <div style={{
          position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)',
          background: tier.gradient, color: 'white',
          padding: '4px 14px', borderRadius: 'var(--radius-full)',
          fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap',
        }}>
          Most Popular
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <span style={{ fontSize: '1.8rem' }}>{tier.emoji}</span>
        <div>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.05rem' }}>
            {tier.name}
          </div>
          <div style={{
            display: 'inline-block',
            padding: '2px 8px', borderRadius: 'var(--radius-full)',
            background: `${tier.color}20`, color: tier.color,
            fontSize: '0.7rem', fontWeight: 700,
          }}>
            {tier.id.toUpperCase()}
          </div>
        </div>
      </div>

      <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2rem', fontWeight: 900, marginBottom: 4, lineHeight: 1 }}>
        {formatNaira(tier.price)}
      </div>
      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 16 }}>
        per property / {tier.durationDays} days
      </div>

      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 18, lineHeight: 1.55 }}>
        {tier.description}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, marginBottom: 22 }}>
        {tier.perks.map((perk, i) => (
          <div key={i} style={{ display: 'flex', gap: 7, alignItems: 'flex-start' }}>
            <span style={{ color: tier.color, fontSize: '0.85rem', flexShrink: 0 }}>✦</span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{perk}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onSelect}
        id={`boost-select-${tier.id}`}
        style={{
          width: '100%', padding: '12px',
          borderRadius: 'var(--radius-full)',
          border: 'none', cursor: 'pointer',
          background: tier.gradient, color: 'white',
          fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.9rem',
          transition: 'all 0.2s', boxShadow: `0 4px 16px ${tier.color}40`,
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${tier.color}55`; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = `0 4px 16px ${tier.color}40`; }}
      >
        {isLandlord ? `Boost with ${tier.name}` : 'Start as Landlord'}
      </button>
    </div>
  );
}
