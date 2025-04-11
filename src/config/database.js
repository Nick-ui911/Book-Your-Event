import mongoose from "mongoose";
import dotenv from "dotenv"; // ⬅️ ADD this

dotenv.config(); // ⬅️ AND this

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "EventTicketSeller",
    });
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};
