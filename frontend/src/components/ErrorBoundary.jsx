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
        <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-background">
          <div className="text-6xl mb-6">⚠️</div>
          <h1 className="text-3xl font-bold text-primary mb-3">Something went wrong</h1>
          <p className="text-gray-600 mb-8 max-w-md">
            An unexpected error occurred. Your cart and session are safe.
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <button
              onClick={() => this.setState({ hasError: false })}
              className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors"
            >
              Try Again
            </button>
            <Link
              to="/"
              onClick={() => this.setState({ hasError: false })}
              className="border border-primary text-primary px-6 py-3 rounded-xl font-semibold hover:bg-primary/5 transition-colors"
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
