import expect from "expect";

import Router, { reducer, Link } from "../src";

describe("main script", () => {
  it("should export the right modules", () => {
    expect(Router).toExist();
    expect(reducer).toExist();
    expect(Link).toExist();
  });
});
