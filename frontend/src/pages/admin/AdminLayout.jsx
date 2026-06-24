import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import {
  HiOutlineSquares2X2,
  HiOutlineClipboardDocumentList,
  HiOutlineShoppingBag,
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineArrowRightOnRectangle,
  HiUser,
} from 'react-icons/hi2';

const NAV = [
  { to: '/admin',          label: 'Dashboard', icon: HiOutlineSquares2X2,            end: true },
  { to: '/admin/orders',   label: 'Orders',    icon: HiOutlineClipboardDocumentList,  end: false },
  { to: '/admin/products', label: 'Products',  icon: HiOutlineShoppingBag,            end: false },
];

export default function AdminLayout() {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!token) navigate('/login');
    else if (user && user.role !== 'admin') navigate('/');
  }, [user, token, navigate]);

  // Token exists but user not yet hydrated — show spinner
  if (token && !user) return (
    <div className="min-h-screen flex items-center justify-center bg-[#3F312B]">
      <div className="w-10 h-10 border-[3px] border-white/20 border-t-[#C9A646] rounded-full animate-spin" />
    </div>
  );

  if (!token || !user || user.role !== 'admin') return null;

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex">

      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-[#3F312B] z-50 flex flex-col shadow-2xl transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>

        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10 flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-[#C9A646] flex items-center justify-center text-lg shadow-lg flex-shrink-0">
            🌙
          </div>
          <div>
            <p className="font-black text-white text-sm leading-tight">Noor-E-Emaan</p>
            <p className="text-[10px] text-[#C9A646] font-bold uppercase tracking-[0.2em]">Admin Panel</p>
          </div>
          <button
            className="ml-auto lg:hidden h-8 w-8 rounded-xl bg-white/10 flex items-center justify-center text-white"
            onClick={() => setOpen(false)}
          >
            <HiOutlineXMark className="text-lg" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#C9A646] text-[#27211E] shadow-[0_4px_14px_rgba(201,166,70,0.4)]'
                    : 'text-[#C5B0A0] hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon className="text-lg flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User + logout */}
        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="h-8 w-8 rounded-xl bg-[#C9A646]/20 border border-[#C9A646]/30 flex items-center justify-center flex-shrink-0">
              <HiUser className="text-[#C9A646] text-sm" />
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-black truncate">{user.name}</p>
              <p className="text-[#9B8C83] text-[10px] truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-300 hover:bg-red-500/15 hover:text-red-200 transition-all text-sm font-bold"
          >
            <HiOutlineArrowRightOnRectangle className="text-base" />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col lg:ml-64 min-h-screen">

        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center gap-4 px-5 h-16 bg-white border-b border-[#E8DDD1] shadow-sm">
          <button
            onClick={() => setOpen(true)}
            className="h-10 w-10 rounded-xl bg-[#FAF8F5] border border-[#E8DDD1] flex items-center justify-center"
          >
            <HiOutlineBars3 className="text-xl text-[#3F312B]" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-lg">🌙</span>
            <span className="font-black text-[#27211E] text-sm">Admin</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
