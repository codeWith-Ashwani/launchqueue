import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an unhandled error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", background: "var(--bg-page, #ffffff)" }}>
          <div className="lq-card" style={{ maxWidth: "480px", width: "100%", textAlign: "center", padding: "36px" }}>
            <div style={{ fontSize: "2rem", marginBottom: "16px" }}>⚠️</div>
            <h2 style={{ fontSize: "1.25rem", marginBottom: "8px" }}>Something went wrong</h2>
            <p style={{ color: "var(--text-secondary, #525252)", fontSize: "0.875rem", marginBottom: "24px" }}>
              An unexpected application error occurred. You can return to the home page or try refreshing.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button
                onClick={() => window.location.reload()}
                className="lq-btn lq-btn-secondary"
              >
                Refresh Page
              </button>
              <button
                onClick={this.handleReset}
                className="lq-btn lq-btn-primary"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
