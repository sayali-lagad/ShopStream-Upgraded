import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Package, IndianRupee, Layers, Search, ClipboardList, Tags } from 'lucide-react';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';
import { formatINR } from '../../utils/format';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/products', { params: { search, limit: 100 } });
      setProducts(data.products);
    } catch (err) {
      toast.error('Could not load products');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success('Product deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const outOfStock = products.filter((p) => p.stock === 0).length;

  return (
    <div className="container-app py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your product catalog</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/admin/orders" className="btn-secondary">
            <ClipboardList size={16} /> Orders
          </Link>
          <Link to="/admin/categories" className="btn-secondary">
            <Tags size={16} /> Categories
          </Link>
          <Link to="/admin/products/new" className="btn-primary">
            <Plus size={16} /> Add product
          </Link>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="card p-5 flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl bg-brand-500/15 flex items-center justify-center text-brand-400">
            <Package size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-400">Total products</p>
            <p className="text-xl font-bold text-white">{products.length}</p>
          </div>
        </div>
        <div className="card p-5 flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl bg-accent-500/15 flex items-center justify-center text-accent-400">
            <IndianRupee size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-400">Inventory value</p>
            <p className="text-xl font-bold text-white">{formatINR(totalValue)}</p>
          </div>
        </div>
        <div className="card p-5 flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl bg-red-500/15 flex items-center justify-center text-red-400">
            <Layers size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-400">Out of stock</p>
            <p className="text-xl font-bold text-white">{outOfStock}</p>
          </div>
        </div>
      </div>

      <div className="relative max-w-sm mb-5">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="input pl-10"
        />
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-700 text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b border-ink-800 last:border-0 hover:bg-ink-800/40">
                  <td className="p-4 flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="h-10 w-10 rounded-lg object-cover bg-ink-800" />
                    <div className="min-w-0">
                      <span className="font-medium text-white line-clamp-1 block">{p.name}</span>
                      {p.brand && <span className="text-xs text-slate-500">{p.brand}</span>}
                    </div>
                  </td>
                  <td className="p-4 text-slate-400">{p.category}</td>
                  <td className="p-4 text-slate-300">{formatINR(p.price)}</td>
                  <td className="p-4">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        p.stock === 0
                          ? 'bg-red-500/15 text-red-400'
                          : p.stock < 10
                          ? 'bg-amber-500/15 text-amber-400'
                          : 'bg-accent-500/15 text-accent-400'
                      }`}
                    >
                      {p.stock} units
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/admin/products/${p._id}/edit`} className="btn-ghost !px-2.5 !py-1.5">
                        <Pencil size={15} />
                      </Link>
                      <button
                        onClick={() => handleDelete(p._id)}
                        disabled={deletingId === p._id}
                        className="btn-danger !px-2.5 !py-1.5"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <p className="text-center text-slate-500 py-10">No products yet — add your first one.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
