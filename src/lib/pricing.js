/**
 * Technispace – Pricing Constants (all amounts in Naira ₦)
 */

// ─── Listing Plans ────────────────────────────────────────────────────────────
export const LISTING_PLANS = {
  single: {
    id: 'single',
    name: 'Single Listing',
    price: 10_000,
    maxProperties: 1,
    durationDays: 30,
    description: 'List one property for 30 days.',
    badge: null,
    color: 'var(--text-secondary)',
    features: [
      'Up to 1 property listing',
      '30-day active listing period',
      'KYC-verified landlord trust badge',
      'Direct tenant inquiries (direct chat/messaging)',
      'Analytics dashboard (view tracking, inquiries, clicks)',
    ],
  },
  starter: {
    id: 'starter',
    name: 'Starter Bundle',
    price: 50_000,
    maxProperties: 10,
    durationDays: 30,
    description: 'Up to 10 properties listed for 30 days.',
    badge: 'Popular',
    color: 'var(--brand-primary)',
    features: [
      'Up to 10 property listings',
      '30-day active listing period',
      'KYC-verified landlord trust badge',
      'Direct tenant inquiries',
      'Analytics dashboard',
      'Bulk listing management',
    ],
  },
  unlimited: {
    id: 'unlimited',
    name: 'Unlimited Plan',
    price: 100_000,
    maxProperties: Infinity,
    durationDays: 30,
    description: 'Unlimited properties listed for 30 days.',
    badge: 'Best Value',
    color: 'var(--accent-amber)',
    features: [
      'Unlimited property listings',
      '30-day active listing period',
      'KYC-verified landlord trust badge',
      'Direct tenant inquiries',
      'Analytics dashboard',
      'Bulk listing management',
      'Priority customer support',
    ],
  },
};

// Price per extra listing slot when property capacity is exhausted
export const EXTRA_SLOT_PRICE = 5_000;

// Allowed direct upgrades: single -> starter, starter -> unlimited
export const UPGRADE_PATHS = {
  single: 'starter',
  starter: 'unlimited',
};

export const getNextUpgradePlan = (currentPlanId) => {
  const targetId = UPGRADE_PATHS[currentPlanId];
  return targetId ? LISTING_PLANS[targetId] : null;
};

// ─── Boost Tiers ──────────────────────────────────────────────────────────────
export const BOOST_TIERS = {
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 5_000,
    durationDays: 30,
    description: 'Featured in category search results.',
    emoji: '⭐',
    color: '#6c47ff',
    gradient: 'linear-gradient(135deg, #6c47ff, #a78bfa)',
    perks: [
      'Featured badge on property card',
      'Higher search ranking in filters',
      'Bold listing card styling',
    ],
  },
  gold: {
    id: 'gold',
    name: 'Gold',
    price: 10_000,
    durationDays: 30,
    description: 'Top of search results in your city.',
    emoji: '🥇',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    perks: [
      'Gold badge on property card',
      'City top ranking in local searches',
      'Highlighted card in browse view',
      'SMS alert sent to active tenants searching in that city',
    ],
  },
  platinum: {
    id: 'platinum',
    name: 'Platinum',
    price: 20_000,
    durationDays: 30,
    description: 'Homepage feature slot + priority ranking.',
    emoji: '💎',
    color: '#06b6d4',
    gradient: 'linear-gradient(135deg, #06b6d4, #6c47ff)',
    perks: [
      'Platinum badge on property card',
      'Homepage feature slot',
      'Priority nationwide ranking',
      'Email blast to registered active tenants',
      'Comprehensive analytics dashboard',
    ],
  },
  diamond: {
    id: 'diamond',
    name: 'Diamond',
    price: 30_000,
    durationDays: 30,
    description: 'Maximum visibility — #1 on all searches.',
    emoji: '💠',
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #06b6d4)',
    perks: [
      'Diamond badge on property card',
      '#1 nationwide placement across search and browse',
      'Dedicated landing page for the property',
      'WhatsApp alert blast to prospective tenants',
      'Premium analytics insights',
      'Priority 24/7 dedicated support',
    ],
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const formatNaira = (amount) =>
  `₦${Number(amount).toLocaleString('en-NG')}`;

export const addDays = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

export const isExpired = (dateStr) => {
  if (!dateStr) return true;
  return new Date(dateStr) < new Date();
};
