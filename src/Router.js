import Routr from "routr";
import { navigateStart, navigateSuccess, navigateFailure } from "./actions";

import createHistory from "history/lib/createBrowserHistory";

function isSameRoute(route1, route2) {
  // TODO: check params
  return route1.name === route2.name;
}

export default class Router {

  constructor({ store, routes }) {
    this.routes = routes;
    this.store = store;
    this.router = new Routr(routes);
  }

  listen() {

    // Listen to changes to the browser's history
    this._history = createHistory();
    this._unlistenHistoryListener = this._history.listen( ::this.handleHistoryChange );
    this._unsubscribeStoreListener = this.store.subscribe( ::this.handleStoreChange );
  }

  unlisten() {
    this._unlistenHistoryListener();
    this._unsubscribeStoreListener();
  }

  handleStoreChange() {
    const state = this.store.getState();
    if (state.router && state.router.pushUrl) {
      // TODO: add data for the scroll position
      this._history.pushState({}, state.router.pushUrl);
    }
  }

  handleHistoryChange(location) {
    this.navigate({
      url: location.pathname
    });
  }

  navigate({ url }) {
    const route = this.matchRoute(url);
    if (!route) {
      return Promise.reject({
        statusCode: 404
      });
    }

    // TODO: remove `handler` variable from route (cannot stay in store)
    this.store.dispatch(navigateStart(route));

    this._currentRoute = route;

    return new Promise((resolve, reject) => {

      if (!route.config.fetchData) {
        // No need to fetch data async for this route
        this.store.dispatch(navigateSuccess(route));
        resolve({ isNotFound: false });
        return;
      }

      // Fetch data for this route
      this.store.dispatch(route.config.fetchData(route))
        .then(() => {

          if (!isSameRoute(route, this._currentRoute)) {
            return;
          }
          this.store.dispatch(navigateSuccess(route));
          resolve({ isNotFound: false });
        })
        .catch(err => {
          if (!isSameRoute(route, this._currentRoute)) {
            return;
          }
          this.store.dispatch(navigateFailure(route, err));
          if ((err.statusCode || err.status) === 404) {
            resolve({
              isNotFound: true
            });
            return;
          }

          reject(err);
        })

    });

  }

  matchRoute(url, options) {
    const route = this.router.getRoute(url, options);
    if (!route) {
      return null;
    }
    return route;
  }


}
