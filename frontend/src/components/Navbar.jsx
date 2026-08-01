import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(search.trim() ? `/?search=${encodeURIComponent(search.trim())}` : '/');
    setMenuOpen(false);
  };

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-white' : 'text-slate-400 hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-ink-700/70 bg-ink-950/80 backdrop-blur-lg">
      <div className="container-app flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 shadow-glow">
            <ShoppingBag size={18} className="text-white" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-white">
            Shop<span className="text-brand-400">Stream</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          <NavLink to="/" className={linkClass} end>
            Shop
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={linkClass}>
              Dashboard
            </NavLink>
          )}
        </nav>

        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="input pl-9 py-2"
          />
        </form>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/cart" className="relative btn-ghost !px-2.5">
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-accent-500 px-1 text-[10px] font-bold text-ink-950">
                {itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/profile" className="hidden lg:flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition-colors">
                <User size={14} /> {user.name.split(' ')[0]}
              </Link>
              <button onClick={logout} className="btn-ghost !px-2.5" title="Sign out">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-ghost">
                Sign in
              </Link>
              <Link to="/register" className="btn-primary">
                Get started
              </Link>
            </div>
          )}
        </div>

        <button className="md:hidden btn-ghost !px-2" onClick={() => setMenuOpen((v) => !v)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-ink-700 bg-ink-950 px-4 py-4 space-y-4 animate-fadeUp">
          <form onSubmit={handleSearch} className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="input pl-9"
            />
          </form>
          <div className="flex flex-col gap-3">
            <Link to="/" onClick={() => setMenuOpen(false)} className={linkClass({ isActive: false })}>
              Shop
            </Link>
            <Link to="/cart" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-sm text-slate-300">
              <ShoppingBag size={16} /> Cart {itemCount > 0 && `(${itemCount})`}
            </Link>
            {isAdmin && (
              <Link to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-sm text-slate-300">
                <LayoutDashboard size={16} /> Dashboard
              </Link>
            )}
            {user && (
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-sm text-slate-300">
                <User size={16} /> My account
              </Link>
            )}
          </div>
          <div className="flex gap-2 pt-2 border-t border-ink-700">
            {user ? (
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="btn-secondary w-full"
              >
                Sign out
              </button>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-secondary w-full">
                  Sign in
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary w-full">
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
