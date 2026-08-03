
import mongoose from "mongoose";

const mongo_URI = process.env.MONGO_URI;

const connectDB=async()=> {
  try {
    await mongoose.connect(mongo_URI);
    console.log("✅ DB connected successfully");
  } catch (error) {
    console.error(error.stack);
    process.exit(1);
  }
}

export default connectDB;

