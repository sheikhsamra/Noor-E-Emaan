import { Link } from "react-router-dom";

export default function CustomerGalleryBanner() {
  const images = [
    "/customers/c1.jpg",
    "/customers/c2.jpg",
    "/customers/c3.jpg",
    "/customers/c4.jpg",
    "/customers/c5.jpg",
    "/customers/c6.jpg",
    "/customers/c7.jpg",
    "/customers/c8.jpg",
  ];

  const galleryImages = [...images, ...images];

  return (
    <section className="container-custom my-24">
      <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-[#F9F7F3] via-[#F4EEE7] to-[#E7DED4] px-5 py-14 sm:px-10 lg:px-14 shadow-[0_30px_90px_rgba(0,0,0,0.09)] border border-white/80">
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-[#D8B9A5]/40 blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-[#AAB89F]/40 blur-3xl"></div>

        <div className="relative z-10 text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex mb-5 px-5 py-2 rounded-full bg-white/60 border border-white/80 backdrop-blur-md text-[#8A5A44] font-black uppercase tracking-[0.25em] text-xs">
            Customer Gallery
          </span>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#3F312B] leading-tight mb-5">
            Loved by Our Beautiful Customers
          </h2>

          <p className="text-[#6F5E55] text-base sm:text-lg leading-relaxed font-medium">
            Real moments, modest style, and premium Islamic essentials trusted
            by our happy customers.
          </p>
        </div>

        <div className="relative z-10 overflow-hidden">
          <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-20 bg-gradient-to-r from-[#F9F7F3] to-transparent"></div>
          <div className="pointer-events-none absolute right-0 top-0 z-20 h-full w-20 bg-gradient-to-l from-[#E7DED4] to-transparent"></div>

          <div className="flex w-max gap-5 sm:gap-6 animate-customerMarquee hover:[animation-play-state:paused]">
            {galleryImages.map((img, i) => (
              <div
                key={i}
                className="group relative h-72 w-52 sm:h-80 sm:w-60 lg:h-96 lg:w-72 flex-shrink-0 overflow-hidden rounded-[2rem] bg-white p-2 shadow-[0_25px_60px_rgba(0,0,0,0.12)] border border-white/80"
              >
                <img
                  src={img}
                  alt={`Customer ${i + 1}`}
                  className="h-full w-full rounded-[1.5rem] object-cover object-top transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-2 rounded-[1.5rem] bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
          <div className="rounded-full bg-white/65 backdrop-blur-md border border-white/80 px-6 py-3 shadow-lg text-[#8A5A44] font-black">
            ★★★★★ 10,000+ Happy Customers
          </div>

          <Link
            to="/products"
            className="bg-[#8A5A44] hover:bg-[#6F4736] text-white px-8 py-4 rounded-full font-black shadow-xl hover:scale-105 transition-all"
          >
            Explore Collection
          </Link>
        </div>
      </div>
    </section>
  );
}