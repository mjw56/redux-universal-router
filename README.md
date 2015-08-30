redux-universal-router
======================

A universal router designed for [redux](http://rackt.github.io/redux/), highly inspired by [fluxible-router](https://github.com/yahoo/fluxible-router).

[![npm version](https://badge.fury.io/js/redux-universal-router.svg)](http://badge.fury.io/js/redux-universal-router) [![Build Status](https://travis-ci.org/gpbl/redux-universal-router.svg)](https://travis-ci.org/gpbl/redux-universal-router) [![Coverage Status](https://coveralls.io/repos/gpbl/redux-universal-router/badge.svg?branch=master&service=github)](https://coveralls.io/github/gpbl/redux-universal-router?branch=master)

## This is a work-in progess

Not ready for production: redux-universal-router is a baby-project, there's still work to be done, especially on the client-side part.

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

Routes are the same objects you would pass to [routr](https://github.com/yahoo/routr), with two additional properties:

* `handler` (required) is the React component that will render the route, when matched
* `actionCreator` (optional) is a redux action creator returning an action dispatched *before* the route is rendered
  - it will receive the route's params as argument
  - the action returned by the action creator must follow the [FSA standard](https://github.com/acdlite/flux-standard-action)
  - if the action `payload` is a `Promise`, the route will wait for it before navigating to the new route

```js
const routes = {
  home: {
    path: "/",
    method: "get",    // remember this is required by routr
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

#### Action creators examples

With a route's action creator, you control the state of the store before rendering the route's handler.

##### To dispatch an action before rendering the route, return a simple object

```js
// Action creator
function addToDo({ text }) {
  return {
    type: "ADD_TODO",
    payload: text
  }
}

// route
const add = {
  path: "/todo/add/:text",
  method: "get",
  handler: ToDoPage,
  actionCreator: addToDo     // dispatch the result of addToDo({ text }) before navigating to the route
}

```

##### To dispatch _asynchronously_ an action before rendering a route, return a `Promise` as payload

```js
// Action creator
function requestPost({ postId }) {
  return {
    type: "REQUEST_POST",
    payload: new Promise((resolve, reject) => {
      request(`/api/post/${postId}`)
      .end((err, res) => {

        if (err) {
          const responseError = new Error(res.text);
          responseError.statusCode = err.status;
          return reject(responseError);
        }

        resolve(res.body);

      });

    })
  }
}

// route
const post = {
  path: "/posts/:postId",
  method: "get",
  handler: PostPage,
  actionCreator: requestPost
}
```

Returning a `Promise` will enable a special behaviour of the router:

* when the promise is resolved, the router will dispatch a copy of the action with the resolved value as payload. In the example above, after a successfull `request`, the router will dispatch `{ type: "REQUEST_POST", payload: res.body }` before updating its state with the new route.
* when the promise is rejected, it will dispatch a copy of the action with the rejected value as payload. The navigation will fail and the router state will get an `err` property. The router will dispatch `{ type: "REQUEST_POST", error: true, payload: responseError }`

### 2. Set up the reducer and the redux store

To work correctly, the router's reducer must save its data in the `router` key
in the store's root. You can do this, for example, if you [`combineReducers`](https://rackt.github.io/redux/docs/api/combineReducers.html):

```js
import { combineReducers, createStore } from "rdux"
import { reducer as router } from "redux-universal-router";

// reducer must be named as `router`
const reducer = combineReducers({ router } );

// create the redux store
import { createStore } from "redux";
const store = createStore(reducer);
```

### 3. Server-side: create a router instance and render the root component

Use `router.navigate(url, callback)` to render the root component.
Remember you must create a new store and a new router for each request. For more information about server rendering with redux, [read the docs](https://rackt.github.io/redux/docs/recipes/ServerRendering.html). Your Express middleware would look like:

```js
// handleServerRendering.js
import React from "react";
import { Provider } from "react-redux";
import serialize from "serialize-javascript";

export default function handleServerRendering(req, res, next) {

  // create a store and a router for each request
  const store = createStore(reducer);
  const router = new Router({ store, routes });

  router.navigate(req.url, (err) => {

    const content = React.renderToString(
      <Provider store={ store } >
        { () => <Application /> }
      </Provider>
    );

    // dehydrate the store state
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

// then, in your Express server, use the middleware:
import handleServerRendering from "./handleServerRendering";
app.use(handleServerRendering)
```

### 4. Client-side: create a router instance, listen to history and mount the root component

This part is very similar to the server-side rendering: you initialize the store with the dehydrated state, listen to browser history and mount the root component on the DOM.

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

In your root component, you want to render the component hold by `currentRoute.config.handler`.

* use `currentRoute` to get the config of the current route. Careful: if the route is not available in your `routes`, this will be null.
* use `nextRoute` to get the config of the route it's being called. It has a value only when navigating to a new route, e.g. while waiting for  data from an external API if you used the `actionCreator` in the routes' config.
* use `err` to know the error to display instead of rendering the route's handler component. The route's `actionCreator` can return an error with a `statusCode`, so you know if you want to render a "not found" page or a generic error page.

```js
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "redux-universal-router";

// pass the router state as `props.router
@connect(state => ( { router: state.router } ))

class Application extends Component {

  render() {

    const { router } = this.props;
    const { currentRoute, nextRoute, err } = router;

    const Handler = currentRoute && currentRoute.config.handler;

    return (
      <div>

        { !err && <Handler {...currentRoute.params} /> }
        { err && err.statusCode === 404 && <NotFoundPage /> }
        { err && err.statusCode !== 404 && <ErrorPage error={ err } /> }


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
