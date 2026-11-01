/**
 * Paystack Integration Helper for Technispace
 *
 * Supports:
 * 1. Paystack Inline JS (official pop-up modal): Loads https://js.paystack.co/v1/inline.js dynamically
 * 2. Fallback Interactive Simulation Modal: If offline or keys are not yet configured,
 *    provides a realistic Paystack checkout modal (Card, Bank Transfer, USSD).
 */

const PAYSTACK_SCRIPT_URL = 'https://js.paystack.co/v1/inline.js';

// Default public test key fallback for development
export const DEFAULT_PAYSTACK_KEY =
  import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_technispace_demo_key';

/**
 * Dynamically load Paystack Pop Inline Script if not already present
 */
export function loadPaystackScript() {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && window.PaystackPop) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(`script[src="${PAYSTACK_SCRIPT_URL}"]`);
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.src = PAYSTACK_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.warn('Paystack inline script failed to load. Will fallback to simulated Paystack flow.');
      resolve(false);
    };
    document.head.appendChild(script);
  });
}

/**
 * Generate a standard Nigerian Paystack transaction reference
 */
export function generatePaystackRef(prefix = 'TECHNI') {
  const timestamp = Date.now();
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${timestamp}-${randomSuffix}`;
}

/**
 * Launch Paystack payment popup
 *
 * @param {Object} options
 * @param {string} options.key - Paystack public key (pk_test_... or pk_live_...)
 * @param {string} options.email - Customer email
 * @param {number} options.amount - Amount in Naira (will be converted to kobo: amount * 100)
 * @param {string} options.reference - Unique transaction reference
 * @param {Object} options.metadata - Custom metadata (planId, landlordId, etc.)
 * @param {Function} options.onSuccess - Callback receiving response ({ reference, trans, ... })
 * @param {Function} options.onClose - Callback when modal is closed
 */
export async function initializePaystackPayment({
  key = DEFAULT_PAYSTACK_KEY,
  email,
  amount, // in Naira
  reference = generatePaystackRef(),
  metadata = {},
  onSuccess,
  onClose,
}) {
  const isLoaded = await loadPaystackScript();
  const amountInKobo = Math.round(Number(amount) * 100);

  // PaystackPop requires an actual active Paystack account public key.
  // When running with mock / test dummy keys or in dev without live credentials,
  // we seamlessly use the built-in Paystack Checkout modal.
  const hasLiveRegisteredKey =
    key &&
    key.startsWith('pk_live_');

  if (isLoaded && typeof window !== 'undefined' && window.PaystackPop && hasLiveRegisteredKey) {
    try {
      const handler = window.PaystackPop.setup({
        key,
        email,
        amount: amountInKobo,
        currency: 'NGN',
        ref: reference,
        metadata: {
          custom_fields: [
            {
              display_name: 'Platform',
              variable_name: 'platform',
              value: 'Technispace Nigeria',
            },
            ...Object.entries(metadata).map(([k, v]) => ({
              display_name: k,
              variable_name: k,
              value: String(v),
            })),
          ],
        },
        callback: function (response) {
          if (onSuccess) onSuccess(response);
        },
        onClose: function () {
          if (onClose) onClose();
        },
      });

      handler.openIframe();
      return { mode: 'paystack_inline', handler };
    } catch (err) {
      console.warn('Paystack inline initialization encountered an error:', err);
    }
  }

  // Fallback to simulated Paystack checkout trigger
  return {
    mode: 'simulated',
    trigger: () => {
      // Handled in UI
    },
  };
}
