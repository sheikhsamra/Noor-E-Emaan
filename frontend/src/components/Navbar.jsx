import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext, useState, useEffect, useRef } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import CartSidebar from './CartSidebar';
import {
  HiUser,
  HiShoppingBag,
  HiHeart,
  HiHome,
  HiOutlineShoppingBag,
  HiOutlineHeart,
  HiOutlineHome,
  HiOutlineArrowRightOnRectangle,
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineClipboardDocumentList,
  HiOutlineEnvelope,
  HiOutlineChevronDown,
} from 'react-icons/hi2';

export default function Navbar() {
  const { cart } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [cartOpen,    setCartOpen]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);
  const cartCount  = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { path: "/products",     label: "Products"     },
    { path: "/categories",   label: "Categories"   },
    { path: "/new-arrivals", label: "New Arrivals" },
  ];

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-2xl border-b border-[#E8DDD1]/60 shadow-[0_4px_24px_rgba(63,49,43,0.08)]">
        <div className="container-custom flex justify-between items-center h-20">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
            <img
              src="/logo.png"
              alt="Noor-E-Emaan"
              className="h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          {/* ── Desktop nav links ── */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="relative px-4 py-2 text-sm font-bold text-[#3F312B] hover:text-[#8A5A44] transition-colors duration-300 group"
              >
                {item.label}
                <span className="absolute bottom-0 left-4 right-4 h-[2.5px] bg-[#8A5A44] rounded-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
              </Link>
            ))}
          </div>

          {/* ── Mobile hamburger (top-right, visible only on mobile) ── */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden h-10 w-10 rounded-xl flex items-center justify-center bg-white border-2 border-[#E8DDD1] text-[#8A5A44] shadow-sm hover:bg-[#8A5A44] hover:text-white hover:border-[#8A5A44] transition-all duration-300"
          >
            {mobileOpen
              ? <HiOutlineXMark className="text-xl" />
              : <HiOutlineBars3 className="text-xl" />}
          </button>

          {/* ── Right icons (hidden on mobile — bottom nav handles these) ── */}
          <div className="hidden md:flex items-center gap-2">

            {/* Wishlist */}
            <Link
              to="/wishlist"
              title="Wishlist"
              className={`relative h-11 w-11 rounded-2xl flex items-center justify-center border-2 shadow-md transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 hover:shadow-lg group ${
                user?.wishlist?.length > 0
                  ? "bg-[#8A5A44] border-[#8A5A44] text-white shadow-[0_4px_18px_rgba(138,90,68,0.35)]"
                  : "bg-white border-[#E8DDD1] text-[#8A5A44] hover:bg-[#8A5A44] hover:border-[#8A5A44] hover:text-white"
              }`}
            >
              {user?.wishlist?.length > 0
                ? <HiHeart className="text-xl" />
                : <HiOutlineHeart className="text-xl group-hover:scale-110 transition-transform" />
              }
              {user?.wishlist?.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-5 w-5 bg-[#C9A646] text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-md border-2 border-white">
                  {user.wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              title="Cart"
              className={`relative h-11 w-11 rounded-2xl flex items-center justify-center border-2 shadow-md transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 hover:shadow-lg group ${
                cartCount > 0
                  ? "bg-[#C9A646] border-[#C9A646] text-white shadow-[0_4px_18px_rgba(201,166,70,0.4)] animate-icon-bounce"
                  : "bg-white border-[#E8DDD1] text-[#8A5A44] hover:bg-[#C9A646] hover:border-[#C9A646] hover:text-white"
              }`}
            >
              {cartCount > 0
                ? <HiShoppingBag className="text-xl" />
                : <HiOutlineShoppingBag className="text-xl group-hover:scale-110 transition-transform" />
              }
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-5 w-5 bg-[#8A5A44] text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-md border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* ── Profile icon + dropdown ── */}
            {user ? (
              <div className="relative" ref={profileRef}>
                {/* Profile button */}
                <button
                  onClick={() => setProfileOpen((o) => !o)}
                  className={`flex items-center gap-1.5 h-11 px-3 rounded-2xl border-2 shadow-md transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 hover:shadow-lg group ${
                    profileOpen
                      ? "bg-[#8A5A44] border-[#8A5A44] text-white"
                      : "bg-white border-[#E8DDD1] text-[#8A5A44] hover:bg-[#8A5A44] hover:border-[#8A5A44] hover:text-white"
                  }`}
                >
                  <HiUser className="text-xl flex-shrink-0" />
                  <HiOutlineChevronDown className={`text-sm flex-shrink-0 transition-transform duration-300 ${profileOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown panel */}
                <div className={`absolute right-0 top-[calc(100%+10px)] w-64 bg-white border border-[#E8DDD1] rounded-[1.5rem] shadow-[0_20px_60px_rgba(63,49,43,0.16)] overflow-hidden transition-all duration-300 origin-top-right z-50 ${
                  profileOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                }`}>

                  {/* User info header */}
                  <div className="bg-gradient-to-br from-[#F7F2EC] to-[#EEDFD4] px-5 py-4 border-b border-[#E8DDD1]">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-[#8A5A44] flex items-center justify-center flex-shrink-0 shadow-md">
                        <HiUser className="text-white text-lg" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-[#27211E] text-sm truncate">{user.name}</p>
                        <p className="text-[10px] text-[#9B8C83] font-medium truncate flex items-center gap-1">
                          <HiOutlineEnvelope className="text-xs flex-shrink-0" />
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="p-2">
                    <Link
                      to="/my-orders"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#3F312B] hover:bg-[#F7F2EC] hover:text-[#8A5A44] transition-all duration-200 group"
                    >
                      <span className="h-8 w-8 rounded-xl bg-[#F7F2EC] group-hover:bg-[#8A5A44]/10 flex items-center justify-center flex-shrink-0 transition-colors">
                        <HiOutlineClipboardDocumentList className="text-[#8A5A44] text-base" />
                      </span>
                      <div>
                        <p className="text-sm font-black leading-none">My Orders</p>
                        <p className="text-[10px] text-[#9B8C83] font-medium mt-0.5">Track your orders</p>
                      </div>
                    </Link>

                    <Link
                      to="/wishlist"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#3F312B] hover:bg-[#F7F2EC] hover:text-[#8A5A44] transition-all duration-200 group"
                    >
                      <span className="h-8 w-8 rounded-xl bg-[#F7F2EC] group-hover:bg-[#8A5A44]/10 flex items-center justify-center flex-shrink-0 transition-colors">
                        <HiOutlineHeart className="text-[#8A5A44] text-base" />
                      </span>
                      <div>
                        <p className="text-sm font-black leading-none">Wishlist</p>
                        <p className="text-[10px] text-[#9B8C83] font-medium mt-0.5">Your saved items</p>
                      </div>
                    </Link>

                    <div className="h-px bg-[#E8DDD1] mx-2 my-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 group"
                    >
                      <span className="h-8 w-8 rounded-xl bg-red-50 group-hover:bg-red-100 flex items-center justify-center flex-shrink-0 transition-colors">
                        <HiOutlineArrowRightOnRectangle className="text-red-500 text-base" />
                      </span>
                      <div className="text-left">
                        <p className="text-sm font-black leading-none">Logout</p>
                        <p className="text-[10px] text-red-400 font-medium mt-0.5">Sign out of account</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                title="Login"
                className="h-11 w-11 rounded-2xl flex items-center justify-center bg-[#8A5A44] border-2 border-[#8A5A44] text-white shadow-[0_4px_18px_rgba(138,90,68,0.4)] hover:bg-[#6F4736] hover:border-[#6F4736] transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 hover:shadow-xl group"
              >
                <HiUser className="text-xl group-hover:scale-110 transition-transform" />
              </Link>
            )}

          </div>
        </div>


        {/* ── Mobile dropdown menu ── */}
        {mobileOpen && (
          <div className="md:hidden bg-white/98 backdrop-blur-xl border-t border-[#E8DDD1] px-5 py-3 flex flex-col gap-1 shadow-lg">
            {navLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-xl text-[#3F312B] hover:bg-[#F7F2EC] hover:text-[#8A5A44] font-bold text-sm transition-all flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A646] flex-shrink-0" />
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* ── Mobile bottom navigation bar ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-2xl border-t border-[#E8DDD1] shadow-[0_-4px_24px_rgba(63,49,43,0.10)]">
        <div className="flex items-stretch h-16">

          {/* Home */}
          <NavTab
            to="/"
            label="Home"
            active={location.pathname === "/"}
            icon={<HiOutlineHome className="text-[22px]" />}
            activeIcon={<HiHome className="text-[22px]" />}
          />

          {/* Shop */}
          <NavTab
            to="/products"
            label="Shop"
            active={location.pathname.startsWith("/products") || location.pathname === "/categories" || location.pathname === "/new-arrivals"}
            icon={<HiOutlineShoppingBag className="text-[22px]" />}
            activeIcon={<HiShoppingBag className="text-[22px]" />}
          />

          {/* Cart — center button, larger */}
          <button
            onClick={() => setCartOpen(true)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 relative"
          >
            <span className="relative -mt-5 h-14 w-14 rounded-full bg-gradient-to-br from-[#C9A646] to-[#B8942E] shadow-[0_4px_20px_rgba(201,166,70,0.5)] flex items-center justify-center border-4 border-white">
              {cartCount > 0
                ? <HiShoppingBag className="text-white text-[22px]" />
                : <HiOutlineShoppingBag className="text-white text-[22px]" />}
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-[#8A5A44] text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white shadow">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </span>
            <span className="text-[9px] font-black uppercase tracking-widest text-[#9B8C83] mt-0.5">Cart</span>
          </button>

          {/* Wishlist */}
          <NavTab
            to="/wishlist"
            label="Wishlist"
            active={location.pathname === "/wishlist"}
            badge={user?.wishlist?.length > 0 ? user.wishlist.length : null}
            icon={<HiOutlineHeart className="text-[22px]" />}
            activeIcon={<HiHeart className="text-[22px]" />}
          />

          {/* Account */}
          <NavTab
            to={user ? "/my-orders" : "/login"}
            label={user ? "Account" : "Login"}
            active={location.pathname === "/my-orders" || location.pathname.startsWith("/my-orders/") || location.pathname === "/login"}
            icon={<HiUser className="text-[22px]" />}
            activeIcon={<HiUser className="text-[22px]" />}
          />

        </div>
      </nav>
    </>
  );
}

function NavTab({ to, label, active, icon, activeIcon, badge }) {
  return (
    <Link
      to={to}
      className={`flex-1 flex flex-col items-center justify-center gap-0.5 relative transition-colors duration-200 ${
        active ? "text-[#8A5A44]" : "text-[#9B8C83]"
      }`}
    >
      {active && (
        <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[3px] bg-[#8A5A44] rounded-full" />
      )}
      <span className="relative">
        {active ? activeIcon : icon}
        {badge && (
          <span className="absolute -top-1.5 -right-2.5 h-4 w-4 bg-[#C9A646] text-white text-[8px] font-black rounded-full flex items-center justify-center border border-white shadow">
            {badge > 9 ? "9+" : badge}
          </span>
        )}
      </span>
      <span className="text-[9px] font-black uppercase tracking-widest leading-none">{label}</span>
    </Link>
  );
}
