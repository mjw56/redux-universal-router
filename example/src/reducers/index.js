import { combineReducers } from "redux";
import { reducer as router } from "redux-universal-router";
import developers from "./developers";

export default combineReducers({ router, developers });
