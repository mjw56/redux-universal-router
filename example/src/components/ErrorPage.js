import React, { Component } from "react";

class ErrorPage extends Component {

  static propTypes = {
    error: React.PropTypes.object
  }

  render() {
    const { error } = this.props;
    return (
      <div>
        <h2>Server error</h2>
        <p>
          { error.message || "(No error message is available)" }
        </p>

        { error.stack &&
          <div>
            <h3>Stack trace</h3>
            <pre>
              <code>
                { error.stack }
              </code>
            </pre>
          </div>
        }
      </div>
    );
  }
}

export default ErrorPage;
