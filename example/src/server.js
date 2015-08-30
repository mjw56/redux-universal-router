/* eslint no-console: 0 */
import path from "path";
import express from "express";
import serveFavicon from "serve-favicon";
import serveStatic from "serve-static";
import morgan from "morgan";

import handleServerRendering from "./utils/handleServerRendering";
import handleServerError from "./utils/handleServerError";

const assetsPath = path.resolve(__dirname, "../assets");

const app = express();

app.set("port", 3000);
app.use(morgan("dev"));
app.use(serveFavicon(`${assetsPath}/favicon.png`));
app.use("/assets", serveStatic(assetsPath));

app.use(handleServerRendering);
app.use(handleServerError);

app.listen(app.get("port"), () => {
  console.log("Express server listening on port %s", app.get("port"));
});
