import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "redux-universal-router";

import NotFoundPage from "./NotFoundPage";
import ErrorPage from "./ErrorPage";

@connect(state => ( { router: state.router } ))
class Application extends Component {

  render() {

    const { router } = this.props;
    const { currentRoute, nextRoute, err } = router;

    const Handler = currentRoute && currentRoute.config.handler;

    return (
      <div>
        <header>
          <h1>Redux Universal Router</h1>
          <p>
            <Link href="/">Back to home page</Link>

            { !nextRoute && currentRoute &&
              <span> — Current route is: <code>{ currentRoute.name }</code></span>
            }
            { !nextRoute && currentRoute && currentRoute.params && Object.keys(currentRoute.params).length > 0 &&
              <span> with params: <code>{
                Object.keys(currentRoute.params).map(param => <span key={ param }>{ param }={ currentRoute.params[param] } </span>) }
              </code></span>
            }
            { nextRoute &&
              <span> — <i>Now loading the <code>{ nextRoute.name }</code> route...</i> </span>
            }

          </p>
          <hr />
        </header>

        <div className="page">

          { err && err.statusCode === 404 && <NotFoundPage /> }
          { err && err.statusCode !== 404 && <ErrorPage error={ err } /> }
          { !err && <Handler {...currentRoute.params} /> }

        </div>

        <footer>
          <hr />
          <p>
            Navigate to other pages:
            <ul>
              <li><Link href="/developers">a list of some developers</Link> - before rendering, it will dispatch a sync action</li>
              <li><Link href="/developer/gpbl">the page of a developer</Link> - developer data will be fetched asyncronously, e.g from an API call</li>
              <li><Link href="/developer/gaearon">the page of another developer</Link> - click multiple times to see how the last route always wins</li>
              <li><Link href="/developer/not-exists">the page of developer that does not exist</Link> - e.g. when an API call responds with <code>status=404</code></li>
              <li><Link href="/developer">a page that with a server error</Link> - e.g. when an API call responds <code>status=500</code></li>
              <li><Link href="/foobar">a not existing route</Link></li>
            </ul>
          </p>
        </footer>
      </div>
    );
  }
}

export default Application;
