const initialState = {
  currentRoute: null, // when the route transition is done
  nextRoute: null,    // when is transitioning to the next route
  error: null,        // when a route did an error,
  pushUrl: null       // url to push to the browser's history
}

export default function reducer(state=initialState, action) {

  const { type, payload } = action;

  switch (type) {
  case "ROUTER_NAVIGATE_SUCCESS":
  case "ROUTER_NAVIGATE_START":
  case "ROUTER_NAVIGATE_FAILURE":
  case "ROUTER_PUSH_HISTORY":
    return Object.assign({}, state, payload);
  default:
    return state
  }

}
