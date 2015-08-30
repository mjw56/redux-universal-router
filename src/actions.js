import { types } from "./constants";

export function navigateStart(route) {

  return {
    type: types.ROUTER_NAVIGATE_START,
    payload: {
      nextRoute: route,
      pushUrl: null
    }
  }
}

export function navigateSuccess(route) {
  return {
    type: types.ROUTER_NAVIGATE_SUCCESS,
    payload: {
      nextRoute: null,
      currentRoute: route,
      err: null,
      pushUrl: null
    }
  }
}

export function navigateFailure(route, err) {
  return {
    type: types.ROUTER_NAVIGATE_FAILURE,
    error: true,
    payload: {
      nextRoute: null,
      currentRoute: route,
      err: err,
      pushUrl: null
    }
  }
}

export function navigate(url) {
  return {
    type: types.ROUTER_NAVIGATE,
    payload: {
      pushUrl: url
    }
  }
}
