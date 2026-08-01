import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Truck, Wallet, CreditCard, Landmark, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { formatINR } from '../utils/format';
import toast from 'react-hot-toast';

const paymentOptions = [
  { value: 'UPI', label: 'UPI', icon: Wallet, hint: 'Pay via Google Pay, PhonePe, Paytm' },
  { value: 'Card', label: 'Credit Card', icon: CreditCard, hint: 'Visa, Mastercard, RuPay' },
  { value: 'Debit Card', label: 'Debit Card', icon: Landmark, hint: 'All major Indian banks' },
  { value: 'COD', label: 'Cash on Delivery', icon: Truck, hint: 'Pay when your order arrives' },
];

const Checkout = () => {
  const { cart, subtotal, refetch } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const items = cart.items || [];

  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [placing, setPlacing] = useState(false);

  if (items.length === 0) {
    return (
      <div className="container-app py-24 text-center">
        <h2 className="text-xl font-semibold mb-2">Nothing to check out</h2>
        <p className="text-slate-400 mb-6">Your cart is empty — add a few products first.</p>
        <Link to="/" className="btn-primary inline-flex">
          Continue shopping
        </Link>
      </div>
    );
  }

  const handleChange = (key) => (e) => setAddress((prev) => ({ ...prev, [key]: e.target.value }));

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setPlacing(true);
    try {
      const { data } = await api.post('/orders', { shippingAddress: address, paymentMethod });
      await refetch();
      toast.success('Order placed successfully!');
      navigate(`/order-success/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not place order');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="container-app py-10">
      <Link to="/cart" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-6">
        <ArrowLeft size={15} /> Back to cart
      </Link>

      <h1 className="text-2xl font-bold mb-8">Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping / billing address */}
          <div className="card p-6">
            <h3 className="font-semibold text-white mb-4">Shipping &amp; Billing Details</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="label">Full name</label>
                <input
                  required
                  className="input"
                  value={address.fullName}
                  onChange={handleChange('fullName')}
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="label">Phone number</label>
                <input
                  required
                  type="tel"
                  pattern="[0-9]{10}"
                  title="Enter a 10-digit phone number"
                  className="input"
                  value={address.phone}
                  onChange={handleChange('phone')}
                  placeholder="9876543210"
                />
              </div>
              <div>
                <label className="label">Pincode</label>
                <input
                  required
                  pattern="[0-9]{6}"
                  title="Enter a 6-digit pincode"
                  className="input"
                  value={address.pincode}
                  onChange={handleChange('pincode')}
                  placeholder="411001"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Address</label>
                <input
                  required
                  className="input"
                  value={address.addressLine}
                  onChange={handleChange('addressLine')}
                  placeholder="House no., street, locality"
                />
              </div>
              <div>
                <label className="label">City</label>
                <input required className="input" value={address.city} onChange={handleChange('city')} placeholder="Pune" />
              </div>
              <div>
                <label className="label">State</label>
                <input
                  required
                  className="input"
                  value={address.state}
                  onChange={handleChange('state')}
                  placeholder="Maharashtra"
                />
              </div>
            </div>
          </div>

          {/* Payment method */}
          <div className="card p-6">
            <h3 className="font-semibold text-white mb-4">Payment Method</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {paymentOptions.map(({ value, label, icon: Icon, hint }) => (
                <label
                  key={value}
                  className={`flex items-start gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-colors ${
                    paymentMethod === value
                      ? 'border-brand-500/60 bg-brand-500/10'
                      : 'border-ink-600 bg-ink-800/50 hover:border-ink-500'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={value}
                    checked={paymentMethod === value}
                    onChange={() => setPaymentMethod(value)}
                    className="mt-1 accent-brand-500"
                  />
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-white">
                      <Icon size={15} /> {label}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{hint}</p>
                  </div>
                </label>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-4">
              This is a demo checkout — no real payment gateway is used. Your order will be marked
              placed instantly.
            </p>
          </div>
        </div>

        {/* Order summary */}
        <div className="card p-6 h-fit sticky top-24">
          <h3 className="font-semibold text-white mb-4">Order Summary</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1 mb-4">
            {items.map((item) => (
              <div key={item.product._id} className="flex items-center gap-3 text-sm">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="h-12 w-12 rounded-lg object-cover bg-ink-800 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white line-clamp-1">{item.product.name}</p>
                  <p className="text-slate-500 text-xs">Qty {item.quantity}</p>
                </div>
                <span className="text-slate-300 shrink-0">{formatINR(item.product.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2 text-sm border-t border-ink-700 pt-4">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal</span>
              <span>{formatINR(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Shipping</span>
              <span className="text-accent-400">Free</span>
            </div>
          </div>
          <div className="border-t border-ink-700 mt-4 pt-4 flex justify-between font-semibold text-white">
            <span>Total</span>
            <span>{formatINR(subtotal)}</span>
          </div>
          <button type="submit" disabled={placing} className="btn-primary w-full mt-6">
            {placing ? <Loader2 size={16} className="animate-spin" /> : 'Place order'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
