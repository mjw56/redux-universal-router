redux-universal-router
======================

A universal router designed for [redux](.).

* works server and client-side
* keeps the router state in your redux store
* makes easy to fetch async data via redux actions

Inspired by [fluxible-router](.), it uses [routr](.) and [history](.).

## Example

```js
const routes = {
  home: {
    path: "/",
    method: "get",
    handler: HomePage
  },
  photo: {
    path: "/photo/:id",
    method: "get",
    handler: PhotoPage,
    fetchData: getPhotoById
  }
};

// add the router reducer
import { reducer as router } from "redux-universal-router";
const reducer = combineReducers({ router, photos } );

// make sure your store uses the redux-promise middleware
const store = createReduxStore();

// create a new instance of the router and navigate to the current url
const router = new Router({ store, routes });
router.navigate({ url: req.url })
    .then(() => {

      // Now render your root component to string (server-side)
      // or mount it (client-side)

    })

// Client side, make the router listen to the browser's history
router.listen();

```
