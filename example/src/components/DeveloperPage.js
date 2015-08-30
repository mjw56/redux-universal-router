import React, { Component } from "react";
import { connect } from "react-redux";

@connect( state => ( { developers: state.developers} ))
class DeveloperPage extends Component {

  static propTypes = {
    name: React.PropTypes.string,
    developers: React.PropTypes.object
  }

  render() {
    const { name, developers } = this.props;
    const developer = developers[name];
    return (
      <div>
        <h2>User page of { name }</h2>

        <p>
          Twitter: <a href={ `https://twitter.com/${developer.twitter}` }>
            @{ developer.twitter }
          </a>
        </p>
        <p>
          Github: <a href={ `https://github.com/${developer.github}` }>
            https://github.com/{ developer.github }
          </a>
        </p>

      </div>
    );
  }
}

export default DeveloperPage;
