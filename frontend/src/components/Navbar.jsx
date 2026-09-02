import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useContext, useState, useEffect, useRef } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import CartSidebar from './CartSidebar';
import {
  HiUser, HiShoppingBag, HiHeart, HiHome,
  HiOutlineShoppingBag, HiOutlineHeart, HiOutlineHome,
  HiOutlineArrowRightOnRectangle, HiOutlineBars3, HiOutlineXMark,
  HiOutlineClipboardDocumentList, HiOutlineEnvelope, HiOutlineChevronDown,
  HiOutlineSparkles,
} from 'react-icons/hi2';

const NAV_ITEMS = [
  {
    label: 'Abaya',
    href: '/products?category=Abaya',
    sub: [
      { label: 'Open Abaya',              href: '/products?category=Abaya&subCategory=Open Abaya'              },
      { label: 'Butterfly Abaya',         href: '/products?category=Abaya&subCategory=Butterfly Abaya'         },
      { label: 'Embroidered Abaya',       href: '/products?category=Abaya&subCategory=Embroidered Abaya'       },
      { label: 'Ombre Abaya',             href: '/products?category=Abaya&subCategory=Ombre Abaya'             },
      { label: 'Pleated / Crepe Maxi Abaya', href: '/products?category=Abaya&subCategory=Pleated / Crepe Maxi Abaya' },
    ],
  },
  {
    label: 'Hijab',
    href: '/products?category=Hijab',
    sub: [
      { label: 'Chiffon Scarf',  href: '/products?category=Hijab&subCategory=Chiffon Scarf'  },
      { label: 'Jersey Hijab',   href: '/products?category=Hijab&subCategory=Jersey Hijab'   },
      { label: 'Khimar',         href: '/products?category=Hijab&subCategory=Khimar'         },
      { label: 'Pashmina Shawl', href: '/products?category=Hijab&subCategory=Pashmina Shawl' },
      { label: 'Niqab',          href: '/products?category=Hijab&subCategory=Niqab'          },
      { label: 'Cap',            href: '/products?category=Hijab&subCategory=Cap'            },
      { label: 'Hand Gloves',    href: '/products?category=Hijab&subCategory=Hand Gloves'    },
    ],
  },
  {
    label: 'Prayer Set',
    href: '/products?category=Prayer Set',
    sub: [
      { label: 'Jainamaz',          href: '/products?category=Prayer Set&subCategory=Jainamaz'          },
      { label: 'Prayer Cap',        href: '/products?category=Prayer Set&subCategory=Prayer Cap'        },
      { label: 'Tasbih',            href: '/products?category=Prayer Set&subCategory=Tasbih'            },
      { label: 'Velvet Prayer Mat', href: '/products?category=Prayer Set&subCategory=Velvet Prayer Mat' },
      { label: 'Complete Set',      href: '/products?category=Prayer Set&subCategory=Complete Set'      },
      { label: 'Couple Set',        href: '/products?category=Prayer Set&subCategory=Couple Set'        },
    ],
  },
  {
    label: 'Fragrances',
    href: '/products?category=Fragrances',
    sub: [
      { label: 'Attar',    href: '/products?category=Fragrances&subCategory=Attar'    },
      { label: 'Oud',      href: '/products?category=Fragrances&subCategory=Oud'      },
      { label: 'Perfumes', href: '/products?category=Fragrances&subCategory=Perfumes' },
    ],
  },
  {
    label: 'Men',
    href: '/products?category=Men',
    sub: [
      { label: 'Jubba / Thobe', href: '/products?category=Men&subCategory=Jubba / Thobe' },
      { label: 'Kurta',         href: '/products?category=Men&subCategory=Kurta'         },
    ],
  },
];

const MORE_ITEMS = [
  { label: 'Islamic Books', href: '/products?category=Islamic Books' },
  { label: 'Kids',          href: '/products?category=Kids' },
  { label: 'Other',         href: '/products?category=Other' },
];

export default function Navbar() {
  const { cart } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);
  const navigate  = useNavigate();
  const location  = useLocation();

  const [cartOpen,    setCartOpen]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [openNav,     setOpenNav]     = useState(null); // label of open dropdown
  const [mobileExpanded, setMobileExpanded] = useState(null);

  const profileRef  = useRef(null);
  const hoverTimer  = useRef(null);
  const cartCount   = cart.reduce((sum, i) => sum + i.quantity, 0);

  // Close profile on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); setOpenNav(null); }, [location.pathname]);

  const openDropdown  = (label) => { clearTimeout(hoverTimer.current); setOpenNav(label); };
  const closeDropdown = ()      => { hoverTimer.current = setTimeout(() => setOpenNav(null), 120); };
  const handleLogout  = ()      => { setProfileOpen(false); logout(); };

  const isActive = (href) => {
    const [path, qs] = href.split('?');
    const cat = qs ? new URLSearchParams(qs).get('category') : null;
    const currentCat = new URLSearchParams(location.search).get('category');
    if (cat) return location.pathname === path && currentCat === cat;
    return location.pathname === path;
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-2xl border-b border-[#E8DDD1]/60">
        <div className="container-custom flex justify-between items-center h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
            <img src="/logo.png" alt="Fazaljees"
              className="h-36 w-auto object-contain group-hover:scale-105 transition-transform duration-300" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-0">
            {/* All Products */}
            <Link
              to="/products"
              className={`relative px-4 py-7 text-base font-bold transition-colors duration-200 group ${
                location.pathname === '/products' && !new URLSearchParams(location.search).get('category')
                  ? 'text-[#8A5A44]' : 'text-[#3F312B] hover:text-[#8A5A44]'
              }`}
            >
              All Products
              <span className="absolute bottom-0 left-3 right-3 h-[2.5px] bg-[#8A5A44] rounded-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
            </Link>
            {NAV_ITEMS.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => openDropdown(item.label)}
                onMouseLeave={closeDropdown}
              >
                <Link
                  to={item.href}
                  className={`flex items-center gap-1 px-4 py-7 text-base font-bold transition-colors duration-200 group relative ${
                    isActive(item.href) ? 'text-[#8A5A44]' : 'text-[#3F312B] hover:text-[#8A5A44]'
                  }`}
                >
                  {item.label}
                  <HiOutlineChevronDown className={`text-xs transition-transform duration-200 ${openNav === item.label ? 'rotate-180' : ''}`} />
                  {/* underline */}
                  <span className={`absolute bottom-0 left-3 right-3 h-[2.5px] bg-[#8A5A44] rounded-full origin-left transition-transform duration-300 ease-out ${
                    isActive(item.href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`} />
                </Link>

                {/* Dropdown */}
                <div className={`absolute top-full left-0 pt-1 z-50 transition-all duration-200 ${
                  openNav === item.label ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
                }`}>
                  <div className="bg-white border border-[#E8DDD1] rounded-2xl shadow-[0_20px_60px_rgba(63,49,43,0.14)] overflow-hidden min-w-[200px]">
                    {/* Category header */}
                    <Link
                      to={item.href}
                      className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-[#F7F2EC] to-[#EEDFD4] border-b border-[#E8DDD1] group"
                    >
                      <span className="text-xs font-black uppercase tracking-[0.2em] text-[#8A5A44]">
                        All {item.label}
                      </span>
                      <span className="text-[#C9A646] text-xs font-black group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                    {/* Sub items */}
                    <div className="py-2">
                      {item.sub.map((s) => (
                        <Link
                          key={s.label}
                          to={s.href}
                          className="flex items-center gap-2.5 px-5 py-2.5 text-sm text-[#3F312B] font-medium hover:bg-[#FAF8F5] hover:text-[#8A5A44] transition-colors duration-150 group"
                        >
                          <span className="w-1 h-1 rounded-full bg-[#C9A646] flex-shrink-0 opacity-60 group-hover:opacity-100" />
                          {s.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* More dropdown */}
            <div
              className="relative"
              onMouseEnter={() => openDropdown('__more__')}
              onMouseLeave={closeDropdown}
            >
              <button className={`flex items-center gap-1 px-4 py-7 text-base font-bold transition-colors duration-200 relative group ${
                openNav === '__more__' ? 'text-[#8A5A44]' : 'text-[#3F312B] hover:text-[#8A5A44]'
              }`}>
                More
                <HiOutlineChevronDown className={`text-xs transition-transform duration-200 ${openNav === '__more__' ? 'rotate-180' : ''}`} />
                <span className="absolute bottom-0 left-3 right-3 h-[2.5px] bg-[#8A5A44] rounded-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
              </button>

              <div className={`absolute top-full left-0 pt-1 z-50 transition-all duration-200 ${
                openNav === '__more__' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
              }`}>
                <div className="bg-white border border-[#E8DDD1] rounded-2xl shadow-[0_20px_60px_rgba(63,49,43,0.14)] overflow-hidden min-w-[180px] py-2">
                  {MORE_ITEMS.map((m) => (
                    <Link
                      key={m.label}
                      to={m.href}
                      className="flex items-center gap-2.5 px-5 py-2.5 text-sm text-[#3F312B] font-medium hover:bg-[#FAF8F5] hover:text-[#8A5A44] transition-colors duration-150 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-[#C9A646] flex-shrink-0 opacity-60 group-hover:opacity-100" />
                      {m.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* New Arrivals */}
            <Link
              to="/new-arrivals"
              className={`flex items-center gap-1.5 px-4 py-7 text-base font-bold transition-colors duration-200 relative group ${
                location.pathname === '/new-arrivals' ? 'text-[#C9A646]' : 'text-[#3F312B] hover:text-[#C9A646]'
              }`}
            >
              <HiOutlineSparkles className="text-base" />
              New Arrivals
              <span className={`absolute bottom-0 left-3 right-3 h-[2.5px] bg-[#C9A646] rounded-full origin-left transition-transform duration-300 ease-out ${
                location.pathname === '/new-arrivals' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`} />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="lg:hidden h-10 w-10 rounded-xl flex items-center justify-center bg-white border-2 border-[#E8DDD1] text-[#8A5A44] shadow-sm hover:bg-[#8A5A44] hover:text-white hover:border-[#8A5A44] transition-all duration-300"
          >
            {mobileOpen ? <HiOutlineXMark className="text-xl" /> : <HiOutlineBars3 className="text-xl" />}
          </button>

          {/* Right icons */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Wishlist */}
            <Link to="/wishlist" title="Wishlist"
              className={`relative h-11 w-11 rounded-2xl flex items-center justify-center border-2 shadow-md transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 group ${
                user?.wishlist?.length > 0
                  ? 'bg-[#8A5A44] border-[#8A5A44] text-white shadow-[0_4px_18px_rgba(138,90,68,0.35)]'
                  : 'bg-white border-[#E8DDD1] text-[#8A5A44] hover:bg-[#8A5A44] hover:border-[#8A5A44] hover:text-white'
              }`}
            >
              {user?.wishlist?.length > 0 ? <HiHeart className="text-xl" /> : <HiOutlineHeart className="text-xl" />}
              {user?.wishlist?.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-5 w-5 bg-[#C9A646] text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-md border-2 border-white">
                  {user.wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button onClick={() => setCartOpen(true)} title="Cart"
              className={`relative h-11 w-11 rounded-2xl flex items-center justify-center border-2 shadow-md transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 group ${
                cartCount > 0
                  ? 'bg-[#C9A646] border-[#C9A646] text-white shadow-[0_4px_18px_rgba(201,166,70,0.4)]'
                  : 'bg-white border-[#E8DDD1] text-[#8A5A44] hover:bg-[#C9A646] hover:border-[#C9A646] hover:text-white'
              }`}
            >
              {cartCount > 0 ? <HiShoppingBag className="text-xl" /> : <HiOutlineShoppingBag className="text-xl" />}
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-5 w-5 bg-[#8A5A44] text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-md border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Profile */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen((o) => !o)}
                  className={`flex items-center gap-1.5 h-11 px-3 rounded-2xl border-2 shadow-md transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 ${
                    profileOpen
                      ? 'bg-[#8A5A44] border-[#8A5A44] text-white'
                      : 'bg-white border-[#E8DDD1] text-[#8A5A44] hover:bg-[#8A5A44] hover:border-[#8A5A44] hover:text-white'
                  }`}
                >
                  <HiUser className="text-xl flex-shrink-0" />
                  <HiOutlineChevronDown className={`text-sm flex-shrink-0 transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                <div className={`absolute right-0 top-[calc(100%+10px)] w-64 bg-white border border-[#E8DDD1] rounded-[1.5rem] shadow-[0_20px_60px_rgba(63,49,43,0.16)] overflow-hidden transition-all duration-300 origin-top-right z-50 ${
                  profileOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                }`}>
                  <div className="bg-gradient-to-br from-[#F7F2EC] to-[#EEDFD4] px-5 py-4 border-b border-[#E8DDD1]">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-[#8A5A44] flex items-center justify-center flex-shrink-0 shadow-md">
                        <HiUser className="text-white text-lg" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-[#27211E] text-sm truncate">{user.name}</p>
                        <p className="text-[10px] text-[#9B8C83] font-medium truncate flex items-center gap-1">
                          <HiOutlineEnvelope className="text-xs flex-shrink-0" /> {user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <Link to="/my-orders" onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#3F312B] hover:bg-[#F7F2EC] hover:text-[#8A5A44] transition-all duration-200 group">
                      <span className="h-8 w-8 rounded-xl bg-[#F7F2EC] group-hover:bg-[#8A5A44]/10 flex items-center justify-center flex-shrink-0">
                        <HiOutlineClipboardDocumentList className="text-[#8A5A44] text-base" />
                      </span>
                      <div>
                        <p className="text-sm font-black leading-none">My Orders</p>
                        <p className="text-[10px] text-[#9B8C83] font-medium mt-0.5">Track your orders</p>
                      </div>
                    </Link>
                    <Link to="/wishlist" onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#3F312B] hover:bg-[#F7F2EC] hover:text-[#8A5A44] transition-all duration-200 group">
                      <span className="h-8 w-8 rounded-xl bg-[#F7F2EC] group-hover:bg-[#8A5A44]/10 flex items-center justify-center flex-shrink-0">
                        <HiOutlineHeart className="text-[#8A5A44] text-base" />
                      </span>
                      <div>
                        <p className="text-sm font-black leading-none">Wishlist</p>
                        <p className="text-[10px] text-[#9B8C83] font-medium mt-0.5">Your saved items</p>
                      </div>
                    </Link>
                    <div className="h-px bg-[#E8DDD1] mx-2 my-1" />
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 group">
                      <span className="h-8 w-8 rounded-xl bg-red-50 group-hover:bg-red-100 flex items-center justify-center flex-shrink-0">
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
              <Link to="/login"
                className="h-11 w-11 rounded-2xl flex items-center justify-center bg-[#8A5A44] border-2 border-[#8A5A44] text-white shadow-[0_4px_18px_rgba(138,90,68,0.4)] hover:bg-[#6F4736] transition-all duration-300 hover:scale-110 hover:-translate-y-0.5">
                <HiUser className="text-xl" />
              </Link>
            )}
          </div>
        </div>

        {/* Mobile dropdown menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? 'max-h-[80vh] overflow-y-auto' : 'max-h-0'}`}>
          <div className="bg-white/98 backdrop-blur-xl border-t border-[#E8DDD1] px-4 py-3 flex flex-col gap-1">

            {NAV_ITEMS.map((item) => (
              <div key={item.label}>
                <button
                  onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-[#3F312B] hover:bg-[#F7F2EC] font-bold text-sm transition-all"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C9A646]" />
                    {item.label}
                  </span>
                  <HiOutlineChevronDown className={`text-sm text-[#9B8C83] transition-transform duration-200 ${mobileExpanded === item.label ? 'rotate-180' : ''}`} />
                </button>

                <div className={`overflow-hidden transition-all duration-200 ${mobileExpanded === item.label ? 'max-h-60' : 'max-h-0'}`}>
                  <div className="ml-6 mb-2 flex flex-col gap-0.5">
                    <Link to={item.href} onClick={() => setMobileOpen(false)}
                      className="px-4 py-2 text-xs font-black uppercase tracking-widest text-[#8A5A44] hover:text-[#6F4736]">
                      View All {item.label} →
                    </Link>
                    {item.sub.map((s) => (
                      <Link key={s.label} to={s.href} onClick={() => setMobileOpen(false)}
                        className="px-4 py-2 text-sm text-[#6F5E55] font-medium hover:text-[#8A5A44] transition-colors flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-[#C9A646] opacity-60" />
                        {s.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            <div className="h-px bg-[#E8DDD1] my-1" />

            {MORE_ITEMS.map((m) => (
              <Link key={m.label} to={m.href} onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-xl text-[#3F312B] hover:bg-[#F7F2EC] hover:text-[#8A5A44] font-bold text-sm transition-all flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E8DDD1]" />
                {m.label}
              </Link>
            ))}

            <Link to="/new-arrivals" onClick={() => setMobileOpen(false)}
              className="px-4 py-3 rounded-xl text-[#C9A646] hover:bg-[#FDF9F0] font-bold text-sm transition-all flex items-center gap-2">
              <HiOutlineSparkles className="text-base" /> New Arrivals
            </Link>
          </div>
        </div>
      </nav>

      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-2xl border-t border-[#E8DDD1] shadow-[0_-4px_24px_rgba(63,49,43,0.10)]">
        <div className="flex items-stretch h-16">
          <NavTab to="/" label="Home" active={location.pathname === '/'}
            icon={<HiOutlineHome className="text-[22px]" />} activeIcon={<HiHome className="text-[22px]" />} />

          <NavTab to="/products" label="Shop"
            active={location.pathname.startsWith('/products') || location.pathname === '/categories' || location.pathname === '/new-arrivals'}
            icon={<HiOutlineShoppingBag className="text-[22px]" />} activeIcon={<HiShoppingBag className="text-[22px]" />} />

          <button onClick={() => setCartOpen(true)} className="flex-1 flex flex-col items-center justify-center gap-0.5 relative">
            <span className="relative -mt-5 h-14 w-14 rounded-full bg-gradient-to-br from-[#C9A646] to-[#B8942E] shadow-[0_4px_20px_rgba(201,166,70,0.5)] flex items-center justify-center border-4 border-white">
              {cartCount > 0 ? <HiShoppingBag className="text-white text-[22px]" /> : <HiOutlineShoppingBag className="text-white text-[22px]" />}
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-[#8A5A44] text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white shadow">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </span>
            <span className="text-[9px] font-black uppercase tracking-widest text-[#9B8C83] mt-0.5">Cart</span>
          </button>

          <NavTab to="/wishlist" label="Wishlist" active={location.pathname === '/wishlist'}
            badge={user?.wishlist?.length > 0 ? user.wishlist.length : null}
            icon={<HiOutlineHeart className="text-[22px]" />} activeIcon={<HiHeart className="text-[22px]" />} />

          <NavTab to={user ? '/my-orders' : '/login'} label={user ? 'Account' : 'Login'}
            active={location.pathname === '/my-orders' || location.pathname.startsWith('/my-orders/') || location.pathname === '/login'}
            icon={<HiUser className="text-[22px]" />} activeIcon={<HiUser className="text-[22px]" />} />
        </div>
      </nav>
    </>
  );
}

function NavTab({ to, label, active, icon, activeIcon, badge }) {
  return (
    <Link to={to} className={`flex-1 flex flex-col items-center justify-center gap-0.5 relative transition-colors duration-200 ${active ? 'text-[#8A5A44]' : 'text-[#9B8C83]'}`}>
      {active && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[3px] bg-[#8A5A44] rounded-full" />}
      <span className="relative">
        {active ? activeIcon : icon}
        {badge && (
          <span className="absolute -top-1.5 -right-2.5 h-4 w-4 bg-[#C9A646] text-white text-[8px] font-black rounded-full flex items-center justify-center border border-white shadow">
            {badge > 9 ? '9+' : badge}
          </span>
        )}
      </span>
      <span className="text-[9px] font-black uppercase tracking-widest leading-none">{label}</span>
    </Link>
  );
}
