const mongoose = require("mongoose");
const config = require("../config.json");

const connectToDatabase = async () => {
  try {
    console.log("Connecting to Database successfully"); 
    await mongoose.connect(config.connectionString);
    console.log("Connected to Database successfully");
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1); // Exit if connection fails
  }
};

module.exports = connectToDatabase;

