import { Link } from 'react-router-dom';
import {
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineMapPin,
  HiOutlineHeart,
} from 'react-icons/hi2';

export default function Footer() {
  return (
    <footer className="bg-[#F2EDE6] border-t-2 border-[#E8DDD1]">

      <div className="container-custom pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-5 group">
              <div className="h-12 w-12 rounded-full bg-[#8A5A44]/15 border border-[#D8B9A5] flex items-center justify-center text-2xl shadow-sm">
                🌙
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-[#27211E] block">Noor-E-Emaan</span>
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#8A5A44]">Islamic Store</span>
              </div>
            </Link>
            <p className="text-[#6F5E55] text-sm leading-relaxed font-medium max-w-xs">
              Your trusted destination for premium Islamic essentials. Every product is hand-picked for quality, authenticity and barakat.
            </p>
            <div className="flex gap-3 mt-7">
              {['FB', 'IG', 'WA'].map((s) => (
                <button key={s}
                  className="h-10 w-10 rounded-full bg-white border border-[#E8DDD1] text-[#8A5A44] hover:bg-[#8A5A44] hover:text-white hover:border-[#8A5A44] transition-all duration-300 text-xs font-black shadow-sm">
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-[#8A5A44] mb-5">Explore</h4>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/products', label: 'All Products' },
                { to: '/categories', label: 'Categories' },
                { to: '/new-arrivals', label: 'New Arrivals' },
                { to: '/wishlist', label: 'My Wishlist' },
                { to: '/cart', label: 'My Cart' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to}
                    className="text-[#6F5E55] hover:text-[#8A5A44] text-sm font-medium transition-colors duration-200 flex items-center gap-2 group">
                    <span className="w-3 h-px bg-[#D8B9A5] group-hover:w-5 group-hover:bg-[#8A5A44] transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-[#8A5A44] mb-5">Collections</h4>
            <ul className="space-y-3">
              {['Abaya', 'Jubba', 'Topi', 'Tasbih', 'Jainamaz', 'Fragrances', 'Books'].map((cat) => (
                <li key={cat}>
                  <Link to={`/categories?category=${cat}`}
                    className="text-[#6F5E55] hover:text-[#8A5A44] text-sm font-medium transition-colors duration-200 flex items-center gap-2 group">
                    <span className="w-3 h-px bg-[#D8B9A5] group-hover:w-5 group-hover:bg-[#8A5A44] transition-all duration-300" />
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-[#8A5A44] mb-5">Contact</h4>
            <ul className="space-y-4 mb-7">
              {[
                { icon: <HiOutlineEnvelope />, label: 'Email', value: 'info@nooreemaan.pk' },
                { icon: <HiOutlinePhone />, label: 'WhatsApp', value: '+92 300 0000000' },
                { icon: <HiOutlineMapPin />, label: 'Location', value: 'Lahore, Pakistan' },
              ].map((item) => (
                <li key={item.label} className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-white border border-[#E8DDD1] flex items-center justify-center flex-shrink-0 mt-0.5 text-[#8A5A44] shadow-sm">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9B8C83] mb-0.5">{item.label}</p>
                    <p className="text-[#3F312B] text-sm font-semibold">{item.value}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Newsletter */}
            <div className="bg-white border border-[#E8DDD1] rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8A5A44] mb-3">Newsletter</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 bg-[#FAF8F5] border border-[#E8DDD1] rounded-full px-4 py-2 text-xs text-[#3F312B] placeholder:text-[#B8AAA0] outline-none focus:border-[#8A5A44] transition-colors"
                />
                <button className="h-9 w-9 rounded-full bg-[#8A5A44] hover:bg-[#6F4736] flex items-center justify-center transition-colors flex-shrink-0 shadow-sm">
                  <span className="text-white text-sm font-black">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#E8DDD1] mb-7" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[#9B8C83] text-xs font-medium">
          <p>&copy; {new Date().getFullYear()} Noor-E-Emaan. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Made with <HiOutlineHeart className="text-[#8A5A44] text-sm" /> in Pakistan
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#8A5A44] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#8A5A44] transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
