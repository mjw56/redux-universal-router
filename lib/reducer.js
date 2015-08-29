"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = reducer;
var initialState = {
  currentRoute: null, // when the route transition is done
  nextRoute: null, // when is transitioning to the next route
  error: null, // when a route did an error,
  pushUrl: null // url to push to the browser's history
};

function reducer(state, action) {
  if (state === undefined) state = initialState;
  var type = action.type;
  var payload = action.payload;

  switch (type) {
    case "ROUTER_NAVIGATE_SUCCESS":
    case "ROUTER_NAVIGATE_START":
    case "ROUTER_NAVIGATE_FAILURE":
    case "ROUTER_PUSH_HISTORY":
      return Object.assign({}, state, payload);
    default:
      return state;
  }
}

module.exports = exports["default"];