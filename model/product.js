import { Schema, model } from "mongoose";

const productSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true, // ensures each product has a unique numeric id
  },
  title: {
    type: String,
    required: true,
    trim: true, // removes extra spaces
  },
  price: {
    type: Number,
    required: true,
    min: 0, // no negative prices
  },
  description: {
    type: String,
    default: "", // avoids undefined
  },
  image: {
    type: String,
    default: "", // optional fallback
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
});

export default model("Product", productSchema);
