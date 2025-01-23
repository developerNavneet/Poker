const cron = require("node-cron"); // To run tasks periodically
//.env file read
require("dotenv").config({ debug: process.env.DEBUG });
const venderService = require("./lib/module/v1/vendor/service");
const provider = require("./lib/provider/helperMethods");
const config = require("./lib/config");


config.dbConfigSupervisor(config.cfg, async (error) => {
  if (error) {
    console.error(error, "Exiting the app.");
    return;
  }

  console.log("Running Fetcher job for fetching betting tickets...");
  await provider.ticketFetcher();
  console.error("Failed Fetcher job for fetching betting tickets...");

});
