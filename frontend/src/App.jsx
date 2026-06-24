import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// ── Main site pages ──
const Home           = lazy(() => import('./pages/Home'));
const Products       = lazy(() => import('./pages/Products'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const NewArrivals    = lazy(() => import('./pages/NewArrivals'));
const Categories     = lazy(() => import('./pages/Categories'));
const Wishlist       = lazy(() => import('./pages/Wishlist'));
const Cart           = lazy(() => import('./pages/Cart'));
const Checkout       = lazy(() => import('./pages/Checkout'));
const MyOrders       = lazy(() => import('./pages/MyOrders'));
const OrderDetail    = lazy(() => import('./pages/OrderDetail'));
const Login          = lazy(() => import('./pages/Login'));
const Signup         = lazy(() => import('./pages/Signup'));
const NotFound       = lazy(() => import('./pages/NotFound'));

// ── Admin pages ──
const AdminLayout    = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminOrders    = lazy(() => import('./pages/admin/AdminOrders'));
const AdminProducts  = lazy(() => import('./pages/admin/AdminProducts'));

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-[#E8DDD1] border-t-[#8A5A44] rounded-full animate-spin" />
    </div>
  );
}

// Inner component — uses useLocation which needs to be inside <Router>
function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdmin && <Navbar />}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ── Admin section — own layout, no Navbar/Footer ── */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index          element={<AdminDashboard />} />
            <Route path="orders"   element={<AdminOrders />} />
            <Route path="products" element={<AdminProducts />} />
          </Route>

          {/* ── Main site routes ── */}
          <Route path="/"             element={<Home />} />
          <Route path="/products"     element={<Products />} />
          <Route path="/categories"   element={<Categories />} />
          <Route path="/new-arrivals" element={<NewArrivals />} />
          <Route path="/wishlist"     element={<Wishlist />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart"         element={<Cart />} />
          <Route path="/checkout"     element={<Checkout />} />
          <Route path="/my-orders"    element={<MyOrders />} />
          <Route path="/my-orders/:id" element={<OrderDetail />} />
          <Route path="/login"        element={<Login />} />
          <Route path="/signup"       element={<Signup />} />
          <Route path="*"             element={<NotFound />} />
        </Routes>
      </Suspense>
      {!isAdmin && <Footer />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <Router>
            <ErrorBoundary>
              <ScrollToTop />
              <AppContent />
            </ErrorBoundary>
          </Router>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
