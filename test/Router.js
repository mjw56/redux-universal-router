import expect from "expect";
import { createStore, combineReducers } from "redux";
import { createMemoryHistory } from "history";

import Router from "../src/Router";
import routerReducer from "../src/reducer";
import { types } from "../src/constants";

describe("Router", () => {

  it("should initialize correctly", () => {
    const router = new Router({
      store: {},
      routes: {}
    });
    expect(router).toBeA(Router);
  });

  describe("navigate()", () => {

    it("should match an existing route", () => {
      const routes = {
        root: {
          path: "/",
          method: "get"
        }
      }
      const store = {};
      const router = new Router({ store, routes });
      const route = router.matchRoute("/");
      expect(router.matchRoute("/")).toExist();
      expect(route.name).toEqual("root");
    });

    it("should not match an unexisting route", () => {
      const router = new Router({
        store: {},
        routes: {}
      });
      expect(router.matchRoute("/")).toNotExist();
    });

    it("should mark as not found an unexisting route", done => {
      const store = createStore(routerReducer);
      const routes = {};
      const router = new Router({ store, routes });
      router.navigate("/", (err) => {
        const state = store.getState();
        expect(err.statusCode).toEqual(404);
        expect(state.currentRoute).toNotExist();
        expect(state.nextRoute).toNotExist();
        expect(state.pushUrl).toNotExist();
        expect(state.err.statusCode).toEqual(404);
        done();
      });

    });

    it("should navigate to a route without an action creator", done => {
      const routes = {
        root: {
          path: "/",
          method: "get"
        }
      }
      const store = createStore(routerReducer);
      const router = new Router({ store, routes });

      router.navigate("/", (err) => {
        expect(err).toNotExist();

        const state = store.getState();
        expect(state.currentRoute.name).toEqual("root");
        expect(state.nextRoute).toNotExist();
        expect(state.err).toNotExist();
        expect(state.pushUrl).toNotExist();

        done();
      });

    });

    it("should throw if route's action is not a Flux Standard Action", () => {
      const routes = {
        root: {
          path: "/",
          method: "get",
          actionCreator() {
            return {
              type: "BREAK_FSA",
              breakFSA: true
            }
          }
        }
      }
      const store = createStore(routerReducer);
      const router = new Router({ store, routes });
      expect(() => {
        router.navigate("/", () => {})
      }).toThrow();
    });

    it("should not throw if route's action is a Flux Standard Action", () => {
      const routes = {
        root: {
          path: "/",
          method: "get",
          actionCreator() {
            return {
              type: "FOLLOW_FSA",
              payload: "hi"
            }
          }
        }
      }
      const store = createStore(routerReducer);
      const router = new Router({ store, routes });
      expect(() => {
        router.navigate("/", () => {})
      }).toNotThrow();
    });

    it("should handle a route whose action's payload *is not* a Promise", done => {
      const routes = {
        root: {
          path: "/",
          method: "get",
          actionCreator() {
            return {
              type: "DATA_SUCCESS",
              payload: "hi"
            }
          }
        }
      }

      // a data reducer to be combined with router
      function data(state={}, action) {
        if (action.type === "DATA_SUCCESS") {
          return Object.assign({}, state, { foo: "bar" })
        }
        return state;
      }

      const store = createStore(combineReducers({
        data: data,
        router: routerReducer
      }))

      const router = new Router({ store, routes });
      router.navigate("/", (err) => {

        expect(err).toNotExist();

        const state = store.getState();

        // ensure the route action has been called
        expect(state.data.foo).toEqual("bar");

        // ensure the router actions have been called
        expect(state.router.currentRoute.name).toEqual("root");
        expect(state.router.nextRoute).toNotExist();
        expect(state.router.err).toNotExist();
        expect(state.router.pushUrl).toNotExist();

        done();

      });
    });


    it("should a route whose action is an error, and its payload *is not* a Promise", done => {
      const theError = new Error();
      const routes = {
        root: {
          path: "/",
          method: "get",
          actionCreator() {
            return {
              type: "DATA_FAILURE",
              error: true,
              payload: theError
            }
          }
        }
      }

      function data(state={}, action) {
        if (action.type === "DATA_FAILURE") {
          return Object.assign({}, state, { bar: "foo" })
        }
        return state;
      }

      const store = createStore(combineReducers({
        data: data,
        router: routerReducer
      }))

      const router = new Router({ store, routes });
      router.navigate("/", (err) => {
        expect(err).toEqual(theError);

        const state = store.getState();

        // ensure the route action has been called
        expect(state.data.bar).toEqual("foo");

        // ensure the router actions have been called
        expect(state.router.currentRoute.name).toEqual("root");
        expect(state.router.nextRoute).toNotExist();
        expect(state.router.err).toEqual(theError);
        expect(state.router.pushUrl).toNotExist();

        done();

      });
    });


    it("should handle a route returning a Promise as action's payload", done => {
      const routes = {
        root: {
          path: "/",
          method: "get",
          actionCreator() {
            return {
              type: "DATA_SUCCESS",
              meta: {
                "answer": 42
              },
              payload: new Promise( resolve => resolve({ foo: "bar" }) )
            }
          }
        }
      }

      // a data reducer to be combined with router
      function data(state={}, action) {
        if (action.type === "DATA_SUCCESS") {
          return Object.assign({}, state, {
            foo2: action.payload.foo,
            answer: action.meta.answer
          });
        }
        return state;
      }

      const store = createStore(combineReducers({
        data: data,
        router: routerReducer
      }))

      const router = new Router({ store, routes });

      router.navigate("/", (err) => {

        expect(err).toNotExist();

        const state = store.getState();

        // ensure the route action has been called using the data passed to the
        // resolved promise
        expect(state.data.foo2).toEqual("bar");

        // ensure the action has been passed correctly with all its data
        expect(state.data.answer).toEqual(42);

        // ensure the router actions have been called
        expect(state.router.currentRoute.name).toEqual("root");
        expect(state.router.nextRoute).toNotExist();
        expect(state.router.err).toNotExist();
        expect(state.router.pushUrl).toNotExist();

        done();

      });
    });

    it("should handle a route with an action whose Promise is rejected", done => {
      const theError = new Error();
      const routes = {
        root: {
          path: "/",
          method: "get",
          actionCreator() {
            return {
              type: "DATA_FAILURE",
              meta: {
                "answer": 42
              },
              payload: new Promise( (resolve, reject) => reject(theError) )
            }
          }
        }
      }

      // a data reducer to be combined with router
      function data(state={}, action) {
        if (action.type === "DATA_FAILURE") {
          return Object.assign({}, state, {
            reason: action.payload,
            answer: action.meta.answer
          });
        }
        return state;
      }

      const store = createStore(combineReducers({
        data: data,
        router: routerReducer
      }))

      const router = new Router({ store, routes });

      router.navigate("/", (err) => {
        expect(err).toEqual(theError);

        const state = store.getState();

        // ensure the route action has been called using the data passed to the
        // resolved promise
        expect(state.data.reason).toEqual(theError);

        // ensure the action has been passed correctly with all its data
        expect(state.data.answer).toEqual(42);

        // ensure the router actions have been called
        expect(state.router.currentRoute.name).toEqual("root");
        expect(state.router.nextRoute).toNotExist();
        expect(state.router.err).toExist();
        expect(state.router.pushUrl).toNotExist();

        done();

      });
    });

    it("should not navigate the old route when navigating the next one", done => {

      let slowerDidFinish = false;
      let fasterDidFinish = false;

      const routes = {
        slower: {
          path: "/slower",
          method: "get",
          actionCreator() {
            return {
              type: "DATA_SUCCESS",
              payload: new Promise(resolve => {
                setTimeout(() => {
                  slowerDidFinish = true;
                  resolve();
                }, 250)
              })
            }
          }
        },
        faster: {
          path: "/faster",
          method: "get",
          actionCreator() {
            return {
              type: "DATA_SUCCESS",
              payload: new Promise(resolve => {
                setTimeout(() => {
                  fasterDidFinish = true;
                  resolve();
                }, 50)
              })
            }
          }
        }
      }

      const store = createStore(routerReducer);

      const router = new Router({ store, routes });

      router.navigate("/slower");
      router.navigate("/faster");

      setTimeout(() => {
        const state = store.getState();
        // Both promises should have been resolved
        expect(fasterDidFinish).toBeTruthy();
        expect(slowerDidFinish).toBeTruthy();

        // But the faster route must win
        expect(state.currentRoute.name).toEqual("faster");
        done();
      }, 600)

    });

    it("should not fail to navigate the old route when navigating the next one", done => {

      let slowerDidFinish = false;
      let fasterDidFinish = false;

      const routes = {
        slower: {
          path: "/slower",
          method: "get",
          actionCreator() {
            return {
              type: "DATA_SUCCESS",
              payload: new Promise((resolve, reject) => {
                setTimeout(() => {
                  slowerDidFinish = true;
                  reject();
                }, 250)
              })
            }
          }
        },
        faster: {
          path: "/faster",
          method: "get",
          actionCreator() {
            return {
              type: "DATA_SUCCESS",
              payload: new Promise(resolve => {
                setTimeout(() => {
                  fasterDidFinish = true;
                  resolve();
                }, 50)
              })
            }
          }
        }
      }

      const store = createStore(routerReducer);

      const router = new Router({ store, routes });

      router.navigate("/slower");
      router.navigate("/faster");

      setTimeout(() => {
        const state = store.getState();
        // Both promises should have been resolved
        expect(fasterDidFinish).toBeTruthy();
        expect(slowerDidFinish).toBeTruthy();

        // But the faster route must win
        expect(state.currentRoute.name).toEqual("faster");
        done();
      }, 600)

    });

  });

  describe("history", () => {
    it("should listen to history changes", () => {

      const store = createStore(combineReducers({ router: routerReducer }));
      const routes = {
        root: {
          path: "/historytest",
          method: "get"
        }
      }
      const router = new Router({ store, routes });
      const history = createMemoryHistory();
      const spy = expect.spyOn(router, "navigate");
      router.listen(history);
      history.pushState(null, routes.root.path)
      expect(spy).toHaveBeenCalledWith(routes.root.path)
    });

    it("should push the new url when dispatching the ROUTER_NAVIGATE action", () => {
      const store = createStore(combineReducers({ router: routerReducer }));
      const routes = {
        root: {
          path: "/historytest",
          method: "get"
        }
      }
      const router = new Router({ store, routes });
      const history = createMemoryHistory();
      const spy = expect.spyOn(history, "pushState");
      const url = "/historytest";
      router.listen(history);

      store.dispatch({
        type: types.ROUTER_NAVIGATE,
        payload: {
          pushUrl: url
        }
      })
      expect(spy).toHaveBeenCalledWith({}, url);

    });

  });

});
