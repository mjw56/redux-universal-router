/* eslint no-console: 0 */

import "babel-core/polyfill";

import React from "react";
import { createStore, compose } from "redux";
import { Provider } from "react-redux";
import Router from "redux-universal-router";

import { devTools, persistState } from "redux-devtools";
import { DevTools, DebugPanel, LogMonitor } from "redux-devtools/lib/react";

import reducer from "./reducers";
import routes from "./routes";
import Application from "./components/Application";

const finalCreateStore = compose(
  devTools(),
  persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)),
  createStore
);

const initialState = window.__INITIALSTATE__;
const store = finalCreateStore(reducer, initialState);

console.info("Store has been initialized with", initialState);
const url = document.location.pathname;
const router = new Router({ store, routes });

router.listen();

router.navigate(url, (err) => {

  React.render(
    <div>
      <Provider store={ store }>
        { () => <Application /> }
      </Provider>
      <DebugPanel top right bottom>
        <DevTools store={ store } monitor={ LogMonitor } />
      </DebugPanel>
    </div>,
    document.getElementById("content")
  );

  console.info("Application has been mounted");

})
