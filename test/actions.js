import expect from "expect";
import * as actions from "../src/actions";
import { types } from "../src/constants";

describe("actions", () => {

  it("should create an action to start the navigation", () => {
    const route = { };
    const expectedAction = {
      type: types.ROUTER_NAVIGATE_START,
      payload: {
        nextRoute: route,
        pushUrl: null
      }
    }
    expect(actions.navigateStart(route)).toEqual(expectedAction);
  });

  it("should create an action for a successfull navigation", () => {
    const route = { };
    const expectedAction = {
      type: types.ROUTER_NAVIGATE_SUCCESS,
      payload: {
        nextRoute: null,
        currentRoute: route,
        err: null,
        pushUrl: null
      }
    }
    expect(actions.navigateSuccess(route)).toEqual(expectedAction);
  });

  it("should create an action for a failed navigation", () => {
    const route = { };
    const err = { };
    const expectedAction = {
      type: types.ROUTER_NAVIGATE_FAILURE,
      error: true,
      payload: {
        nextRoute: null,
        currentRoute: route,
        err: err,
        pushUrl: null
      }
    }
    expect(actions.navigateFailure(route, err)).toEqual(expectedAction);
  });

  it("should create an action to push an url to the history", () => {
    const url = "/example";
    const expectedAction = {
      type: types.ROUTER_NAVIGATE,
      payload: {
        pushUrl: url
      }
    }
    expect(actions.navigate(url)).toEqual(expectedAction);
  });

});
