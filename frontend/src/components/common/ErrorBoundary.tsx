import { Component, type ErrorInfo, type ReactNode } from 'react';
import Button from './Button';
import Icon from './Icon';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/lobby';
  };

  private handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6">
          <div className="max-w-md w-full rounded-2xl bg-surface-container-lowest p-8 shadow-2xl text-center border-2 border-dashed border-outline-variant">
            <div className="w-16 h-16 rounded-full bg-error-container text-on-error-container flex items-center justify-center mx-auto mb-4">
              <Icon name="sentiment_dissatisfied" size={32} />
            </div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-2">
              Chit dropped off the table!
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">
              Something unexpected happened while rendering the game table. Let's get you right back into the action.
            </p>
            {this.state.error && (
              <pre className="text-left text-xs bg-surface-container-high/60 p-3 rounded-lg overflow-x-auto text-on-surface-variant mb-6 max-h-32">
                {this.state.error.message}
              </pre>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={this.handleReload} variant="secondary">
                <Icon name="refresh" size={18} /> Refresh Page
              </Button>
              <Button onClick={this.handleReset}>
                <Icon name="chair" size={18} /> Game Lobby
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
