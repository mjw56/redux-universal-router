redux-universal-router
======================

A universal router designed for [redux](http://rackt.github.io/redux/).

* works server and client-side
* keeps the router state in your redux store
* fetch async data or `require.ensure` via redux actions

Highly inspired by [fluxible-router](https://github.com/yahoo/fluxible-router), it uses [routr](https://github.com/yahoo/routr) and [history](history).

## This is a work-in progess

redux-universal-router is a baby-project, there's still work to be done, especially on the client-side part.
API are not finished. Suggestions and PR are welcome :-)

## Usage

You can run an example from the [example](./example) directory:

```bash
git clone https://github.com/gpbl/redux-universal-router.git
cd redux-universal-router
cd example
npm install
npm start
# now open http://localhost:3000
```

### Steps

1. Define the routes as objects
2. Set up the reducer and the redux store
3. Server-side: create a router instance and render the root component
4. Client-side: create a router instance, listen to history and mount the root component
5. Connect the root component to the router
6. Use `<Link>` or dispatch `ROUTE_NAVIGATE` to navigate between routes

### 1. Define the routes as objects

Routes are the same objects you pass to [routr](https://github.com/yahoo/routr), with two additional parameters:

* `handler` (required) is the react component that should will render the route
* `actionCreator` (optional) is a redux action creator that will be dispatched before the route is rendered
  - it will receive the route's params as the only argument
  - the action returned by the action creator must follow the [FSA standard](https://github.com/acdlite/flux-standard-action)
  - if the `payload` returned by the action is a `Promise`, the route will wait for it before navigating to the new route

```js
const routes = {
  home: {
    path: "/",
    method: "get",    // remember this is required
    handler: HomePage
  },
  photo: {
    path: "/photo/:id",
    method: "get",
    handler: PhotoPage,
    actionCreator: requestPhoto
  }
};
```

### 2. Set up the reducer and the redux store

To work correctly, the router's reducer must save its data in the `router` key
in the root of the store:

```js
// add the router reducer
import { combineReducers, createStore } from "rdux"
import { reducer as router } from "redux-universal-router";
const reducer = combineReducers({ router } );

// create the redux store
import { createStore } from "redux";
const store = createStore(reducer);
```

### 3. Server-side: create a router instance and render the root component

Use `router.navigate(url, callback)` to render the root component.
Remember you must create a new store and a new router for each request. So your middleware could look like:

```js
import React from "react";
import { Provider } from "react-redux";
import serialize from "serialize-javascript";

function (req, res, next) {

  const store = createStore(reducer);
  const router = new Router({ store, routes });

  router.navigate(req.url, (err) => {

    const content = React.renderToString(
      <Provider store={ store } >
        { () => <Application /> }
      </Provider>
    );

    const initialState = `window.__INITIALSTATE__=${serialize(store.getState())};`;

    if (err && err.statusCode) {
      res.status(err.statusCode);
    }

    res.send(`<!doctype html>
    <html>
      <body>
        <div id="content">${content}</div>
        <script>${initialState}</script>
      </body>
    </html>`);

  });
};
```

### 4. Client-side: create a router instance, listen to history and mount the root component

```js
import { createStore } from "redux";
import Router from "redux-universal-route";
import routes from "./routes";

const store = createStore(reducer, window.__INITIALSTATE__);
const router = new Router({ store, routes });

// listen to browser history
router.listen();

router.navigate(document.location.pathname, () => {

  React.render(
    <div>
      <Provider store={ store }>
        { () => <Application /> }
      </Provider>
    </div>,
    document.getElementById("content")
  );

})
```

### 5. Connect the root component to the router

Since the router state is saved in the store, you can just `connect` your
root component and use its data to know which route handler should be rendered.

The router's store has three parameters: `currentRoute`, `nextRoute`
and `err`, all optionals.

In your root component, you want to render the `handler` component of the `currentRoute`.
The component is available as `currentRoute.config.handler`.

* use `currentRoute` to know get the config of the current route. Careful: if the route is not available in your `routes`, this will be null.
* use `nextRoute` to get the config of the route it's being called. It has a value only while navigating to a new route, e.g. when waiting to fetch data from an external API.
* use `err` to know if you have to display an error when loading the route. The route's `actionCreator` can return an error with a `statusCode`, to render an error page or a "not-found" page.


```js
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "redux-universal-router";

@connect(state => ( { router: state.router } ))
class Application extends Component {

  render() {

    const { router } = this.props;
    const { currentRoute, nextRoute, err } = router;

    const Handler = currentRoute && currentRoute.config.handler;

    return (
      <div>

        { err && err.statusCode === 404 && <NotFoundPage /> }
        { err && err.statusCode !== 404 && <ErrorPage error={ err } /> }
        { !err && <Handler {...currentRoute.params} /> }

      </div>
    );
  }
}

```

### 6. Use `<Link>` or dispatch `ROUTE_NAVIGATE` to navigate between routes

`Link` is the included React component to replace your `<a>`:

```js
import { Link } from "redux-universal-router";

class Thing extends Component {

  render() {
    return (
      <p>
        <Link href="/route">click me</Link>
      </p>
    )
  }
}
```

Connecting the component to the store, you can also dispatch `ROUTE_NAVIGATE` to
navigate to another url:


```js
import { connect } from "react-redux";

@connect()
class AnotherThing extends Component {

  render() {
    return (
      <p>
        <a onClick={ this.handleClick }>click me too</a>
      </p>
    )
  }

  handleClick(e) {
    e.preventDefault();
    this.props.dispatch({
      type: "ROUTE_NAVIGATE",
      payload: {
        pushUrl: "/route"
      }
    })
  }

}
```
