import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package } from 'lucide-react';
import api from '../api/axios';
import Loader from '../components/Loader';
import { formatINR } from '../utils/format';

const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/orders/${id}`)
      .then(({ data }) => setOrder(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader full />;

  return (
    <div className="container-app py-20 max-w-lg mx-auto text-center">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-accent-500/15 text-accent-400">
        <CheckCircle2 size={32} />
      </div>
      <h1 className="text-2xl font-bold mb-2">Order placed successfully!</h1>
      <p className="text-slate-400 mb-8">
        Thanks for shopping with ShopStream. A confirmation has been added to your order history.
      </p>

      {order && (
        <div className="card p-6 text-left mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-400">Order ID</span>
            <span className="text-sm font-mono text-white">{order._id}</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-400">Payment method</span>
            <span className="text-sm text-white">{order.paymentMethod}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Total paid</span>
            <span className="text-sm font-semibold text-white">{formatINR(order.totalPrice)}</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center gap-3">
        <Link to="/profile" className="btn-secondary">
          <Package size={16} /> View orders
        </Link>
        <Link to="/" className="btn-primary">
          Continue shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
