import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "redux-universal-router";

@connect( state => ( { developers: state.developers} ))
class UserListPage extends Component {

  static propTypes = {
    developers: React.PropTypes.object
  }

  render() {
    const { developers } = this.props;
    return (
      <div>
        <h2>React Developers</h2>
        <ul>
        {
          Object.keys(developers).map(
            name => (
              <li>
                <Link key={ name } href={ `/developer/${name}` }>
                  { name }
                </Link>
              </li>
            )
          )
        }
        </ul>
      </div>
    );
  }
}

export default UserListPage;
