import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const instance = await mongoose.connect(
      `${process.env.MONGODB_URI}/Memento`
    );
    console.log("Connected to mongodb", instance.connection.host);
  } catch (error) {
    console.log("Error connecting to mongodb", error);
    process.exit(1);
  }
};

export default connectDB;
