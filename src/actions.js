
export function navigateStart(route) {
  return {
    type: "ROUTER_NAVIGATE_START",
    payload: {
      nextRoute: route,
      pushUrl: null     // cleanup url coming from the `pushHistory` action
    }
  }
}

export function navigateSuccess(route) {
  return {
    type: "ROUTER_NAVIGATE_SUCCESS",
    payload: {
      nextRoute: null,
      currentRoute: route
    }
  }
}

export function navigateFailure(route, err) {
  return {
    type: "ROUTER_NAVIGATE_FAILURE",
    error: true,
    payload: {
      nextRoute: null,
      currentRoute: route,
      err: err
    }
  }
}

export function pushHistory(url) {
  return {
    type: "ROUTER_PUSH_HISTORY",
    payload: {
      pushUrl: url
    }
  }
}
