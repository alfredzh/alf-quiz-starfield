import mongoose from "mongoose";

export default async function connectDB() {
  const options = {
    useNewUrlParser: true,
    autoIndex: false,
    maxPoolSize: 10,
  };

  console.log("MongoDB connection start");

  try {
    await mongoose.connect("mongodb://mongo:27017/MineApp", options);
  } catch (err) {
    console.log("MongoDB connection unsuccessful", err);
  }

  console.log("MongoDB is connected");
}
