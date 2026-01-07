import React, { type PropsWithChildren } from "react";

interface State {
  hasError: boolean;
}

type ErrorBoundaryProps = PropsWithChildren<unknown>;

export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  State
> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error("ErrorBoundary caught an error", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong loading the UI.</h2>;
    }

    return this.props.children;
  }
}
