//.env file read
require("dotenv").config({ debug: process.env.DEBUG });
const cors = require("cors");
// Import Config
const config = require("./lib/config");

// Import logger
const logger = require("./lib/logger").logger;

config.dbConfig(config.cfg, (error) => {
  if (error) {
    logger.error(error, "Exiting the app.");
    return;
  }

  // load external modules
  const express = require("express");
  const responseTime = require("response-time");

  // init express app
  const app = express();
  // Trust the proxy to pass the correct IP
  app.set("trust proxy", true);
  app.use(cors());
  app.use(responseTime());

  // Add JSON parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/uploads", express.static("uploads"));
  // app.use(cookisParser());

  // set the view engine to ejs
  app.set("views", __dirname + "/views");
  app.set("view engine", "ejs");

  // set server home directory
  app.locals.rootDir = __dirname;

  // config express
  config.expressConfig(app, config.cfg.environment);
  console.log("env : ", config.cfg.environment);

  // attach the routes to the app
  require("./lib/route")(app);
  // require("./lib/services/cronScheduler");

  // start server
  app.listen(config.cfg.port, () => {});

  // process.on('unhandledRejection', (reason, promise) => {
  //   console.error('Unhandled Rejection:', reason);
  //   // process.exit(1);
  // });
});

/////////////navneet////////////////////
