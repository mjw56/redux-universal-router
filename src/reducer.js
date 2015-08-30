import { types } from "./constants";

const initialState = {
  currentRoute: null, // when the route transition is done
  nextRoute: null,    // when is transitioning to the next route
  err: null,          // the error object, when a route did fail
  pushUrl: null       // url to push to the browser's history
}

export default function reducer(state=initialState, action) {
  const { type, payload } = action;
  switch (type) {
  case types.ROUTER_NAVIGATE_START:
  case types.ROUTER_NAVIGATE_SUCCESS:
  case types.ROUTER_NAVIGATE_FAILURE:
  case types.ROUTER_NAVIGATE:
    const newState = Object.assign({}, state, payload);
    return newState;
  default:
    return state
  }

}
