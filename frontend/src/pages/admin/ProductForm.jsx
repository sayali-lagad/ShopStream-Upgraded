import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, UploadCloud, Loader2, ImageOff } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';

const emptyForm = {
  name: '',
  brand: '',
  description: '',
  price: '',
  category: '',
  stock: '',
  rating: '',
  featured: false,
};

const ProductForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .get('/categories')
      .then(({ data }) => setCategories(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setForm({
          name: data.name,
          brand: data.brand || '',
          description: data.description || '',
          price: data.price,
          category: data.category || '',
          stock: data.stock,
          rating: data.rating ?? '',
          featured: data.featured,
        });
        setPreview(data.image);
      } catch (err) {
        toast.error('Product not found');
        navigate('/admin');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, isEdit, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const fd = new FormData();
    Object.entries(form).forEach(([key, value]) => fd.append(key, value));
    if (imageFile) fd.append('image', imageFile);

    try {
      if (isEdit) {
        await api.put(`/products/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product updated');
      } else {
        await api.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product created');
      }
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader full />;

  return (
    <div className="container-app py-10 max-w-2xl">
      <Link to="/admin" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-6">
        <ArrowLeft size={15} /> Back to dashboard
      </Link>

      <div className="card p-8">
        <h1 className="text-xl font-bold mb-6">{isEdit ? 'Edit product' : 'Add a new product'}</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label">Product image</label>
            <label className="flex items-center gap-4 cursor-pointer">
              <div className="h-20 w-20 rounded-xl bg-ink-800 border border-dashed border-ink-600 flex items-center justify-center overflow-hidden shrink-0">
                {preview ? (
                  <img src={preview} alt="preview" className="h-full w-full object-cover" />
                ) : (
                  <ImageOff size={22} className="text-slate-600" />
                )}
              </div>
              <div className="btn-secondary">
                <UploadCloud size={15} /> Upload image
              </div>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>

          <div>
            <label className="label">Product name</label>
            <input
              required
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Aria Wireless Headphones"
            />
          </div>

          <div>
            <label className="label">Brand</label>
            <input
              className="input"
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
              placeholder="e.g. Samsung, boAt, Titan"
            />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              rows={3}
              className="input resize-none"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Short, compelling product description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Price (₹)</label>
              <input
                required
                type="number"
                min="0"
                step="1"
                className="input"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="0"
              />
            </div>
            <div>
              <label className="label">Stock quantity</label>
              <input
                required
                type="number"
                min="0"
                className="input"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Category</label>
              <input
                list="category-options"
                className="input"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="e.g. Smartphones"
              />
              <datalist id="category-options">
                {categories.map((c) => (
                  <option key={c._id} value={c.name} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="label">Rating (0-5)</label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                className="input"
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: e.target.value })}
                placeholder="4.5"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="h-4 w-4 rounded accent-brand-500"
            />
            Mark as featured product
          </label>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={submitting} className="btn-primary flex-1">
              {submitting ? <Loader2 size={16} className="animate-spin" /> : isEdit ? 'Save changes' : 'Create product'}
            </button>
            <Link to="/admin" className="btn-secondary flex-1 text-center">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
