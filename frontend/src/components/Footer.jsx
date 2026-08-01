import { ShoppingBag, Github, Twitter, Instagram } from 'lucide-react';

const Footer = () => (
  <footer className="border-t border-ink-700/70 mt-24 bg-ink-950">
    <div className="container-app py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
      <div className="col-span-2">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500">
            <ShoppingBag size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-white">ShopStream</span>
        </div>
        <p className="text-sm text-slate-400 max-w-xs">
          A live product showcase and cart platform — built to feel fast, modern and effortless.
        </p>
        <div className="flex gap-3 mt-4">
          <a href="#" className="text-slate-500 hover:text-white transition-colors"><Github size={18} /></a>
          <a href="#" className="text-slate-500 hover:text-white transition-colors"><Twitter size={18} /></a>
          <a href="#" className="text-slate-500 hover:text-white transition-colors"><Instagram size={18} /></a>
        </div>
      </div>
      <div>
        <h4 className="text-sm font-semibold text-white mb-3">Shop</h4>
        <ul className="space-y-2 text-sm text-slate-400">
          <li><a href="/" className="hover:text-white transition-colors">All products</a></li>
          <li><a href="/?sort=price_asc" className="hover:text-white transition-colors">Best prices</a></li>
          <li><a href="/cart" className="hover:text-white transition-colors">Your cart</a></li>
        </ul>
      </div>
      <div>
        <h4 className="text-sm font-semibold text-white mb-3">Company</h4>
        <ul className="space-y-2 text-sm text-slate-400">
          <li><span className="hover:text-white transition-colors cursor-default">About</span></li>
          <li><span className="hover:text-white transition-colors cursor-default">Careers</span></li>
          <li><span className="hover:text-white transition-colors cursor-default">Contact</span></li>
        </ul>
      </div>
    </div>
    <div className="border-t border-ink-700/70 py-5">
      <p className="text-center text-xs text-slate-500">
        © {new Date().getFullYear()} ShopStream. Built as a full-stack demo project.
      </p>
    </div>
  </footer>
);

export default Footer;
