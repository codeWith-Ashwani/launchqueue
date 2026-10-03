const path = require("path");
const backend = process.env.LAUNCHQUEUE_BACKEND_DIR || path.resolve(__dirname, "../../launchqueue/server");
require(path.join(backend, "scripts/localDemo.js")).startDemo({ clientUrl: "http://localhost:4173" })
  .catch(() => { console.error("Unable to start browser test backend. Install backend dependencies and set LAUNCHQUEUE_BACKEND_DIR."); process.exitCode = 1; });
