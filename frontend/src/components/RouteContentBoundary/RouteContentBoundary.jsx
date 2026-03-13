import { Component } from "react";
import { useLocation } from "react-router-dom";

class RouteContentBoundaryInner extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Route render failed:", error, errorInfo);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false, error: null });
    }
  }

  render() {
    if (this.state.hasError) {
      const { error } = this.state;
      const isKnownError = error instanceof Error;

      return (
        <section>
          <h1>Something went wrong on this page.</h1>
          <p>{isKnownError ? error.message : "An unknown error was thrown while rendering this route."}</p>
          {isKnownError && error.stack ? <pre>{error.stack}</pre> : null}
          <p>Try going back to the previous page or refreshing the browser.</p>
        </section>
      );
    }

    return this.props.children;
  }
}

export default function RouteContentBoundary({ children }) {
  const location = useLocation();

  return (
    <RouteContentBoundaryInner resetKey={location.pathname}>
      {children}
    </RouteContentBoundaryInner>
  );
}
