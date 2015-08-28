import React from "react";
import { connect } from "react-redux";

import { pushHistory } from "./actions";

@connect()
class Link extends React.Component {

  handleClick(e) {
    const { href } = this.props;
    e.preventDefault();

    // push the url to the browser's history
    this.props.dispatch(pushHistory(href));

  }

  render() {
    const { href } = this.props;
    return (
      <a href={ href } onClick={ ::this.handleClick }>
        { this.props.children }
      </a>
    );
  }

}

export default Link;
