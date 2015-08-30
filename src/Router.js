import Routr from "routr";
import { navigateStart, navigateSuccess, navigateFailure } from "./actions";
import { isFSA } from "flux-standard-action";
import createHistory from "history/lib/createBrowserHistory";
import invariant from "invariant";

function isSameRoute(route1, route2) {
  return route1.url === route2.url;
}

function isPromise(thing) {
  return thing && typeof thing.then === "function";
}

export default class Router {

  constructor({ store, routes }) {
    this.store = store;
    this.routes = routes;
    this.routr = new Routr(routes);
  }

  listen(history=createHistory()) {

    // Listen for changes to the browser's history
    this.history = history;
    this.history.listen( ::this.handleHistoryChange );

    // Listen for changes to the store
    this.store.subscribe( ::this.handleStoreChange );

  }

  handleStoreChange() {
    const state = this.store.getState();

    invariant("router" in state, "The store must contain a router state in its root. Make sure you apply the router reducer to the `router` key.");

    // TODO: add data for the scroll position
    if (state.router.pushUrl) {
      this.history.pushState({}, state.router.pushUrl);
    }

  }

  handleHistoryChange(location) {
    this.lastLocation = location;
    this.navigate(location.pathname);
  }

  navigate(url, done=() => { }) {
    const { dispatch } = this.store;

    const route = this.matchRoute(url);

    if (!route) {
      const err = new Error("Route not found");
      err.statusCode = 404;
      dispatch(navigateFailure(null, err));
      return done(err);
    }

    dispatch(navigateStart(route));

    const { actionCreator } = route.config;

    if (!actionCreator) {
      // No need to dispatch an action
      dispatch(navigateSuccess(route));
      return done();
    }

    const action = actionCreator(route.params);
    const { payload, error } = action;
    invariant(isFSA(action), "Action must be a Flux Standard Action");

    if (!isPromise(payload)) {
      dispatch(action);
      if (error) {
        dispatch(navigateFailure(route, payload));
        return done(payload);
      }
      dispatch(navigateSuccess(route));
      return done();
    }

    // Action's payload is promise: save the current router for later reference
    this._currentRoute = route;

    // ...and wait the promise is fullfilled before dispatching its result
    // and the navigateSuccess/navigateFalure actions
    payload.then(

      result => {

        if (!isSameRoute(route, this._currentRoute)) {
          // The result of the promise may come after another navigation has
          // been started. If we are handling an older route, we won't do
          // anything here.
          return;
        }

        // We expect the promise's result to be the action to be dispatched
        // (similarly to the redux-promise middleware)
        dispatch({ ...action, payload: result });

        dispatch(navigateSuccess(route));
        done();
      },

      err => {

        if (!isSameRoute(route, this._currentRoute)) {
          return;
        }

        dispatch({ ...action, payload: err, error: true });
        dispatch(navigateFailure(route, err));
        done(err);
      }

    );

  }

  matchRoute(url, options) {
    const route = this.routr.getRoute(url, options);
    if (!route) {
      return null;
    }
    return route;
  }


}
