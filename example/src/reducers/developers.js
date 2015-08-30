
export default function reducer(state={}, action) {
  switch (action.type) {
  case "REQUEST_DEVELOPER":
  case "REQUEST_ALL_DEVELOPERS":
    if (action.error) {
      return state;
    }
    return Object.assign({}, state, action.payload);
  default:
    return state;
  }
}
