import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/format';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, subtotal, loading } = useCart();
  const items = cart.items || [];
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (!loading && items.length === 0) {
    return (
      <div className="container-app py-24 text-center">
        <ShoppingBag size={40} className="mx-auto text-slate-600 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-slate-400 mb-6">Looks like you haven't added anything yet.</p>
        <Link to="/" className="btn-primary inline-flex">
          Start shopping <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="container-app py-10">
      <h1 className="text-2xl font-bold mb-8">Your Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.product._id} className="card flex items-center gap-4 p-4 animate-fadeUp">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="h-20 w-20 rounded-xl object-cover bg-ink-800"
              />
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.product._id}`} className="font-medium text-white hover:text-brand-400 line-clamp-1">
                  {item.product.name}
                </Link>
                <p className="text-sm text-slate-500 mt-1">{formatINR(item.product.price)} each</p>
              </div>

              <div className="flex items-center gap-2 bg-ink-800 border border-ink-600 rounded-lg px-2 py-1.5">
                <button
                  onClick={() => updateQuantity(item.product._id, Math.max(1, item.quantity - 1))}
                  className="text-slate-400 hover:text-white"
                >
                  <Minus size={14} />
                </button>
                <span className="w-5 text-center text-sm font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                  className="text-slate-400 hover:text-white"
                >
                  <Plus size={14} />
                </button>
              </div>

              <div className="w-24 text-right font-semibold text-white">
                {formatINR(item.product.price * item.quantity)}
              </div>

              <button
                onClick={() => removeFromCart(item.product._id)}
                className="text-slate-500 hover:text-red-400 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="card p-6 h-fit sticky top-24">
          <h3 className="font-semibold text-white mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm">
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
          <button onClick={handleCheckout} className="btn-primary w-full mt-6">
            Proceed to Checkout <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
