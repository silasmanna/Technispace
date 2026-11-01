import { createContext, useContext, useState } from 'react';
import { LISTING_PLANS, BOOST_TIERS, EXTRA_SLOT_PRICE, UPGRADE_PATHS, addDays, isExpired } from '../lib/pricing';

const SubscriptionContext = createContext();

/**
 * Manages:
 *  - Landlord listing plans (single / starter / unlimited)
 *  - Upgrades (single -> starter, starter -> unlimited)
 *  - Additional listing slots (₦5,000 per extra listing)
 *  - Per-property boost tiers (premium / gold / platinum / diamond)
 *  - Payment processing and transactions
 */
export function SubscriptionProvider({ children }) {
  // landlordId → { planId, expiresAt, propertiesUsed, extraSlots }
  const [subscriptions, setSubscriptions] = useState({
    'landlord-1': {
      planId: 'starter',
      expiresAt: addDays(25),
      propertiesUsed: 2,
      extraSlots: 0,
    },
  });

  // propertyId → { tier, expiresAt }
  const [boosts, setBoosts] = useState({
    'prop-2': { tier: 'gold', expiresAt: addDays(18) },
    'prop-4': { tier: 'diamond', expiresAt: addDays(22) },
  });

  // Payment transaction history
  const [transactions, setTransactions] = useState([
    {
      id: 'txn-1',
      landlordId: 'landlord-1',
      type: 'subscription',
      planId: 'starter',
      amount: 50_000,
      status: 'paid',
      date: '2026-10-01',
      ref: 'TXN-20261001-001',
    },
    {
      id: 'txn-2',
      landlordId: 'landlord-1',
      type: 'boost',
      propertyId: 'prop-2',
      boostTier: 'gold',
      amount: 10_000,
      status: 'paid',
      date: '2026-10-05',
      ref: 'TXN-20261005-002',
    },
  ]);

  // ── Getters ────────────────────────────────────────────────────────────────

  const getLandlordPlan = (landlordId) => {
    const sub = subscriptions[landlordId];
    if (!sub || isExpired(sub.expiresAt)) return null;
    return sub;
  };

  /**
   * Total listing capacity = base plan maxProperties + purchased extraSlots
   */
  const getMaxListingCapacity = (landlordId) => {
    const sub = getLandlordPlan(landlordId);
    if (!sub) return 0;
    const plan = LISTING_PLANS[sub.planId];
    if (!plan) return 0;
    if (plan.maxProperties === Infinity) return Infinity;
    return plan.maxProperties + (sub.extraSlots || 0);
  };

  const canListProperty = (landlordId, currentPropertyCount) => {
    const maxCapacity = getMaxListingCapacity(landlordId);
    if (maxCapacity === 0) return false;
    return currentPropertyCount < maxCapacity;
  };

  const getBoost = (propertyId) => {
    const boost = boosts[propertyId];
    if (!boost || isExpired(boost.expiresAt)) return null;
    return boost;
  };

  const getLandlordTransactions = (landlordId) =>
    transactions.filter(t => t.landlordId === landlordId);

  // ── Payment Actions ────────────────────────────────────────────────────────

  /**
   * Purchase, renew, or upgrade a listing plan for a landlord.
   * If existing plan is present, only direct upgrades are allowed:
   *   single -> starter, starter -> unlimited
   */
  const purchasePlan = (landlordId, planId) => {
    const plan = LISTING_PLANS[planId];
    if (!plan) return { success: false, error: 'Invalid plan' };

    const existing = subscriptions[landlordId];
    const propertiesUsed = existing?.propertiesUsed || 0;
    const extraSlots = existing?.extraSlots || 0;

    const newSub = {
      planId,
      expiresAt: addDays(plan.durationDays),
      propertiesUsed,
      extraSlots,
    };

    setSubscriptions(prev => ({ ...prev, [landlordId]: newSub }));

    const txn = {
      id: `txn-${Date.now()}`,
      landlordId,
      type: existing && existing.planId !== planId ? 'upgrade' : 'subscription',
      planId,
      amount: plan.price,
      status: 'paid',
      date: new Date().toISOString().split('T')[0],
      ref: `TXN-${Date.now()}`,
    };
    setTransactions(prev => [txn, ...prev]);

    return { success: true, subscription: newSub, transaction: txn };
  };

  /**
   * Purchase additional listing slots at ₦5,000 each.
   */
  const purchaseExtraSlot = (landlordId, count = 1) => {
    const sub = subscriptions[landlordId];
    if (!sub) return { success: false, error: 'No active subscription' };

    const cost = EXTRA_SLOT_PRICE * count;
    const newExtra = (sub.extraSlots || 0) + count;
    const updatedSub = { ...sub, extraSlots: newExtra };

    setSubscriptions(prev => ({ ...prev, [landlordId]: updatedSub }));

    const txn = {
      id: `txn-${Date.now()}`,
      landlordId,
      type: 'extra_slot',
      slotCount: count,
      amount: cost,
      status: 'paid',
      date: new Date().toISOString().split('T')[0],
      ref: `TXN-${Date.now()}`,
    };
    setTransactions(prev => [txn, ...prev]);

    return { success: true, subscription: updatedSub, transaction: txn };
  };

  /**
   * Pay for a single listing slot (no subscription).
   */
  const purchaseSingleListing = (landlordId) => {
    return purchasePlan(landlordId, 'single');
  };

  /**
   * Boost a specific property with a tier.
   */
  const boostProperty = (landlordId, propertyId, tierId) => {
    const tier = BOOST_TIERS[tierId];
    if (!tier) return { success: false, error: 'Invalid boost tier' };

    const newBoost = {
      tier: tierId,
      expiresAt: addDays(tier.durationDays),
    };

    setBoosts(prev => ({ ...prev, [propertyId]: newBoost }));

    const txn = {
      id: `txn-${Date.now()}`,
      landlordId,
      type: 'boost',
      propertyId,
      boostTier: tierId,
      amount: tier.price,
      status: 'paid',
      date: new Date().toISOString().split('T')[0],
      ref: `TXN-${Date.now()}`,
    };
    setTransactions(prev => [txn, ...prev]);

    return { success: true, boost: newBoost, transaction: txn };
  };

  /**
   * Increment the used property count for a landlord's plan.
   */
  const incrementPropertyCount = (landlordId) => {
    setSubscriptions(prev => {
      const sub = prev[landlordId];
      if (!sub) return prev;
      return { ...prev, [landlordId]: { ...sub, propertiesUsed: (sub.propertiesUsed || 0) + 1 } };
    });
  };

  return (
    <SubscriptionContext.Provider value={{
      subscriptions,
      boosts,
      transactions,
      getLandlordPlan,
      getMaxListingCapacity,
      canListProperty,
      getBoost,
      getLandlordTransactions,
      purchasePlan,
      purchaseSingleListing,
      purchaseExtraSlot,
      boostProperty,
      incrementPropertyCount,
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export const useSubscription = () => useContext(SubscriptionContext);
