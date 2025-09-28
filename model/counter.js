import { Schema, model } from "mongoose";

const counterSchema = new Schema({
  name: { type: String, required: true, unique: true },
  value: { type: Number, default: 0 }
});

export default model("Counter", counterSchema);
