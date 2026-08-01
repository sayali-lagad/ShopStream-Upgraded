import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, Sparkles, ArrowRight, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const categoryIcons = {
  Smartphones: '📱',
  Laptops: '💻',
  Headphones: '🎧',
  'Home Appliances': '🏠',
  Fashion: '👕',
  Bags: '🎒',
  Watches: '⌚',
};

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState({ products: [], categories: [], page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);

  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [popular, setPopular] = useState([]);
  const [homeLoading, setHomeLoading] = useState(true);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || 'all';
  const sort = searchParams.get('sort') || '';
  const page = Number(searchParams.get('page') || 1);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/products', {
        params: { search, category, sort, page, limit: 12 },
      });
      setData(data);
    } catch (err) {
      // keep previous state on error
    } finally {
      setLoading(false);
    }
  }, [search, category, sort, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Homepage curated sections — only fetched once, independent of filters
  useEffect(() => {
    const loadSections = async () => {
      setHomeLoading(true);
      try {
        const [featuredRes, newRes, popularRes] = await Promise.all([
          api.get('/products', { params: { featured: 'true', limit: 4 } }),
          api.get('/products', { params: { sort: '', limit: 4 } }),
          api.get('/products', { params: { sort: 'rating', limit: 4 } }),
        ]);
        setFeatured(featuredRes.data.products);
        setNewArrivals(newRes.data.products);
        setPopular(popularRes.data.products);
      } catch (err) {
        // sections are non-critical — fail silently
      } finally {
        setHomeLoading(false);
      }
    };
    loadSections();
  }, []);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete('page');
    setSearchParams(params);
  };

  const goToPage = (p) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', p);
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isBrowsing = Boolean(search) || category !== 'all' || Boolean(sort) || page > 1;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink-700/60">
        <div className="container-app py-16 sm:py-24 text-center">
          <span className="badge mx-auto mb-5 inline-flex">
            <Sparkles size={12} /> New arrivals every week
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight max-w-2xl mx-auto">
            Discover things <span className="bg-gradient-to-r from-brand-400 to-accent-400 bg-clip-text text-transparent">worth owning</span>
          </h1>
          <p className="mt-4 text-slate-400 max-w-lg mx-auto">
            Curated products, honest ₹ pricing, and a checkout experience that just works.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <a href="#all-products" className="btn-primary">
              Shop now <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {!isBrowsing && (
        <>
          {/* Shop by category */}
          <section className="container-app py-12">
            <h2 className="text-xl font-bold mb-6">Shop by Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
              {(data.categories?.length ? data.categories : Object.keys(categoryIcons)).map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    updateParam('category', c);
                    document.getElementById('all-products')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="card flex flex-col items-center gap-2 p-4 hover:border-brand-500/40 hover:-translate-y-0.5 transition-all"
                >
                  <span className="text-2xl">{categoryIcons[c] || '🛍️'}</span>
                  <span className="text-xs font-medium text-slate-300 text-center">{c}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Featured products */}
          {!homeLoading && featured.length > 0 && (
            <section className="container-app py-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Featured Products</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {featured.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            </section>
          )}

          {/* Promotional banner */}
          <section className="container-app py-10">
            <div className="card relative overflow-hidden p-8 sm:p-10 bg-gradient-to-r from-brand-600/20 to-accent-500/10 border-brand-500/20">
              <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <span className="badge mb-3">Limited time</span>
                  <h3 className="text-2xl font-bold text-white mb-1">Free shipping on every order</h3>
                  <p className="text-slate-400 text-sm max-w-md">
                    No minimum order value, no hidden fees — just honest ₹ pricing across the catalog.
                  </p>
                </div>
                <a href="#all-products" className="btn-primary shrink-0">
                  Explore deals <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </section>

          {/* New arrivals */}
          {!homeLoading && newArrivals.length > 0 && (
            <section className="container-app py-6">
              <h2 className="text-xl font-bold mb-6">New Arrivals</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {newArrivals.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            </section>
          )}

          {/* Popular products */}
          {!homeLoading && popular.length > 0 && (
            <section className="container-app py-6">
              <h2 className="text-xl font-bold mb-6">Popular Products</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {popular.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            </section>
          )}

          {/* Trust badges */}
          <section className="container-app py-10">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="card flex items-center gap-3 p-5">
                <Truck size={20} className="text-brand-400 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-white">Free shipping</p>
                  <p className="text-xs text-slate-500">On every order, no minimum</p>
                </div>
              </div>
              <div className="card flex items-center gap-3 p-5">
                <ShieldCheck size={20} className="text-accent-400 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-white">Secure checkout</p>
                  <p className="text-xs text-slate-500">UPI, cards &amp; COD supported</p>
                </div>
              </div>
              <div className="card flex items-center gap-3 p-5">
                <RotateCcw size={20} className="text-brand-400 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-white">Easy tracking</p>
                  <p className="text-xs text-slate-500">Track every order from your account</p>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      <section id="all-products" className="container-app py-10 scroll-mt-20">
        <h2 className="text-xl font-bold mb-6">All Products</h2>
        {/* Filters bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => updateParam('category', 'all')}
              className={`btn-ghost !px-3 !py-1.5 text-xs ${category === 'all' ? '!bg-brand-500/20 !text-brand-300' : ''}`}
            >
              All
            </button>
            {data.categories?.map((c) => (
              <button
                key={c}
                onClick={() => updateParam('category', c)}
                className={`btn-ghost !px-3 !py-1.5 text-xs capitalize ${category === c ? '!bg-brand-500/20 !text-brand-300' : ''}`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="input !w-auto !py-2 text-xs"
            >
              <option value="">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {search && (
          <div className="flex items-center gap-2 mb-6 text-sm text-slate-400">
            Showing results for <span className="text-white font-medium">"{search}"</span>
            <button onClick={() => updateParam('search', '')} className="text-slate-500 hover:text-white">
              <X size={14} />
            </button>
          </div>
        )}

        {loading ? (
          <Loader />
        ) : data.products.length === 0 ? (
          <div className="text-center py-20">
            <Search size={32} className="mx-auto text-slate-600 mb-3" />
            <p className="text-slate-400">No products found. Try a different search or filter.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {data.products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>

            {data.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                {Array.from({ length: data.pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => goToPage(p)}
                    className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
                      p === page ? 'bg-brand-500 text-white' : 'bg-ink-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Home;
