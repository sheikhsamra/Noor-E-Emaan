export default function Footer() {
  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-accent">🌙</span> Islamic Store
            </h3>
            <p className="text-white/70 max-w-sm">
              Your trusted destination for premium Islamic essentials. We prioritize quality and authenticity in every product we offer.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4 text-accent">Quick Links</h4>
            <ul className="space-y-2 text-white/70">
              <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="/products" className="hover:text-white transition-colors">Products</a></li>
              <li><a href="/cart" className="hover:text-white transition-colors">Cart</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4 text-accent">Contact</h4>
            <ul className="space-y-2 text-white/70 text-sm">
              <li>Email: info@islamicstore.com</li>
              <li>Phone: +91 1234567890</li>
              <li>Address: New Delhi, India</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 text-center text-sm text-white/50">
          &copy; {new Date().getFullYear()} Islamic Store. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
