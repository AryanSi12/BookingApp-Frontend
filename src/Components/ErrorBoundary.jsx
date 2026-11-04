import { Component } from "react";
import { ErrorState, PageShell } from "@/Components/ui/PageShell";

export default class ErrorBoundary extends Component {
  state = { error: null, tick: 0 };

  static getDerivedStateFromError(error) {
    return { error };
  }

  retry = () => {
    this.setState((state) => ({ error: null, tick: state.tick + 1 }));
  };

  render() {
    if (this.state.error) {
      return (
        <PageShell>
          <ErrorState
            title="This page hit a snag"
            description="The rest of EventSphere is still available. Try loading this view again."
            onRetry={this.retry}
          />
        </PageShell>
      );
    }

    return <div key={this.state.tick}>{this.props.children}</div>;
  }
}
