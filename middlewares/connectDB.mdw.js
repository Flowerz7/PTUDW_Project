import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const connectMongoDB = () => {
  const uri = process.env.ATLAS_URI;
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });
  const connection = mongoose.connection;
  connection.once("open", () => {
    console.log("MongoDB database connection established successfully");
  });
};

export default connectMongoDB;
