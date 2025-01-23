const cron = require("node-cron"); // For scheduling tasks
require("dotenv").config({ debug: process.env.DEBUG }); // Load environment variables
const venderService = require("./lib/module/v1/vendor/service"); // Vendor service module
const provider = require("./lib/provider/helperMethods"); // Helper methods
const config = require("./lib/config"); // Configuration
const moment = require("moment");

// Initialize database configuration
config.dbConfigCron(config.cfg, async (error) => {
  if (error) {
    console.error("Database connection error:", error);
    process.exit(1); // Exit if DB connection fails
  }

  console.log("Database connected. Scheduling tasks...");

  // Vendor maintenance check (every 30 minutes)
  cron.schedule("*/30 * * * *", () => {
    console.log("Running cron job: Vendor maintenance check...");
    venderService.cronCheckVendorMaintenance();
  });

  // Agent profit report generation (daily at 1 PM)
  cron.schedule("0 05 * * *", async () => {
    // cron.schedule("* * * * *", async () => {
    console.log("Running cron job: Generate agent report...");
    try {
      await provider.generateAgentReport();
      console.log("Agent report generation completed.");
    } catch (error) {
      console.error("Error in generating agent report:", error);
    }
  });

  // Daily cron jobs (at 4 PM)
  cron.schedule("0 08 * * *", async () => {
    //   cron.schedule("* * * * *", async () => {
    console.log("Running daily cron jobs...");
    try {
      console.log("Updating agent profit to balance...");
      await provider.updateAgentProfitAsBalance();

      console.log("Updating user bonus from pending bonus...");
      await provider.updateUserBonusFromPendingBonus();

      console.log("Updating user referral rewards to parent balance...");
      await provider.updateUserRefferalRewardToBalance();

      console.log("Daily cron jobs completed successfully.");
    } catch (error) {
      console.error("Error during daily cron jobs:", error);
    }
  });

  // Downline deposit reward generation (daily at 6 PM)
  cron.schedule("0 10 * * *", async () => {
    // cron.schedule("* * * * *", async () => {
    console.log("Running cron job: Generate Downline deposit reward...");
    try {
      await provider.generateDownlineDepositReward();
      console.log("Downline deposit reward generation completed.");
    } catch (error) {
      console.error("Error in generating Downline deposit reward:", error);
    }
  });
  // console.log("Date ", new Date());
  // console.log("Date ", new Date().setHours(12, 0, 0, 0));
  // console.log("Date ", new Date().setUTCHours(12, 0, 0, 0));
  // console.log("Date ", moment().utcOffset(8));
  // console.log("Date ", moment().utcOffset(8).hour(13).minute(0).second(0));
  console.log("All cron jobs scheduled successfully.");
});
