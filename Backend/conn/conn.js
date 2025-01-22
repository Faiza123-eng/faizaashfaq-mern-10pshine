import mongoose from 'mongoose';
import config from '../config.json' assert { type: 'json' };  // You need this for importing JSON in ES modules

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

export default connectToDatabase;
