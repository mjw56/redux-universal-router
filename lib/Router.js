"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _routr = require("routr");

var _routr2 = _interopRequireDefault(_routr);

var _actions = require("./actions");

var _historyLibCreateBrowserHistory = require("history/lib/createBrowserHistory");

var _historyLibCreateBrowserHistory2 = _interopRequireDefault(_historyLibCreateBrowserHistory);

function isSameRoute(route1, route2) {
  // TODO: check params
  return route1.name === route2.name;
}

var Router = (function () {
  function Router(_ref) {
    var store = _ref.store;
    var routes = _ref.routes;

    _classCallCheck(this, Router);

    this.routes = routes;
    this.store = store;
    this.router = new _routr2["default"](routes);
  }

  _createClass(Router, [{
    key: "listen",
    value: function listen() {

      // Listen to changes to the browser's history
      this._history = (0, _historyLibCreateBrowserHistory2["default"])();
      this._unlistenHistoryListener = this._history.listen(this.handleHistoryChange.bind(this));
      this._unsubscribeStoreListener = this.store.subscribe(this.handleStoreChange.bind(this));
    }
  }, {
    key: "unlisten",
    value: function unlisten() {
      this._unlistenHistoryListener();
      this._unsubscribeStoreListener();
    }
  }, {
    key: "handleStoreChange",
    value: function handleStoreChange() {
      var state = this.store.getState();
      if (state.router && state.router.pushUrl) {
        // TODO: add data for the scroll position
        this._history.pushState({}, state.router.pushUrl);
      }
    }
  }, {
    key: "handleHistoryChange",
    value: function handleHistoryChange(location) {
      this.navigate({
        url: location.pathname
      });
    }
  }, {
    key: "navigate",
    value: function navigate(_ref2) {
      var _this = this;

      var url = _ref2.url;

      var route = this.matchRoute(url);
      if (!route) {
        return Promise.reject({
          statusCode: 404
        });
      }

      // TODO: remove `handler` variable from route (cannot stay in store)
      this.store.dispatch((0, _actions.navigateStart)(route));

      this._currentRoute = route;

      return new Promise(function (resolve, reject) {

        if (!route.config.fetchData) {
          // No need to fetch data async for this route
          _this.store.dispatch((0, _actions.navigateSuccess)(route));
          resolve({ isNotFound: false });
          return;
        }

        // Fetch data for this route
        _this.store.dispatch(route.config.fetchData(route)).then(function () {

          if (!isSameRoute(route, _this._currentRoute)) {
            return;
          }
          _this.store.dispatch((0, _actions.navigateSuccess)(route));
          resolve({ isNotFound: false });
        })["catch"](function (err) {
          if (!isSameRoute(route, _this._currentRoute)) {
            return;
          }
          _this.store.dispatch((0, _actions.navigateFailure)(route, err));
          if ((err.statusCode || err.status) === 404) {
            resolve({
              isNotFound: true
            });
            return;
          }

          reject(err);
        });
      });
    }
  }, {
    key: "matchRoute",
    value: function matchRoute(url, options) {
      var route = this.router.getRoute(url, options);
      if (!route) {
        return null;
      }
      return route;
    }
  }]);

  return Router;
})();

exports["default"] = Router;
module.exports = exports["default"];