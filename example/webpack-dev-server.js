
/* eslint no-console: 0 */

import WebpackDevServer from "webpack-dev-server";
import webpack from "webpack";

import config from "./webpack.config";

const host = "localhost";
const port = 3001;

const options = {
  contentBase: `http://${host}:${port}`,
  hot: true,
  inline: true,
  lazy: false,
  publicPath: config.output.publicPath,
  stats: {
    colors: true
  }
};

const compiler = webpack(config);

new WebpackDevServer(compiler, options).listen(port, host, function() {
  console.log("Webpack development server listening on %s", port);
});
