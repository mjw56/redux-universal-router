import expect from "expect";
import reducer from "../src/reducer";
import { types } from "../src/constants";

describe("reducer", () => {

  it("should return the initial state", () => {
    const initialState = {
      nextRoute: null,
      currentRoute: null,
      err: null,
      pushUrl: null
    };
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it("should handle ROUTER_NAVIGATE_START", () => {
    const route = {};
    expect(reducer({}, {
      type: types.ROUTER_NAVIGATE_START,
      payload: {
        nextRoute: route,
        pushUrl: null
      }
    })).toEqual({
      nextRoute: route,
      pushUrl: null
    });
  });

  it("should handle ROUTER_NAVIGATE_SUCCESS", () => {
    const route = {};
    expect(reducer({}, {
      type: types.ROUTER_NAVIGATE_SUCCESS,
      payload: {
        nextRoute: null,
        currentRoute: route
      }
    })).toEqual({
      nextRoute: null,
      currentRoute: route
    });
  });

  it("should handle ROUTER_NAVIGATE_FAILURE", () => {
    const route = {};
    const err = {};
    expect(reducer({}, {
      type: types.ROUTER_NAVIGATE_FAILURE,
      payload: {
        nextRoute: null,
        currentRoute: route,
        err: err
      }
    })).toEqual({
      nextRoute: null,
      currentRoute: route,
      err: err
    });
  });


  it("should handle ROUTER_NAVIGATE", () => {
    const url = "/example";
    expect(reducer({}, {
      type: types.ROUTER_NAVIGATE,
      payload: {
        pushUrl: url
      }
    })).toEqual({
      pushUrl: url
    });
  });

});
