import { Component } from "react";
import Button from "./Button";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen bg-cream flex items-center justify-center px-4">
          <div className="bg-parchment p-8 md:p-12 rounded-[var(--radius-xl)] shadow-strong max-w-md text-center border border-warm-beige">
            <h1 className="text-3xl font-semibold text-deep-brown mb-4">
              Something went wrong
            </h1>

            <p className="text-sage mb-6">
              We encountered an unexpected error. Please refresh the page to
              try again.
            </p>

            <Button
              variant="primary"
              size="md"
              className="rounded-full"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </Button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
