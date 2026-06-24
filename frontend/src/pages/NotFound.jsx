import { Link, useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7F2EC] via-[#EEDFD4] to-[#FAF8F5] flex flex-col items-center justify-center text-center px-6">
      <div className="relative mb-8">
        <p className="text-[9rem] sm:text-[12rem] font-black text-[#D8B9A5]/70 leading-none select-none">404</p>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl">🌙</span>
        </div>
      </div>

      <span className="text-[10px] font-black tracking-[0.35em] uppercase text-[#8A5A44] block mb-4">
        Page Not Found
      </span>
      <h1 className="text-3xl sm:text-4xl font-black text-[#3F312B] tracking-tight mb-4">
        Lost in the Collection?
      </h1>
      <p className="text-[#6F5E55] font-medium mb-10 max-w-md leading-relaxed">
        The page you're looking for doesn't exist or may have been moved. Let us guide you back.
      </p>

      <div className="flex gap-3 flex-wrap justify-center">
        <button
          onClick={() => navigate(-1)}
          className="bg-white border-2 border-[#E8DDD1] text-[#6F5E55] px-7 py-3.5 rounded-full font-black text-sm uppercase tracking-[0.15em] hover:border-[#8A5A44] hover:text-[#8A5A44] transition-all duration-300 shadow-sm"
        >
          Go Back
        </button>
        <Link
          to="/"
          className="bg-[#3F312B] hover:bg-[#27211E] text-white px-7 py-3.5 rounded-full font-black text-sm uppercase tracking-[0.15em] transition-all duration-300 shadow-[0_10px_30px_rgba(63,49,43,0.2)]"
        >
          Go Home
        </Link>
        <Link
          to="/products"
          className="bg-[#8A5A44] hover:bg-[#6F4736] text-white px-7 py-3.5 rounded-full font-black text-sm uppercase tracking-[0.15em] transition-all duration-300 shadow-[0_10px_30px_rgba(138,90,68,0.25)]"
        >
          Browse Products
        </Link>
      </div>
    </div>
  );
}
