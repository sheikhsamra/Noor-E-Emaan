import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <Link 
      to={`/products/${product._id}`} 
      className="group bg-surface rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 block"
    >
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={product.images?.[0] || 'https://via.placeholder.com/300'} 
          alt={product.name} 
          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" 
        />
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold bg-red-500 px-3 py-1 rounded text-sm">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h2 className="font-semibold text-lg text-gray-800 line-clamp-1 group-hover:text-primary transition-colors">
          {product.name}
        </h2>
        <div className="flex justify-between items-center mt-3">
          <p className="text-primary font-bold text-xl">Rs. {product.price}</p>
          <span className="text-sm font-semibold text-accent group-hover:translate-x-1 transition-transform">
            Details →
          </span>
        </div>
      </div>
    </Link>
  );
}
