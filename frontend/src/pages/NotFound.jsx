import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => (
  <div className="container-app flex flex-col items-center justify-center min-h-[60vh] text-center">
    <h1 className="text-6xl font-display font-extrabold text-white mb-2">404</h1>
    <p className="text-slate-400 mb-6">This page doesn't exist or has moved.</p>
    <Link to="/" className="btn-primary">
      <Home size={16} /> Back to shop
    </Link>
  </div>
);

export default NotFound;
