import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ClipboardList } from 'lucide-react';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';
import { formatINR } from '../../utils/format';

const statusOptions = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

const statusStyles = {
  Processing: 'bg-amber-500/15 text-amber-400',
  Shipped: 'bg-brand-500/15 text-brand-300',
  Delivered: 'bg-accent-500/15 text-accent-400',
  Cancelled: 'bg-red-500/15 text-red-400',
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (err) {
      toast.error('Could not load orders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      await api.put(`/orders/${id}/status`, { status });
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status } : o)));
      toast.success('Order status updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="container-app py-10">
      <Link to="/admin" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-6">
        <ArrowLeft size={15} /> Back to dashboard
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-xl bg-brand-500/15 flex items-center justify-center text-brand-400">
          <ClipboardList size={18} />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-slate-400 text-sm">{orders.length} total orders</p>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : orders.length === 0 ? (
        <p className="text-center text-slate-500 py-16">No orders placed yet.</p>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-700 text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="p-4">Order</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-ink-800 last:border-0 hover:bg-ink-800/40">
                  <td className="p-4">
                    <span className="font-mono text-xs text-slate-400">{order._id.slice(-8)}</span>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                  </td>
                  <td className="p-4">
                    <p className="text-white">{order.user?.name || order.shippingAddress?.fullName}</p>
                    <p className="text-xs text-slate-500">{order.user?.email}</p>
                  </td>
                  <td className="p-4 text-slate-400">{order.items.length} item(s)</td>
                  <td className="p-4 text-slate-300 font-medium">{formatINR(order.totalPrice)}</td>
                  <td className="p-4 text-slate-400">{order.paymentMethod}</td>
                  <td className="p-4">
                    <select
                      value={order.status}
                      disabled={updatingId === order._id}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className={`text-xs font-medium px-2 py-1.5 rounded-lg border-none outline-none cursor-pointer ${statusStyles[order.status]}`}
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s} className="bg-ink-900 text-white">
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
