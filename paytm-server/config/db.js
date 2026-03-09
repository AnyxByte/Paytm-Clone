import mongoose from "mongoose";

export async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "BankingProject",
    });
    console.log("database connected successfully");
  } catch (error) {
    console.log("error connecting db ", error);
    process.exit(1);
  }
}
