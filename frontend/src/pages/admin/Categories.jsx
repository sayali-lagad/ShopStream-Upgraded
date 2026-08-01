import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Tags, Plus, Trash2, Loader2 } from 'lucide-react';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
    } catch (err) {
      toast.error('Could not load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setAdding(true);
    try {
      await api.post('/categories', { name: newName.trim() });
      setNewName('');
      toast.success('Category added');
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not add category');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c._id !== id));
      toast.success('Category removed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="container-app py-10 max-w-2xl">
      <Link to="/admin" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-6">
        <ArrowLeft size={15} /> Back to dashboard
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-xl bg-brand-500/15 flex items-center justify-center text-brand-400">
          <Tags size={18} />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-slate-400 text-sm">Organize your product catalog</p>
        </div>
      </div>

      <form onSubmit={handleAdd} className="flex gap-3 mb-6">
        <input
          className="input"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="e.g. Sportswear"
        />
        <button type="submit" disabled={adding} className="btn-primary shrink-0">
          {adding ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Add
        </button>
      </form>

      {loading ? (
        <Loader />
      ) : (
        <div className="card divide-y divide-ink-800">
          {categories.length === 0 && <p className="text-center text-slate-500 py-10">No categories yet.</p>}
          {categories.map((c) => (
            <div key={c._id} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-white font-medium">{c.name}</p>
                <p className="text-xs text-slate-500">{c.productCount} product(s)</p>
              </div>
              <button
                onClick={() => handleDelete(c._id)}
                disabled={deletingId === c._id}
                className="btn-danger !px-2.5 !py-1.5"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
