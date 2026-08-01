import { Link } from 'react-router-dom';
import { Star, ShoppingCart, ImageOff } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/format';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product._id, 1);
  };

  return (
    <Link
      to={`/product/${product._id}`}
      className="card group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/40 hover:shadow-glow animate-fadeUp"
    >
      <div className="relative aspect-square overflow-hidden bg-ink-800">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-600">
            <ImageOff size={32} />
          </div>
        )}
        {product.featured && (
          <span className="absolute top-3 left-3 badge">Featured</span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink-950/70 backdrop-blur-sm">
            <span className="text-sm font-semibold text-white">Out of stock</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-sm font-semibold text-white line-clamp-1">{product.name}</h3>
        </div>
        {product.brand && <p className="mt-0.5 text-[11px] text-slate-500">{product.brand}</p>}
        <p className="mt-1 text-xs text-slate-400 line-clamp-2 flex-1">{product.description}</p>

        <div className="mt-3 flex items-center gap-1 text-xs text-amber-400">
          <Star size={13} fill="currentColor" />
          <span>{product.rating?.toFixed(1) ?? '4.5'}</span>
          <span className="text-slate-600">· {product.category}</span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="font-display text-lg font-bold text-white">{formatINR(product.price)}</span>
          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            className="btn-primary !px-3 !py-2"
            title="Add to cart"
          >
            <ShoppingCart size={15} />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
