import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () =>
      console.log("Database Connected Successfully")
    );

    await mongoose.connect(process.env.MONGODB_URI); // <-- FIXED
  } catch (error) {
    console.error(error.message);
    console.log("Mongodb Connection Error");
  }
};

export default connectDB;

