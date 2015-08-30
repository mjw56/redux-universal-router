import React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import Router from "redux-universal-router";
import serialize from "serialize-javascript";

import reducer from "../reducers";
import routes from "../routes";
import Application from "../components/Application";

export default function handleServerRendering(req, res, next) {

  const store = createStore(reducer);

  const router = new Router({ store, routes });

  router.navigate(req.url, (err) => {

    const content = React.renderToString(
      <Provider store={ store } >
        { () => <Application /> }
      </Provider>
    );

    const initialState = `window.__INITIALSTATE__=${serialize(store.getState())};`;

    if (err && err.statusCode) {
      res.status(err.statusCode);
    }

    res.send(`<!doctype html>
<html>
  <link href="/assets/style.css" rel="stylesheet">
  <body>
  <div id="content">${content}</div>
  <script>${initialState}</script>
  <script src="http://localhost:3001/dist/bundle.js"></script>
</html>
`);

  });

}
