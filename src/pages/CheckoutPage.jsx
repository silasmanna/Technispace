import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, ShieldCheck, ArrowLeft, ExternalLink, Lock, Download, FileText, Image as ImageIcon, Printer, PlusCircle, ArrowUpCircle } from 'lucide-react';
import { LISTING_PLANS, BOOST_TIERS, EXTRA_SLOT_PRICE, UPGRADE_PATHS, formatNaira } from '../lib/pricing';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import { useToast } from '../context/ToastContext';
import { useProperty } from '../context/PropertyContext';
import { initializePaystackPayment, generatePaystackRef, DEFAULT_PAYSTACK_KEY } from '../lib/paystack';

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') || 'plan'; // 'plan' | 'boost' | 'slot'
  const initialId = searchParams.get('id') || (initialType === 'plan' ? 'starter' : 'gold');
  const initialPropId = searchParams.get('propertyId') || '';
  const initialSlotCount = Math.max(1, Number(searchParams.get('count') || 1));

  const { user } = useAuth();
  const { getLandlordPlan, purchasePlan, boostProperty, purchaseExtraSlot } = useSubscription();
  const { properties } = useProperty();
  const { toast } = useToast();
  const navigate = useNavigate();

  const currentSub = user && user.role === 'landlord' ? getLandlordPlan(user.id) : null;
  const currentPlanId = currentSub?.planId || null;
  const nextUpgradePlanId = currentPlanId ? UPGRADE_PATHS[currentPlanId] : null;

  // Dynamic selection state allowing the landlord to switch plans, boost packages, extra slots, and target properties
  const [selectedType, setSelectedType] = useState(initialType);
  const [selectedId, setSelectedId] = useState(() => {
    // If landlord already has a plan and clicked plan checkout, default to the next allowed upgrade
    if (initialType === 'plan' && currentPlanId && nextUpgradePlanId && initialId !== nextUpgradePlanId && initialId !== currentPlanId) {
      return nextUpgradePlanId;
    }
    return initialId;
  });
  const [selectedPropId, setSelectedPropId] = useState(initialPropId);
  const [slotCount, setSlotCount] = useState(initialSlotCount);

  const [processing, setProcessing] = useState(false);
  const [showPaystackModal, setShowPaystackModal] = useState(false);
  const [paystackChannel, setPaystackChannel] = useState('card'); // 'card' | 'bank' | 'ussd'
  const [done, setDone] = useState(false);
  const [txnRef, setTxnRef] = useState('');
  const [authEmail, setAuthEmail] = useState(user?.email || 'landlord@technipal.com.ng');

  if (!user || user.role !== 'landlord') {
    navigate('/login');
    return null;
  }

  // Determine current active item based on user selection
  let item = null;
  if (selectedType === 'slot') {
    item = {
      id: 'slot',
      name: `Additional Listing Slot${slotCount > 1 ? `s (x${slotCount})` : ''}`,
      price: EXTRA_SLOT_PRICE * slotCount,
      durationDays: currentSub ? 30 : 30,
      description: `Add ${slotCount} extra listing slot${slotCount > 1 ? 's' : ''} to your property capacity.`,
    };
  } else if (selectedType === 'plan') {
    item = LISTING_PLANS[selectedId] || LISTING_PLANS.starter;
  } else {
    item = BOOST_TIERS[selectedId] || BOOST_TIERS.gold;
  }

  // Landlord's properties
  const myProperties = properties.filter(p => p.landlordId === user.id);

  // Fallback to first property if boost type but no property selected yet
  const activePropertyId = selectedPropId || (myProperties.length > 0 ? myProperties[0].id : '');
  const boostedProperty = properties.find(p => p.id === activePropertyId);

  // Complete subscription after Paystack confirms
  const handlePaymentSuccess = (reference) => {
    let result;
    if (selectedType === 'slot') {
      result = purchaseExtraSlot(user.id, slotCount);
    } else if (selectedType === 'plan') {
      result = purchasePlan(user.id, selectedId);
    } else {
      const targetPropId = activePropertyId || `prop-${Date.now()}`;
      result = boostProperty(user.id, targetPropId, selectedId);
    }

    const ref = reference || result?.transaction?.ref || generatePaystackRef();
    setTxnRef(ref);
    setProcessing(false);
    setShowPaystackModal(false);
    setDone(true);
    toast.success('Payment Received! 🎉', `${item.name} activated via Paystack.`);
  };

  const handleLaunchPaystack = async () => {
    setProcessing(true);
    const reference = generatePaystackRef();

    const paystackSession = await initializePaystackPayment({
      key: DEFAULT_PAYSTACK_KEY,
      email: authEmail,
      amount: item.price,
      reference,
      metadata: {
        itemType: selectedType,
        itemId: selectedId,
        propertyId: selectedType === 'boost' ? activePropertyId : undefined,
        landlordId: user.id,
        landlordName: user.name,
      },
      onSuccess: (res) => {
        handlePaymentSuccess(res.reference || reference);
      },
      onClose: () => {
        setProcessing(false);
        toast.info('Payment Cancelled', 'Paystack payment window was closed.');
      },
    });

    // If live PaystackPop iframe is successfully opened, it will invoke callbacks.
    // If running in development / test fallback mode, display the responsive Paystack Checkout modal:
    if (paystackSession?.mode === 'simulated' || !window.PaystackPop) {
      setProcessing(false);
      setShowPaystackModal(true);
    }
  };

  // Download receipt as PDF (via formatted window print engine)
  const handleDownloadPDF = () => {
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) {
      window.print();
      return;
    }
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Technispace Receipt - ${txnRef}</title>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;900&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Outfit', sans-serif; padding: 40px; color: #1e293b; max-width: 650px; margin: 0 auto; background: #fff; }
          .receipt-box { border: 2px solid #e2e8f0; border-radius: 16px; padding: 36px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 20px; margin-bottom: 24px; }
          .brand { font-size: 24px; font-weight: 900; color: #6c47ff; letter-spacing: -0.5px; }
          .badge { background: #dcfce7; color: #15803d; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 700; }
          .ref { font-family: monospace; font-size: 13px; color: #64748b; margin-top: 4px; }
          .title { font-size: 20px; font-weight: 800; margin-bottom: 4px; }
          .table { width: 100%; border-collapse: collapse; margin-top: 20px; margin-bottom: 24px; }
          .table tr { border-bottom: 1px solid #f1f5f9; }
          .table td { padding: 12px 0; font-size: 14px; }
          .table td:last-child { text-align: right; font-weight: 700; color: #0f172a; }
          .table td.total { font-size: 18px; color: #6c47ff; font-weight: 900; }
          .footer { text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 20px; margin-top: 24px; }
        </style>
      </head>
      <body>
        <div class="receipt-box">
          <div class="header">
            <div>
              <div class="brand">Technispace 🇳🇬</div>
              <div class="ref">Ref: ${txnRef}</div>
            </div>
            <div class="badge">● Paystack Verified</div>
          </div>
          <div class="title">Official Payment Receipt</div>
          <p style="color: #64748b; font-size: 14px; margin-top: 0;">Issued on ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>

          <table class="table">
            <tr><td>Landlord Name</td><td>${user.name}</td></tr>
            <tr><td>Email</td><td>${authEmail}</td></tr>
            <tr><td>Item Purchased</td><td>${item.name}</td></tr>
            <tr><td>Duration</td><td>${item.durationDays} days</td></tr>
            ${type === 'plan' ? `<tr><td>Listing Capacity</td><td>${item.maxProperties === Infinity ? 'Unlimited' : item.maxProperties} Property</td></tr>` : ''}
            <tr><td>Payment Channel</td><td>Paystack (NGN)</td></tr>
            <tr><td>Status</td><td style="color: #16a34a;">Paid in Full</td></tr>
            <tr><td class="total">Amount Paid</td><td class="total">${formatNaira(item.price)}</td></tr>
          </table>

          <div class="footer">
            Technispace Technologies Limited · Lagos, Nigeria<br>
            Thank you for choosing Technispace. All rentals are 100% agent-free.
          </div>
        </div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // Download receipt as PNG image via Canvas drawing
  const handleDownloadImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 700;
    canvas.height = 780;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Outer card stroke
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

    // Header gradient banner
    const grad = ctx.createLinearGradient(30, 30, canvas.width - 30, 30);
    grad.addColorStop(0, '#6c47ff');
    grad.addColorStop(1, '#09a5ed');
    ctx.fillStyle = grad;
    ctx.fillRect(32, 32, canvas.width - 64, 110);

    // Header Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText('TECHNISPACE 🇳🇬', 60, 80);
    ctx.font = '14px sans-serif';
    ctx.fillText('Official Payment Receipt · Powered by Paystack', 60, 110);

    // Paystack badge
    ctx.fillStyle = '#dcfce7';
    ctx.fillRect(canvas.width - 190, 60, 130, 32);
    ctx.fillStyle = '#15803d';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('VERIFIED PAID', canvas.width - 175, 81);

    // Body content
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('Transaction Summary', 60, 185);

    ctx.fillStyle = '#64748b';
    ctx.font = '13px monospace';
    ctx.fillText(`Transaction Reference: ${txnRef}`, 60, 210);
    ctx.fillText(`Date: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`, 60, 230);

    // Table rows
    const rows = [
      ['Customer / Landlord', user.name],
      ['Payer Email', authEmail],
      ['Service / Package', item.name],
      ['Active Duration', `${item.durationDays} Days`],
      ['Payment Gateway', 'Paystack (Nigeria)'],
      ['Total Amount Paid', formatNaira(item.price)],
    ];

    let startY = 280;
    rows.forEach(([label, val], idx) => {
      ctx.fillStyle = idx % 2 === 0 ? '#f8fafc' : '#ffffff';
      ctx.fillRect(60, startY - 24, canvas.width - 120, 42);

      ctx.fillStyle = '#475569';
      ctx.font = '15px sans-serif';
      ctx.fillText(label, 76, startY);

      ctx.fillStyle = label.includes('Total') ? '#6c47ff' : '#0f172a';
      ctx.font = label.includes('Total') ? 'bold 18px sans-serif' : 'bold 15px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(val, canvas.width - 76, startY);
      ctx.textAlign = 'left';

      startY += 48;
    });

    // Footer
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Technispace Technologies Limited · 100% Agent-Free Direct Rental Platform', canvas.width / 2, canvas.height - 70);
    ctx.fillText('Securely processed via Paystack. Contact: support@technipal.com.ng', canvas.width / 2, canvas.height - 50);

    // Trigger download
    const link = document.createElement('a');
    link.download = `Technispace-Receipt-${txnRef}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    toast.success('Receipt Downloaded! 📸', 'Saved as high-resolution image.');
  };

  if (done) {
    return (
      <div className="list-property-page" style={{ maxWidth: 580, textAlign: 'center', paddingTop: 80, paddingBottom: 80 }}>
        <div style={{
          width: 88, height: 88, borderRadius: '50%',
          background: 'rgba(16, 185, 129, 0.12)', margin: '0 auto 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#10b981',
        }}>
          <CheckCircle size={44} />
        </div>

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '4px 14px', borderRadius: 'var(--radius-full)',
          background: 'rgba(16, 185, 129, 0.1)', color: '#10b981',
          fontSize: '0.8rem', fontWeight: 700, marginBottom: 12,
        }}>
          <span>●</span> Paystack Verified Payment
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 10 }}>Payment Successful!</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 6 }}>
          <strong>{item.name}</strong> has been activated on your account.
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: 28 }}>
          Paystack Ref: <code style={{ fontFamily: 'monospace', background: 'var(--bg-elevated)', padding: '3px 8px', borderRadius: 4, color: 'var(--brand-primary)', fontWeight: 600 }}>{txnRef}</code>
        </p>

        {/* Receipt Container */}
        <div id="payment-receipt-card" style={{
          background: 'var(--card-bg)', border: '1px solid var(--card-border)',
          borderRadius: 'var(--radius-xl)', padding: '24px 28px', marginBottom: 24, textAlign: 'left',
          boxShadow: 'var(--card-shadow)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--border-color)', paddingBottom: 14, marginBottom: 14 }}>
            <div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1.1rem', color: 'var(--brand-primary)' }}>
                Technispace 🇳🇬
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Official Payment Receipt</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>DATE</div>
              <div style={{ fontWeight: 700, fontSize: '0.82rem' }}>{new Date().toLocaleDateString('en-GB')}</div>
            </div>
          </div>

          {[
            { label: 'Purchased Item', value: item.name },
            ...(selectedType === 'boost' && boostedProperty ? [
              { label: 'Boosted Property', value: boostedProperty.title },
            ] : []),
            { label: 'Amount Paid', value: formatNaira(item.price), accent: true },
            { label: 'Payment Gateway', value: 'Paystack (NGN)' },
            { label: 'Duration Active', value: `${item.durationDays} days` },
            ...(selectedType === 'plan' ? [
              { label: 'Max Properties', value: item.maxProperties === Infinity ? 'Unlimited' : item.maxProperties },
            ] : []),
            { label: 'Payer Email', value: authEmail },
            { label: 'Payment Status', value: 'Completed & Verified', accent: true },
          ].map(({ label, value, accent }) => (
            <div key={label} style={{
              display: 'flex', justifyContent: 'space-between', padding: '10px 0',
              borderBottom: '1px solid var(--border-color)', fontSize: '0.88rem',
            }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{label}</span>
              <span style={{ color: accent ? 'var(--accent-teal)' : 'var(--text-primary)', fontWeight: 700 }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Download Receipt Actions */}
        <div style={{
          background: 'var(--bg-subtle)', border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)', padding: '16px 20px', marginBottom: 28,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
        }}>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Save Your Receipt</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Keep a copy for your records or tax filings.</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleDownloadPDF}
              id="download-receipt-pdf-btn"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <FileText size={15} color="var(--brand-primary)" />
              PDF / Print
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleDownloadImage}
              id="download-receipt-image-btn"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <ImageIcon size={15} color="var(--accent-teal)" />
              Save Image (PNG)
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          {type === 'plan' && (
            <button className="btn btn-primary" onClick={() => navigate('/dashboard/properties/new')}>
              List a Property Now →
            </button>
          )}
          <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>
            Go to Landlord Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="list-property-page" style={{ maxWidth: 640 }}>
      <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}
        style={{ marginBottom: 24, display: 'flex', gap: 6, alignItems: 'center' }}>
        <ArrowLeft size={15} /> Back to Pricing
      </button>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, margin: 0 }}>Checkout</h1>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(9, 165, 237, 0.1)', color: '#09a5ed',
          padding: '6px 14px', borderRadius: 'var(--radius-full)',
          fontSize: '0.82rem', fontWeight: 700,
        }}>
          <span>⚡</span> Secured by Paystack
        </div>
      </div>

      <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>
        All Technispace payments are securely processed via Paystack in Nigerian Naira (₦).
      </p>

      {/* ── Package & Property Customizer ── */}
      <div style={{
        background: 'var(--card-bg)', border: '1px solid var(--card-border)',
        borderRadius: 'var(--radius-xl)', padding: '24px 28px', marginBottom: 24,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0 }}>
            Choose / Change Package
          </h2>
          {/* Switch Type Tabs */}
          <div style={{
            display: 'inline-flex', background: 'var(--bg-elevated)',
            border: '1px solid var(--border-color)', borderRadius: 'var(--radius-full)', padding: 3,
            flexWrap: 'wrap',
          }}>
            <button
              type="button"
              id="checkout-type-plan"
              onClick={() => {
                setSelectedType('plan');
                if (currentPlanId && nextUpgradePlanId) {
                  setSelectedId(nextUpgradePlanId);
                } else if (!LISTING_PLANS[selectedId]) {
                  setSelectedId('starter');
                }
              }}
              style={{
                padding: '6px 14px', borderRadius: 'var(--radius-full)',
                border: 'none', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700,
                background: selectedType === 'plan' ? 'var(--brand-primary)' : 'transparent',
                color: selectedType === 'plan' ? 'white' : 'var(--text-secondary)',
                transition: 'all 0.15s',
              }}
            >
              {currentPlanId ? '⬆️ Plan Upgrade' : '🏠 Listing Plan'}
            </button>
            <button
              type="button"
              id="checkout-type-slot"
              onClick={() => setSelectedType('slot')}
              style={{
                padding: '6px 14px', borderRadius: 'var(--radius-full)',
                border: 'none', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700,
                background: selectedType === 'slot' ? 'var(--accent-teal)' : 'transparent',
                color: selectedType === 'slot' ? 'white' : 'var(--text-secondary)',
                transition: 'all 0.15s',
              }}
            >
              ➕ Extra Slot
            </button>
            <button
              type="button"
              id="checkout-type-boost"
              onClick={() => {
                setSelectedType('boost');
                if (!BOOST_TIERS[selectedId]) setSelectedId('gold');
              }}
              style={{
                padding: '6px 14px', borderRadius: 'var(--radius-full)',
                border: 'none', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700,
                background: selectedType === 'boost' ? 'var(--brand-primary)' : 'transparent',
                color: selectedType === 'boost' ? 'white' : 'var(--text-secondary)',
                transition: 'all 0.15s',
              }}
            >
              🚀 Boost Tier
            </button>
          </div>
        </div>

        {/* Tier Cards Selector */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10, marginBottom: (selectedType === 'boost' || selectedType === 'slot') ? 20 : 0 }}>
          {selectedType === 'slot' ? (
            <div style={{
              gridColumn: '1 / -1',
              background: 'rgba(6, 214, 160, 0.08)',
              border: '1.5px solid var(--accent-teal)',
              borderRadius: 'var(--radius-md)',
              padding: '16px 20px',
              display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between',
              gap: 16,
            }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: 2 }}>
                  Additional Listing Slots
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  ₦5,000 per extra property slot · Expand listing capacity without upgrading entire tier
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Number of Slots:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {[1, 2, 3, 5].map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setSlotCount(n)}
                      style={{
                        padding: '6px 12px', borderRadius: 'var(--radius-md)',
                        border: `1.5px solid ${slotCount === n ? 'var(--accent-teal)' : 'var(--border-color)'}`,
                        background: slotCount === n ? 'var(--accent-teal)' : 'var(--bg-elevated)',
                        color: slotCount === n ? 'white' : 'var(--text-primary)',
                        fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
                      }}
                    >
                      +{n} ({formatNaira(EXTRA_SLOT_PRICE * n)})
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : selectedType === 'plan' ? (
            Object.values(LISTING_PLANS).map(p => {
              const isCurrent = currentPlanId === p.id;
              const isNextUpgrade = nextUpgradePlanId === p.id;
              const isLocked = currentPlanId && !isCurrent && !isNextUpgrade;

              return (
                <div
                  key={p.id}
                  onClick={() => {
                    if (!isLocked) setSelectedId(p.id);
                  }}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    cursor: isLocked ? 'not-allowed' : 'pointer',
                    opacity: isLocked ? 0.45 : 1,
                    border: `2px solid ${selectedId === p.id ? 'var(--brand-primary)' : 'var(--border-color)'}`,
                    background: selectedId === p.id ? 'rgba(108,71,255,0.08)' : 'var(--bg-elevated)',
                    transition: 'all 0.15s',
                    position: 'relative',
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>{p.name}</div>
                  <div style={{ fontWeight: 900, fontSize: '0.95rem', color: 'var(--brand-primary)', marginTop: 4 }}>
                    {formatNaira(p.price)}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    {p.maxProperties === Infinity ? 'Unlimited' : `${p.maxProperties} Prop`}
                  </div>
                  {isCurrent && (
                    <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--accent-teal)', marginTop: 4 }}>
                      ✓ CURRENT
                    </div>
                  )}
                  {isNextUpgrade && (
                    <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--brand-primary)', marginTop: 4 }}>
                      ⬆️ UPGRADE
                    </div>
                  )}
                  {isLocked && (
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', marginTop: 4 }}>
                      🔒 LOCKED
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            Object.values(BOOST_TIERS).map(b => (
              <div
                key={b.id}
                onClick={() => setSelectedId(b.id)}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  border: `2px solid ${selectedId === b.id ? b.color : 'var(--border-color)'}`,
                  background: selectedId === b.id ? `${b.color}15` : 'var(--bg-elevated)',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, fontSize: '0.85rem' }}>
                  <span>{b.emoji}</span> {b.name}
                </div>
                <div style={{ fontWeight: 900, fontSize: '0.95rem', color: b.color, marginTop: 4 }}>
                  {formatNaira(b.price)}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  30 Days Boost
                </div>
              </div>
            ))
          )}
        </div>

        {/* Property Selector for Boost */}
        {selectedType === 'boost' && (
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 16 }}>
            <label className="form-label" style={{ fontSize: '0.82rem', marginBottom: 6 }}>
              Select Property to Boost *
            </label>
            {myProperties.length > 0 ? (
              <select
                className="form-input form-select"
                value={activePropertyId}
                onChange={e => setSelectedPropId(e.target.value)}
                style={{ fontWeight: 600 }}
              >
                {myProperties.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.city}, {p.state}) — {formatNaira(p.price)}/mo
                  </option>
                ))}
              </select>
            ) : (
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', background: 'var(--bg-subtle)', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}>
                ℹ️ You do not have listed properties yet. You can purchase this boost now, and it will be applied to your next created listing!
              </div>
            )}
          </div>
        )}
      </div>

      {/* Order Summary */}
      <div style={{
        background: 'var(--card-bg)', border: '1px solid var(--card-border)',
        borderRadius: 'var(--radius-xl)', padding: '28px 32px', marginBottom: 24,
      }}>
        <h2 style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: 20, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Order Summary
        </h2>

        {/* Item */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '16px 0', borderBottom: '1px solid var(--border-color)', marginBottom: 16,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 'var(--radius-md)',
            background: selectedType === 'slot' ? 'var(--accent-teal)' : selectedType === 'boost' ? BOOST_TIERS[selectedId]?.gradient : 'var(--brand-gradient)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: selectedType === 'slot' ? '1.3rem' : selectedType === 'boost' ? BOOST_TIERS[selectedId]?.emoji : '🏠', color: 'white', flexShrink: 0,
          }}>
            {selectedType === 'slot' ? '➕' : selectedType === 'boost' ? BOOST_TIERS[selectedId]?.emoji : '🏠'}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700 }}>{item.name}</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{item.description}</div>
            {selectedType === 'boost' && boostedProperty && (
              <div style={{ fontSize: '0.78rem', color: 'var(--brand-primary)', marginTop: 4, fontWeight: 600 }}>
                🚀 Applied to: <strong>{boostedProperty.title}</strong>
              </div>
            )}
            {selectedType === 'slot' && (
              <div style={{ fontSize: '0.78rem', color: 'var(--accent-teal)', marginTop: 4, fontWeight: 600 }}>
                ✨ Adds {slotCount} active listing slot{slotCount > 1 ? 's' : ''} to your account instantly
              </div>
            )}
          </div>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1.2rem' }}>
            {formatNaira(item.price)}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: 8 }}>
          <span style={{ color: 'var(--text-secondary)' }}>Active Duration</span>
          <span style={{ fontWeight: 600 }}>{item.durationDays} days</span>
        </div>

        {selectedType === 'plan' && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: 8 }}>
            <span style={{ color: 'var(--text-secondary)' }}>Listing Capacity</span>
            <span style={{ fontWeight: 600 }}>{item.maxProperties === Infinity ? 'Unlimited Properties' : `${item.maxProperties} Property`}</span>
          </div>
        )}

        {selectedType === 'slot' && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: 8 }}>
            <span style={{ color: 'var(--text-secondary)' }}>Additional Property Slots</span>
            <span style={{ fontWeight: 700, color: 'var(--accent-teal)' }}>+{slotCount} Property Slot{slotCount > 1 ? 's' : ''}</span>
          </div>
        )}

        <div style={{ borderTop: '2px solid var(--border-color)', marginTop: 16, paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem' }}>Total Amount Due</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Includes all Paystack processing fees</div>
          </div>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1.5rem', color: 'var(--brand-primary)' }}>
            {formatNaira(item.price)}
          </span>
        </div>
      </div>

      {/* Paystack Channel Overview */}
      <div style={{
        background: 'var(--card-bg)', border: '1px solid var(--card-border)',
        borderRadius: 'var(--radius-xl)', padding: '24px 28px', marginBottom: 24,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: '#09a5ed', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.85rem', fontWeight: 900,
          }}>
            P
          </div>
          <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Pay with Paystack</div>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
          You can complete this payment using any of Paystack's verified Nigerian channels:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10, marginBottom: 18 }}>
          {[
            { title: 'Cards', sub: 'Mastercard, Visa, Verve' },
            { title: 'Bank Transfer', sub: 'Direct instant transfer' },
            { title: 'USSD', sub: '*737#, *919#, *894#' },
            { title: 'Apple Pay & QR', sub: 'Instant mobile scan' },
          ].map(c => (
            <div key={c.title} style={{
              background: 'var(--bg-elevated)', border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)', padding: '10px 12px',
            }}>
              <div style={{ fontWeight: 700, fontSize: '0.82rem' }}>{c.title}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{c.sub}</div>
            </div>
          ))}
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label" style={{ fontSize: '0.82rem' }}>Receipt Email Address</label>
          <input
            className="form-input"
            type="email"
            value={authEmail}
            onChange={e => setAuthEmail(e.target.value)}
            placeholder="your@email.com"
            required
          />
        </div>
      </div>

      {/* Security note */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '14px 18px', background: 'var(--bg-subtle)',
        borderRadius: 'var(--radius-md)', marginBottom: 24, fontSize: '0.82rem', color: 'var(--text-secondary)',
      }}>
        <ShieldCheck size={18} color="#09a5ed" style={{ flexShrink: 0 }} />
        <span>
          Secured by <strong>Paystack</strong> PCI-DSS Level 1 compliance. Technispace never stores your banking or card credentials.
        </span>
      </div>

      <button
        className="btn btn-primary btn-lg"
        style={{
          width: '100%',
          background: 'linear-gradient(135deg, #09a5ed, #0672a3)',
          border: 'none',
          boxShadow: '0 6px 20px rgba(9, 165, 237, 0.35)',
        }}
        onClick={handleLaunchPaystack}
        disabled={processing}
        id="checkout-paystack-btn"
      >
        {processing ? (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
            Opening Paystack…
          </span>
        ) : (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Lock size={16} />
            Pay {formatNaira(item.price)} with Paystack
          </span>
        )}
      </button>

      <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 16 }}>
        By clicking to pay, you will be redirected to Paystack's secure checkout.
      </p>

      {/* ── Interactive Paystack Modal ── */}
      {showPaystackModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 16,
        }}>
          <div style={{
            background: 'var(--card-bg)', border: '1px solid var(--card-border)',
            borderRadius: 'var(--radius-xl)', maxWidth: 440, width: '100%',
            overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
            animation: 'fadeIn 0.2s ease-out',
          }}>
            {/* Header */}
            <div style={{
              background: '#09a5ed', color: 'white', padding: '20px 24px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 900, fontSize: '1.1rem' }}>
                  <span>paystack</span>
                  <span style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.25)', padding: '2px 6px', borderRadius: 4 }}>TEST</span>
                </div>
                <div style={{ fontSize: '0.78rem', opacity: 0.9, marginTop: 2 }}>{authEmail}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 900 }}>{formatNaira(item.price)}</div>
                <div style={{ fontSize: '0.72rem', opacity: 0.85 }}>Technispace</div>
              </div>
            </div>

            {/* Paystack Channel Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-subtle)' }}>
              {[
                { id: 'card', label: '💳 Card' },
                { id: 'bank', label: '🏦 Transfer' },
                { id: 'ussd', label: '📱 USSD' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setPaystackChannel(tab.id)}
                  style={{
                    flex: 1, padding: '12px 0', border: 'none', background: 'transparent',
                    borderBottom: paystackChannel === tab.id ? '2px solid #09a5ed' : '2px solid transparent',
                    color: paystackChannel === tab.id ? '#09a5ed' : 'var(--text-secondary)',
                    fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px' }}>
              {paystackChannel === 'card' && (
                <div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Card Number</label>
                    <input className="form-input" defaultValue="4084 0841 0841 0841" readOnly style={{ fontFamily: 'monospace' }} />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.8rem' }}>Expiry</label>
                      <input className="form-input" defaultValue="12/28" readOnly />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.8rem' }}>CVV</label>
                      <input className="form-input" defaultValue="408" readOnly type="password" />
                    </div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 16 }}>
                    ℹ️ Test Card loaded. Click "Authorize Paystack" to complete the transaction.
                  </div>
                </div>
              )}

              {paystackChannel === 'bank' && (
                <div style={{
                  padding: '14px', background: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-md)', fontSize: '0.82rem', marginBottom: 16,
                  border: '1px solid var(--border-color)',
                }}>
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>Paystack Dynamic Virtual Account:</div>
                  <div>Bank: <strong>Wema Bank / Paystack</strong></div>
                  <div>Account: <strong style={{ letterSpacing: '0.05em' }}>9918237461</strong></div>
                  <div>Beneficiary: <strong>Paystack / Technispace</strong></div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 6 }}>
                    Expires in 30 minutes. Once received, Paystack automatically confirms.
                  </div>
                </div>
              )}

              {paystackChannel === 'ussd' && (
                <div style={{
                  padding: '14px', background: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-md)', fontSize: '0.82rem', marginBottom: 16,
                  border: '1px solid var(--border-color)', textAlign: 'center',
                }}>
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>Dial USSD Code:</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#09a5ed', letterSpacing: '0.05em' }}>
                    *737*50*{item.price}*291#
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 6 }}>
                    GTBank, Zenith, Access, UBA supported.
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  className="btn btn-primary"
                  style={{ flex: 1, background: '#09a5ed', border: 'none' }}
                  onClick={() => handlePaymentSuccess(generatePaystackRef())}
                  id="paystack-authorize-btn"
                >
                  Authorize {formatNaira(item.price)}
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={() => setShowPaystackModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>

            <div style={{
              padding: '10px 16px', background: 'var(--bg-subtle)',
              borderTop: '1px solid var(--border-color)', textAlign: 'center',
              fontSize: '0.72rem', color: 'var(--text-muted)',
            }}>
              🔒 Secured by Paystack Payment Gateway · Nigeria 🇳🇬
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
