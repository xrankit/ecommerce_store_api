import { Schema, model } from "mongoose";

const productSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true, // each product should have a unique id
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

// Export model (use capitalized name)
export default model("Product", productSchema);
