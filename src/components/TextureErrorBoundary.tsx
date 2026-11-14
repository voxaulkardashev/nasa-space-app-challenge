import { Component, type ReactNode } from 'react';

interface TextureErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

interface TextureErrorBoundaryState {
  failed: boolean;
}

/**
 * Catches a failed texture download so one missing file shows a clear
 * "Texture missing" body instead of crashing the whole app.
 * (React only supports this pattern with a class component.)
 */
export class TextureErrorBoundary extends Component<TextureErrorBoundaryProps, TextureErrorBoundaryState> {
  state: TextureErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): TextureErrorBoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error('Texture failed to load:', error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
