import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected".yellow);
  } catch (error) {
    console.log(`Database connection error ${error}`.red);
    console.error("Database error:", error.message);
  }
};

export default connectDB;