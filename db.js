import mongoose from "mongoose";
import { config } from "dotenv";
import { expand } from "dotenv-expand";

const myEnv = config();
expand(myEnv);

const mongoUri = process.env.DATABASE_URL;

if (!mongoUri) {
  console.error("❌ DATABASE_URL not found in .env file");
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => console.log("✅ MongoDB Atlas connected successfully"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

export default mongoose.connection;

