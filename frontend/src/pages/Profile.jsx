import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Package, Lock, LogOut, ChevronRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { formatINR } from '../utils/format';

const statusStyles = {
  Processing: 'bg-amber-500/15 text-amber-400',
  Shipped: 'bg-brand-500/15 text-brand-300',
  Delivered: 'bg-accent-500/15 text-accent-400',
  Cancelled: 'bg-red-500/15 text-red-400',
};

const tabs = [
  { id: 'orders', label: 'Order History', icon: Package },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'password', label: 'Change Password', icon: Lock },
];

const OrdersTab = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/orders/myorders')
      .then(({ data }) => setOrders(data))
      .catch(() => toast.error('Could not load your orders'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <Package size={32} className="mx-auto text-slate-600 mb-3" />
        <p className="text-slate-400 mb-4">You haven't placed any orders yet.</p>
        <Link to="/" className="btn-primary inline-flex">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order._id} className="card p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <p className="text-xs text-slate-500">Order ID</p>
              <p className="text-sm font-mono text-white">{order._id}</p>
            </div>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[order.status] || 'bg-ink-700 text-slate-300'}`}>
              {order.status}
            </span>
          </div>
          <div className="flex flex-wrap gap-3 mb-3">
            {order.items.slice(0, 4).map((item, i) => (
              <img
                key={i}
                src={item.image}
                alt={item.name}
                className="h-12 w-12 rounded-lg object-cover bg-ink-800"
                title={item.name}
              />
            ))}
            {order.items.length > 4 && (
              <div className="h-12 w-12 rounded-lg bg-ink-800 flex items-center justify-center text-xs text-slate-400">
                +{order.items.length - 4}
              </div>
            )}
          </div>
          <div className="flex items-center justify-between text-sm border-t border-ink-700 pt-3">
            <span className="text-slate-400">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {order.paymentMethod}</span>
            <span className="font-semibold text-white">{formatINR(order.totalPrice)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

const ProfileTab = ({ user }) => (
  <div className="card p-6 max-w-md">
    <div className="flex items-center gap-4 mb-6">
      <div className="h-14 w-14 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white text-xl font-bold">
        {user.name?.[0]?.toUpperCase()}
      </div>
      <div>
        <p className="font-semibold text-white">{user.name}</p>
        <p className="text-sm text-slate-400">{user.email}</p>
      </div>
    </div>
    <div className="space-y-3 text-sm">
      <div className="flex justify-between border-b border-ink-700 pb-3">
        <span className="text-slate-400">Full name</span>
        <span className="text-white">{user.name}</span>
      </div>
      <div className="flex justify-between border-b border-ink-700 pb-3">
        <span className="text-slate-400">Email</span>
        <span className="text-white">{user.email}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-400">Account type</span>
        <span className="text-white capitalize">{user.role}</span>
      </div>
    </div>
  </div>
);

const PasswordTab = () => {
  const { changePassword } = useAuth();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setSubmitting(true);
    try {
      await changePassword(form.currentPassword, form.newPassword);
      toast.success('Password updated successfully');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-6 max-w-md space-y-4">
      <div>
        <label className="label">Current password</label>
        <input
          required
          type="password"
          className="input"
          value={form.currentPassword}
          onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
        />
      </div>
      <div>
        <label className="label">New password</label>
        <input
          required
          type="password"
          minLength={6}
          className="input"
          value={form.newPassword}
          onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
        />
      </div>
      <div>
        <label className="label">Confirm new password</label>
        <input
          required
          type="password"
          minLength={6}
          className="input"
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
        />
      </div>
      <button type="submit" disabled={submitting} className="btn-primary w-full">
        {submitting ? <Loader2 size={16} className="animate-spin" /> : 'Update password'}
      </button>
    </form>
  );
};

const Profile = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');

  if (!user) return null;

  return (
    <div className="container-app py-10">
      <h1 className="text-2xl font-bold mb-8">My Account</h1>

      <div className="grid md:grid-cols-[220px_1fr] gap-8">
        <aside className="space-y-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center justify-between gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === id ? 'bg-brand-500/15 text-brand-300' : 'text-slate-400 hover:bg-ink-800/70 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <Icon size={16} /> {label}
              </span>
              <ChevronRight size={14} className={activeTab === id ? 'opacity-100' : 'opacity-0'} />
            </button>
          ))}
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors mt-2"
          >
            <LogOut size={16} /> Logout
          </button>
        </aside>

        <div>
          {activeTab === 'orders' && <OrdersTab />}
          {activeTab === 'profile' && <ProfileTab user={user} />}
          {activeTab === 'password' && <PasswordTab />}
        </div>
      </div>
    </div>
  );
};

export default Profile;
