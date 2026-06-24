import React from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-[#FAF8F5]">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#F7F2EC] to-[#EEDFD4] border border-[#E8DDD1] flex items-center justify-center mx-auto mb-6 shadow-md">
            <span className="text-3xl">⚠️</span>
          </div>
          <span className="text-[10px] font-black tracking-[0.35em] uppercase text-[#8A5A44] block mb-3">
            Unexpected Error
          </span>
          <h1 className="text-3xl font-black text-[#27211E] tracking-tight mb-3">Something went wrong</h1>
          <p className="text-[#9B8C83] font-medium mb-8 max-w-md leading-relaxed">
            An unexpected error occurred. Your cart and session are safe.
          </p>
          <div className="flex gap-3 flex-wrap justify-center">
            <button
              onClick={() => this.setState({ hasError: false })}
              className="bg-[#8A5A44] hover:bg-[#6F4736] text-white font-black px-7 py-3.5 rounded-2xl transition-all duration-300 shadow-[0_8px_25px_rgba(138,90,68,0.3)] hover:-translate-y-0.5 text-sm uppercase tracking-[0.15em]"
            >
              Try Again
            </button>
            <Link
              to="/"
              onClick={() => this.setState({ hasError: false })}
              className="bg-white border-2 border-[#E8DDD1] hover:border-[#8A5A44] text-[#3F312B] hover:text-[#8A5A44] font-black px-7 py-3.5 rounded-2xl transition-all duration-300 text-sm uppercase tracking-[0.15em]"
            >
              Go Home
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
