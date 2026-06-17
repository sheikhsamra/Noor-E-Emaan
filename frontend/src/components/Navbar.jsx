import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { cart } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-primary text-white shadow-lg sticky top-0 z-50">
      <div className="container-custom flex justify-between items-center h-16">
        <Link to="/" className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <span className="text-accent">🌙</span> Islamic Store
        </Link>
        
        <div className="hidden md:flex items-center gap-8 font-medium">
          <Link to="/products" className="hover:text-accent transition-colors">Products</Link>
          <Link to="/categories" className="hover:text-accent transition-colors">Categories</Link>
          <Link to="/new-arrivals" className="hover:text-accent transition-colors">New Arrivals</Link>
          <Link to="/cart" className="relative hover:text-accent transition-colors flex items-center gap-1">
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="bg-accent text-primary text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline text-sm opacity-90">Hi, {user.name}</span>
              <button 
                onClick={logout}
                className="bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded-full text-sm transition-all border border-white/20"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="bg-accent hover:bg-accent-dark text-primary px-6 py-2 rounded-full font-bold transition-all shadow-md"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
