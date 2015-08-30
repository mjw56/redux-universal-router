/* eslint no-unused-vars: 0, no-console: 0  */

export default function handleServerError(err, req, res, next) {
  console.log("\nExpress error requesting %s %s", req.method, req.url);
  console.log("  Message:", err.message || "(no message available)");
  console.log("    Stack:", err.stack || "(no stack available)");
  console.log(err);
  console.log();
  res.status(500).send("Something bad happened");
}
