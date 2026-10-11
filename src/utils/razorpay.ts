// Razorpay Standard Checkout (https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/).
// Set VITE_RAZORPAY_KEY_ID in .env (rzp_test_... while testing, rzp_live_... when you go live).
// This frontend-only version opens checkout with an amount. For live payments, create the order and
// verify the payment signature on a server (see README), then pass that order_id here.

const KEY = import.meta.env.VITE_RAZORPAY_KEY_ID?.trim();
const SCRIPT = 'https://checkout.razorpay.com/v1/checkout.js';

export const razorpayReady = !!KEY;
export const isTestKey = !!KEY?.startsWith('rzp_test_');

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}
interface RazorpayInstance {
  open: () => void;
  on: (event: 'payment.failed', cb: (r: { error: { description?: string } }) => void) => void;
}
type RazorpayCtor = new (options: Record<string, unknown>) => RazorpayInstance;

let loading: Promise<RazorpayCtor> | null = null;
function loadRazorpay(): Promise<RazorpayCtor> {
  const w = window as unknown as { Razorpay?: RazorpayCtor };
  if (w.Razorpay) return Promise.resolve(w.Razorpay);
  loading ??= new Promise<RazorpayCtor>((resolve, reject) => {
    const s = document.createElement('script');
    s.src = SCRIPT;
    s.async = true;
    s.onload = () => (w.Razorpay ? resolve(w.Razorpay) : reject(new Error('Razorpay did not load')));
    s.onerror = () => {
      loading = null;
      reject(new Error('Could not reach Razorpay. Check your internet connection and try again.'));
    };
    document.head.appendChild(s);
  });
  return loading;
}

export interface PayRequest {
  /** Total in rupees */
  amount: number;
  description: string;
  name: string;
  email: string;
  notes?: Record<string, string>;
}

/** Opens Razorpay checkout. Resolves with the payment id, rejects with 'dismissed' or the failure reason. */
export async function payWithRazorpay(req: PayRequest): Promise<string> {
  if (!KEY) throw new Error('Razorpay is not set up');
  const Razorpay = await loadRazorpay();
  return new Promise<string>((resolve, reject) => {
    const rzp = new Razorpay({
      key: KEY,
      amount: Math.round(req.amount * 100), // paise
      currency: 'INR',
      name: 'Takxila AI Academy',
      description: req.description,
      image: '/assets/logo-mark-dark.webp',
      prefill: { name: req.name, email: req.email },
      notes: req.notes ?? {},
      theme: { color: '#2B2BD6' },
      handler: (r: RazorpayResponse) => resolve(r.razorpay_payment_id),
      modal: { ondismiss: () => reject(new Error('dismissed')) },
    });
    rzp.on('payment.failed', (r) => reject(new Error(r.error.description || 'Payment failed')));
    rzp.open();
  });
}
