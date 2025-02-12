require("dotenv").config({ debug: process.env.DEBUG });
const venderService = require("./lib/module/v1/vendor/service");
const provider = require("./lib/provider/helperMethods");
const config = require("./lib/config");


config.dbConfigSupervisor(config.cfg, async (error) => {
  if (error) {
    console.error(error, "Exiting the app.");
    return;
  }

  console.log("Running Processor job for Processing betting tickets...");

    provider.ticketProcessor(1, 10, 0, 10);  // Processor 1 handles 00-10 seconds
    provider.ticketProcessor(2, 10, 10, 20); // Processor 2 handles 10-20 seconds
    provider.ticketProcessor(3, 10, 20, 30); // Processor 3 handles 20-30 seconds
    provider.ticketProcessor(4, 10, 30, 40); // Processor 4 handles 30-40 seconds
    provider.ticketProcessor(5, 10, 40, 50); // Processor 5 handles 40-50 seconds
    provider.ticketProcessor(6, 10, 50, 0); // Processor 6 handles 50-00 seconds

});

// // Helper function to format Date to ISO string with timezone offset and milliseconds
// function formatDateToISOWithOffset(date) {
//   return date.toISOString().replace("Z", "+08:00"); // Keeps the original +08:00 offset
//   // return date.toISOString(); // Keeps the original +08:00 offset
// }
// function formatDateToUnixTime(date) {
// return date.getTime() / 1000;
// }
// exports = async function() {
//   try {
//       // console.log("Context Services:", context.services);

//       const mongoService = context.services.get("Poker");
//       if (!mongoService) {
//           throw new Error("MongoDB service 'Poker' is not available.");
//       }

//       const db = mongoService.db("poker");
//       const bettingCollection = db.collection("bettings");
//       const bettingStatsCollection = db.collection("betting_stats");

//       console.log("Database and collections accessed successfully.");
      
     
//       // Get the current date and time in UTC
//       const currentDate = new Date();
//       const mytDate = new Date(currentDate.getTime() + 8 * 60 * 60 * 1000); // MYT (UTC +8)
      
//       let startDate, endDate;
    
//       console.log("mytDate Current Hour : ", mytDate.getHours());
    
//       // Determine date range based on MYT time
//       if (mytDate.getHours() >= 12 && mytDate.getHours() < 24) {
//           // 12 PM - 11:59 PM MYT for today
//           startDate = new Date(mytDate);
//           startDate.setHours(12, 0, 0, 0);
//           endDate = new Date(mytDate);
//           endDate.setHours(23, 59, 59, 999);
//       } else {
//           // 12 AM - 11:59 AM MYT for yesterday
//           const yesterday = new Date(mytDate);
//           yesterday.setDate(mytDate.getDate() - 1);
//           startDate = new Date(yesterday);
//           startDate.setHours(12, 0, 0, 0);
//           endDate = new Date(mytDate);
//           endDate.setHours(11, 59, 59, 999);
//       }
      
//       // Convert startDate and endDate to ISO format with +08:00 timezone offset
//       const isoStartDate = formatDateToISOWithOffset(startDate);
//       const isoEndDate = formatDateToISOWithOffset(endDate);

//        let startDateUnixTime = formatDateToUnixTime(startDate);
//        let endDateUnixTime = formatDateToUnixTime(endDate);
      
//       // Log for verification
//       console.log(`Calculating stats from ${isoStartDate} to ${isoEndDate} MYT`);
//       console.log(`Calculating stats from ${startDateUnixTime} to ${endDateUnixTime} UNIX`);
  
//       // Perform aggregation to calculate statistics
//       const pipeline = [
//           {
//               $match: {
//                   $and: [
//                       {
//                           CreatedUnixTime: { $gte: startDateUnixTime } // Match if CreatedUnixTime is greater than or equal to start
//                       },
//                       {
//                           CreatedUnixTime: { $lt: endDateUnixTime } // Match if CreatedUnixTime is less than end
//                       }
//                   ]
//               }
//           },
//           {
//               $group: {
//                   _id: {
//                       playerId: "$playerId",
//                       date: {
//                           $dateToString: { format: "%Y-%m-%d", date: { $dateFromString: { dateString: { $substr: ["$ProcessedTime", 0, 23] }, timezone: "+08:00" } } }
//                       }
//                   },
//           sportBet: {
//                       $sum: {
//                           $cond: [
//                               { $eq: ["$product_code", 1] },
//                               "$bet_amount",
//                               0
//                           ]
//                       }
//                   },
//                   sportBeforePayout: {
//                       $sum: {
//                           $cond: [
//                               { $eq: ["$product_code", 1] },
//                               {
//                                   $add: [
//                                       "$payout",
//                                       {
//                                           $multiply: [
//                                               "$profit",
//                                               { $divide: [
//                                                             {
//                                                                 $subtract: [100, { $ifNull: ["$orignal_percentage", 0] }] // Use $subtract for clarity
//                                                             },
//                                                             100
//                                                         ] 
//                                               }
//                                           ]
//                                       }
//                                   ]
//                               },
//                               0
//                           ]
//                       }
//                   },
//                   sportAfterPayout: {
//                       $sum: {
//                           $cond: [
//                               { $eq: ["$product_code", 1] },
//                               {
//                                   $add: [
//                                       "$payout",
//                                       {
//                                           $multiply: [
//                                             "$profit",
//                                             {
//                                                 $divide: [
//                                                     {
//                                                         $subtract: [
//                                                             100,
//                                                             {
//                                                                 $subtract: [
//                                                                     { $ifNull: ["$orignal_percentage", 0] },  // Default to 0 if orignal_percentage is null
//                                                                     { $ifNull: ["$deducted_percentage", 0] }  // Default to 0 if deducted_percentage is null
//                                                                 ]
//                                                             }
//                                                         ]
//                                                     },
//                                                     100
//                                                 ]
//                                             }
//                                         ]
//                                       }
//                                   ]
//                               },
//                               0
//                           ]
//                       }
//                   },
//                   sportBeforeProfit: {
//                       $sum: {
//                           $cond: [
//                               { $eq: ["$product_code", 1] },
//                               {
//                                   $multiply: [
//                                       "$profit",
//                                       { $divide: ["$orignal_percentage", 100] }
//                                   ]
//                               },
//                               0
//                           ]
//                       }
//                   },
//                   sportAfterProfit: {
//                       $sum: {
//                           $cond: [
//                               { $eq: ["$product_code", 1] },
//                               {
//                                   $multiply: [
//                                       "$profit",
//                                       {
//                                           $divide: [
//                                               {
//                                                   $subtract: [
//                                                       { $ifNull: ["$orignal_percentage", 0] }, // Default to 0 if orignal_percentage is null
//                                                       { $ifNull: ["$deducted_percentage", 0] } // Default to 0 if deducted_percentage is null
//                                                   ]
//                                               },
//                                               100 // This divides the adjusted percentage by 100
//                                           ]
//                                       }
//                                   ]
//                               },
//                               0
//                           ]
//                       }
//                   },
//           liveCasinoBet: {
//                       $sum: {
//                           $cond: [
//                               { $eq: ["$product_code", 2] },
//                               "$bet_amount",
//                               0
//                           ]
//                       }
//                   },
//                   liveCasinoBeforePayout: {
//                       $sum: {
//                           $cond: [
//                               { $eq: ["$product_code", 2] },
//                               {
//                                   $add: [
//                                       "$payout",
//                                       {
//                                           $multiply: [
//                                               "$profit",
//                                               { $divide: [
//                                                             {
//                                                                 $subtract: [100, { $ifNull: ["$orignal_percentage", 0] }] // Use $subtract for clarity
//                                                             },
//                                                             100
//                                                         ] 
//                                               }
//                                           ]
//                                       }
//                                   ]
//                               },
//                               0
//                           ]
//                       }
//                   },
//                   liveCasinoAfterPayout: {
//                       $sum: {
//                           $cond: [
//                               { $eq: ["$product_code", 2] },
//                               {
//                                   $add: [
//                                       "$payout",
//                                       {
//                                           $multiply: [
//                                               "$profit",
//                                               {
//                                                   $divide: [
//                                                       {
//                                                           $subtract: [
//                                                             100,
//                                                             {
//                                                                 $subtract: [
//                                                                     { $ifNull: ["$orignal_percentage", 0] },  // Default to 0 if orignal_percentage is null
//                                                                     { $ifNull: ["$deducted_percentage", 0] }  // Default to 0 if deducted_percentage is null
//                                                                 ]
//                                                             }
//                                                         ]
//                                                       },
//                                                       100
//                                                   ]
//                                               }
//                                           ]
//                                       }
//                                   ]
//                               },
//                               0
//                           ]
//                       }
//                   },
//                   liveCasinoBeforeProfit: {
//                       $sum: {
//                           $cond: [
//                               { $eq: ["$product_code", 2] },
//                               {
//                                   $multiply: [
//                                       "$profit",
//                                       { $divide: ["$orignal_percentage", 100] }
//                                   ]
//                               },
//                               0
//                           ]
//                       }
//                   },
//                   liveCasinoAfterProfit: {
//                       $sum: {
//                           $cond: [
//                               { $eq: ["$product_code", 2] },
//                               {
//                                   $multiply: [
//                                       "$profit",
//                                       {
//                                           $divide: [
//                                               {
//                                                   $subtract: [
//                                                       { $ifNull: ["$orignal_percentage", 0] }, // Default to 0 if orignal_percentage is null
//                                                       { $ifNull: ["$deducted_percentage", 0] } // Default to 0 if deducted_percentage is null
//                                                   ]
//                                               },
//                                               100 // This divides the adjusted percentage by 100
//                                           ]
//                                       }
//                                   ]
//                               },
//                               0
//                           ]
//                       }
//                   },				
//           lotteryBet: {
//                       $sum: {
//                           $cond: [
//                               { $eq: ["$product_code", 3] },
//                               "$bet_amount",
//                               0
//                           ]
//                       }
//                   },
//                   lotteryBeforePayout: {
//                       $sum: {
//                           $cond: [
//                               { $eq: ["$product_code", 3] },
//                               {
//                                   $add: [
//                                       "$payout",
//                                       {
//                                           $multiply: [
//                                               "$profit",
//                                               { $divide: [
//                                                             {
//                                                                 $subtract: [100, { $ifNull: ["$orignal_percentage", 0] }] // Use $subtract for clarity
//                                                             },
//                                                             100
//                                                         ] 
//                                               }
//                                           ]
//                                       }
//                                   ]
//                               },
//                               0
//                           ]
//                       }
//                   },
//                   lotteryAfterPayout: {
//                       $sum: {
//                           $cond: [
//                               { $eq: ["$product_code", 3] },
//                               {
//                                   $add: [
//                                       "$payout",
//                                       {
//                                           $multiply: [
//                                             "$profit",
//                                             {
//                                                 $divide: [
//                                                     {
//                                                         $subtract: [
//                                                             100,
//                                                             {
//                                                                 $subtract: [
//                                                                     { $ifNull: ["$orignal_percentage", 0] },  // Default to 0 if orignal_percentage is null
//                                                                     { $ifNull: ["$deducted_percentage", 0] }  // Default to 0 if deducted_percentage is null
//                                                                 ]
//                                                             }
//                                                         ]
//                                                     },
//                                                     100
//                                                 ]
//                                             }
//                                         ]
//                                       }
//                                   ]
//                               },
//                               0
//                           ]
//                       }
//                   },
//                   lotteryBeforeProfit: {
//                       $sum: {
//                           $cond: [
//                               { $eq: ["$product_code", 3] },
//                               {
//                                   $multiply: [
//                                       "$profit",
//                                       { $divide: ["$orignal_percentage", 100] }
//                                   ]
//                               },
//                               0
//                           ]
//                       }
//                   },
//                   lotteryAfterProfit: {
//                       $sum: {
//                           $cond: [
//                               { $eq: ["$product_code", 3] },
//                               {
//                                   $multiply: [
//                                       "$profit",
//                                       {
//                                           $divide: [
//                                               {
//                                                   $subtract: [
//                                                       { $ifNull: ["$orignal_percentage", 0] }, // Default to 0 if orignal_percentage is null
//                                                       { $ifNull: ["$deducted_percentage", 0] } // Default to 0 if deducted_percentage is null
//                                                   ]
//                                               },
//                                               100 // This divides the adjusted percentage by 100
//                                           ]
//                                       }
//                                   ]
//                               },
//                               0
//                           ]
//                       }
//                   },
//           //
//           gamesBet: {
//                       $sum: {
//                           $cond: [
//                               { $eq: ["$product_code", 4] },
//                               "$bet_amount",
//                               0
//                           ]
//                       }
//                   },
//                   gamesBeforePayout: {
//                       $sum: {
//                           $cond: [
//                               { $eq: ["$product_code", 4] },
//                               {
//                                   $add: [
//                                       "$payout",
//                                       {
//                                           $multiply: [
//                                               "$profit",
//                                               { $divide: [
//                                                             {
//                                                                 $subtract: [100, { $ifNull: ["$orignal_percentage", 0] }] // Use $subtract for clarity
//                                                             },
//                                                             100
//                                                         ] 
//                                               }
//                                           ]
//                                       }
//                                   ]
//                               },
//                               0
//                           ]
//                       }
//                   },
//                   gamesAfterPayout: {
//                       $sum: {
//                           $cond: [
//                               { $eq: ["$product_code", 4] },
//                               {
//                                   $add: [
//                                       "$payout",
//                                       {
//                                           $multiply: [
//                                               "$profit",
//                                               {
//                                                   $divide: [
//                                                       {
//                                                           $subtract: [
//                                                             100,
//                                                             {
//                                                                 $subtract: [
//                                                                     { $ifNull: ["$orignal_percentage", 0] },  // Default to 0 if orignal_percentage is null
//                                                                     { $ifNull: ["$deducted_percentage", 0] }  // Default to 0 if deducted_percentage is null
//                                                                 ]
//                                                             }
//                                                         ]
//                                                       },
//                                                       100
//                                                   ]
//                                               }
//                                           ]
//                                       }
//                                   ]
//                               },
//                               0
//                           ]
//                       }
//                   },
//                   gamesBeforeProfit: {
//                       $sum: {
//                           $cond: [
//                               { $eq: ["$product_code", 4] },
//                               {
//                                   $multiply: [
//                                       "$profit",
//                                       { $divide: ["$orignal_percentage", 100] }
//                                   ]
//                               },
//                               0
//                           ]
//                       }
//                   },
//                   gamesAfterProfit: {
//                       $sum: {
//                           $cond: [
//                               { $eq: ["$product_code", 4] },
//                               {
//                                   $multiply: [
//                                       "$profit",
//                                       {
//                                           $divide: [
//                                               {
//                                                   $subtract: [
//                                                       { $ifNull: ["$orignal_percentage", 0] }, // Default to 0 if orignal_percentage is null
//                                                       { $ifNull: ["$deducted_percentage", 0] } // Default to 0 if deducted_percentage is null
//                                                   ]
//                                               },
//                                               100 // This divides the adjusted percentage by 100
//                                           ]
//                                       }
//                                   ]
//                               },
//                               0
//                           ]
//                       }
//                   },
//           //
//           p2pBet: {
//                       $sum: {
//                           $cond: [
//                               { $eq: ["$product_code", 6] },
//                               "$bet_amount",
//                               0
//                           ]
//                       }
//                   },
//                   p2pBeforePayout: {
//                       $sum: {
//                           $cond: [
//                               { $eq: ["$product_code", 6] },
//                               {
//                                   $add: [
//                                       "$payout",
//                                       {
//                                           $multiply: [
//                                               "$profit",
//                                               { $divide: [
//                                                             {
//                                                                 $subtract: [100, { $ifNull: ["$orignal_percentage", 0] }] // Use $subtract for clarity
//                                                             },
//                                                             100
//                                                         ] 
//                                               }
//                                           ]
//                                       }
//                                   ]
//                               },
//                               0
//                           ]
//                       }
//                   },
//                   p2pAfterPayout: {
//                       $sum: {
//                           $cond: [
//                               { $eq: ["$product_code", 6] },
//                               {
//                                   $add: [
//                                       "$payout",
//                                       {
//                                           $multiply: [
//                                             "$profit",
//                                             {
//                                                 $divide: [
//                                                     {
//                                                         $subtract: [
//                                                             100,
//                                                             {
//                                                                 $subtract: [
//                                                                     { $ifNull: ["$orignal_percentage", 0] },  // Default to 0 if orignal_percentage is null
//                                                                     { $ifNull: ["$deducted_percentage", 0] }  // Default to 0 if deducted_percentage is null
//                                                                 ]
//                                                             }
//                                                         ]
//                                                     },
//                                                     100
//                                                 ]
//                                             }
//                                         ]
//                                       }
//                                   ]
//                               },
//                               0
//                           ]
//                       }
//                   },
//                   p2pBeforeProfit: {
//                       $sum: {
//                           $cond: [
//                               { $eq: ["$product_code", 6] },
//                               {
//                                   $multiply: [
//                                       "$profit",
//                                       { $divide: ["$orignal_percentage", 100] }
//                                   ]
//                               },
//                               0
//                           ]
//                       }
//                   },
//                   p2pAfterProfit: {
//                       $sum: {
//                           $cond: [
//                               { $eq: ["$product_code", 6] },
//                               {
//                                   $multiply: [
//                                       "$profit",
//                                       {
//                                           $divide: [
//                                               {
//                                                   $subtract: [
//                                                       { $ifNull: ["$orignal_percentage", 0] }, // Default to 0 if orignal_percentage is null
//                                                       { $ifNull: ["$deducted_percentage", 0] } // Default to 0 if deducted_percentage is null
//                                                   ]
//                                               },
//                                               100 // This divides the adjusted percentage by 100
//                                           ]
//                                       }
//                                   ]
//                               },
//                               0
//                           ]
//                       }
//                   }
//               }
//           },
//           // Add a final stage if necessary
//           {
//               $project: {
//                   playerId: "$_id.playerId",
//                   date: "$_id.date",
//                   sportBet: 1,
//                   sportBeforePayout: 1,
//                   sportAfterPayout: 1,
//                   sportBeforeProfit: 1,
//                   sportAfterProfit: 1,

//                   liveCasinoBet: 1,
//                   liveCasinoBeforePayout: 1,
//                   liveCasinoAfterPayout: 1,
//                   liveCasinoBeforeProfit: 1,
//                   liveCasinoAfterProfit: 1,

//                   lotteryBet: 1,
//                   lotteryBeforePayout: 1,
//                   lotteryAfterPayout: 1,
//                   lotteryBeforeProfit: 1,
//                   lotteryAfterProfit: 1,

//                   gamesBet: 1,
//                   gamesBeforePayout: 1,
//                   gamesAfterPayout: 1,
//                   gamesBeforeProfit: 1,
//                   gamesAfterProfit: 1,

//                   p2pBet: 1,
//                   p2pBeforePayout: 1,
//                   p2pAfterPayout: 1,
//                   p2pBeforeProfit: 1,
//                   p2pAfterProfit: 1,
//               }
//           }
//       ];
//       try {
//         // console.log("Aggregation Pipeline: ", JSON.stringify(pipeline));
//        const results = await bettingCollection.aggregate(pipeline).toArray();
//         console.log("Betting Query Result: ", results);
//         console.log("Type of results: ", typeof results);
//         console.log("Length of results: ", results.length);
//         console.log("Is results an array? ", Array.isArray(results)); // Check if results is an array      

//         if (Array.isArray(results)) {
//           // Update betting_stats collection
//           for (const result of results) {
//               const { playerId, date } = result._id;
//               console.log("playerId: ", playerId);
//               // Delete existing records for the user and date
//               await bettingStatsCollection.deleteMany({ playerId, date });
      
//               // Insert the new statistics
//               await bettingStatsCollection.insertOne({
//                   playerId,
//                   date,
//                   sportBet: result.sportBet,
//                   sportBeforePayout: result.sportBeforePayout,
//                   sportAfterPayout: result.sportAfterPayout,
//                   sportBeforeProfit: result.sportBeforeProfit,
//                   sportAfterProfit: result.sportAfterProfit,
      
//                   liveCasinoBet: result.liveCasinoBet,
//                   liveCasinoBeforePayout: result.liveCasinoBeforePayout,
//                   liveCasinoAfterPayout: result.liveCasinoAfterPayout,
//                   liveCasinoBeforeProfit: result.liveCasinoBeforeProfit,
//                   liveCasinoAfterProfit: result.liveCasinoAfterProfit,
      
//                   lotteryBet: result.lotteryBet,
//                   lotteryBeforePayout: result.lotteryBeforePayout,
//                   lotteryAfterPayout: result.lotteryAfterPayout,
//                   lotteryBeforeProfit: result.lotteryBeforeProfit,
//                   lotteryAfterProfit: result.lotteryAfterProfit,
      
//                   gamesBet: result.gamesBet,
//                   gamesBeforePayout: result.gamesBeforePayout,
//                   gamesAfterPayout: result.gamesAfterPayout,
//                   gamesBeforeProfit: result.gamesBeforeProfit,
//                   gamesAfterProfit: result.gamesAfterProfit,
      
//                   p2pBet: result.p2pBet,
//                   p2pBeforePayout: result.p2pBeforePayout,
//                   p2pAfterPayout: result.p2pAfterPayout,
//                   p2pBeforeProfit: result.p2pBeforeProfit,
//                   p2pAfterProfit: result.p2pAfterProfit,
//                   // Add all other calculated fields...
//               });
//           }
//           return { message: "Function executed successfully." };
//         } else {
//             throw new Error("Results from aggregation are not iterable.");
//         }
//       } catch (error) {
//         console.error("Error processing betting stats:", error);
//         return { message: "An error occurred Error processing betting stats:", error: error.toString() };
//       }
//   } catch (error) {
//       console.error("An error occurred:", error);
//       return { message: "An error occurred", error: error.toString() };
//   }
// };
