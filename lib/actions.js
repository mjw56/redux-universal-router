"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.navigateStart = navigateStart;
exports.navigateSuccess = navigateSuccess;
exports.navigateFailure = navigateFailure;
exports.pushHistory = pushHistory;

function navigateStart(route) {
  return {
    type: "ROUTER_NAVIGATE_START",
    payload: {
      nextRoute: route,
      pushUrl: null // cleanup url coming from the `pushHistory` action
    }
  };
}

function navigateSuccess(route) {
  return {
    type: "ROUTER_NAVIGATE_SUCCESS",
    payload: {
      nextRoute: null,
      currentRoute: route
    }
  };
}

function navigateFailure(route, err) {
  return {
    type: "ROUTER_NAVIGATE_FAILURE",
    error: true,
    payload: {
      nextRoute: null,
      currentRoute: route,
      err: err
    }
  };
}

function pushHistory(url) {
  return {
    type: "ROUTER_PUSH_HISTORY",
    payload: {
      pushUrl: url
    }
  };
}