import {Component} from 'react';

import * as styled from './ErrorBoundary.styled';

class ErrorBoundary extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {hasError: false};
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({hasError: true});

    // eslint-disable-next-line
    console.log(error, info);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <styled.error>
          <h3>Something went wrong.</h3>
        </styled.error>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
