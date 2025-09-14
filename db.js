import mongoose from "mongoose";

const mongoUri = process.env.DATABASE_URL || "mongodb://localhost:27017/testDB";

if (!mongoose.connection.readyState) {
  mongoose.connect(mongoUri);
}

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("MongoDB connected successfully"));

export default db;
