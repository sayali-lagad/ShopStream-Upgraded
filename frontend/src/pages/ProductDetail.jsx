import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, ArrowLeft, ImageOff, Minus, Plus, ShieldCheck, Truck } from 'lucide-react';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { formatINR } from '../utils/format';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        toast.error('Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <Loader full />;
  if (!product) {
    return (
      <div className="container-app py-24 text-center text-slate-400">
        Product not found.{' '}
        <Link to="/" className="text-brand-400">
          Go back
        </Link>
      </div>
    );
  }

  const handleAdd = async () => {
    setAdding(true);
    await addToCart(product._id, qty);
    setAdding(false);
  };

  return (
    <div className="container-app py-10">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-6">
        <ArrowLeft size={15} /> Back to shop
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="card aspect-square overflow-hidden">
          {product.image ? (
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-600">
              <ImageOff size={48} />
            </div>
          )}
        </div>

        <div className="animate-fadeUp">
          <span className="badge mb-3">{product.category}</span>
          <h1 className="text-3xl font-bold mb-1">{product.name}</h1>
          {product.brand && <p className="text-sm text-slate-500 mb-2">by {product.brand}</p>}

          <div className="flex items-center gap-2 text-sm text-amber-400 mb-4">
            <Star size={15} fill="currentColor" />
            <span className="font-medium">{product.rating?.toFixed(1) ?? '4.5'}</span>
            <span className="text-slate-500">
              · {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          <p className="text-slate-400 leading-relaxed mb-6">{product.description || 'No description provided.'}</p>

          <div className="text-4xl font-display font-extrabold text-white mb-6">
            {formatINR(product.price)}
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-3 bg-ink-800 border border-ink-600 rounded-xl px-3 py-2">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="text-slate-400 hover:text-white">
                <Minus size={15} />
              </button>
              <span className="w-6 text-center font-medium">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))}
                className="text-slate-400 hover:text-white"
              >
                <Plus size={15} />
              </button>
            </div>

            <button
              onClick={handleAdd}
              disabled={product.stock === 0 || adding}
              className="btn-primary flex-1"
            >
              <ShoppingCart size={16} />
              {product.stock === 0 ? 'Out of stock' : adding ? 'Adding...' : 'Add to cart'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs text-slate-400">
            <div className="card flex items-center gap-2 p-3">
              <Truck size={16} className="text-brand-400" /> Fast shipping
            </div>
            <div className="card flex items-center gap-2 p-3">
              <ShieldCheck size={16} className="text-accent-400" /> Secure checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
