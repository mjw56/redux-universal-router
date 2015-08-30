import expect from "expect";
import { types } from "../src/constants";

describe("constants", () => {

  it("should contain the action type to start a navigation", () => {
    expect(types.ROUTER_NAVIGATE_START).toEqual("ROUTER_NAVIGATE_START");
  });

  it("should contain the action type for a successfull navigation", () => {
    expect(types.ROUTER_NAVIGATE_SUCCESS).toEqual("ROUTER_NAVIGATE_SUCCESS");
  });

  it("should contain the action type for a failed navigation", () => {
    expect(types.ROUTER_NAVIGATE_FAILURE).toEqual("ROUTER_NAVIGATE_FAILURE");
  });

  it("should contain the action type to push the history", () => {
    expect(types.ROUTER_NAVIGATE).toEqual("ROUTER_NAVIGATE");
  });

});
