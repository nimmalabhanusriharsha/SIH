import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './shared/components/Button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React Error Boundary Caught:", error, errorInfo);
  }

  handleReset = () => {
    localStorage.removeItem('kisanqueue_state');
    localStorage.removeItem('kisanqueue_user');
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-earth-50 flex flex-col items-center justify-center p-4 text-center">
           <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
           <h1 className="text-2xl font-black text-forest-900 mb-2">Something went wrong.</h1>
           <p className="text-earth-600 mb-6 max-w-md">
             The application encountered an unexpected error. This is usually caused by outdated data in your browser's local storage from a previous session.
           </p>
           
           <div className="bg-red-50 text-red-800 p-4 rounded-xl border border-red-200 text-sm font-mono text-left w-full max-w-2xl mb-8 overflow-auto">
              {this.state.error?.toString()}
           </div>
           
           <Button className="bg-forest-900 hover:bg-forest-800 text-white font-bold h-12 px-8" onClick={this.handleReset}>
             <RefreshCw className="w-5 h-5 mr-2" /> Clear Data & Restart Demo
           </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
