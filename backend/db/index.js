import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGO_URL;
const clientOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

async function run() {
  try {
    await mongoose.connect(uri, clientOptions);
    console.log("MongoDB connected!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

export default run;
