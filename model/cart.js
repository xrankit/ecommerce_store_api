import { Schema, model } from "mongoose";
import Product from "./product.js";
import User from "./user.js";

// Define schema
const cartSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true, // optional but recommended if "id" is unique
  },
  userId: {
    type: Schema.Types.ObjectId, // Should be ObjectId, not Number
    ref: "User", // Reference model name (string), not imported model
    required: true,
  },
  date: {
    type: Date,
    default: Date.now, // optional default
  },
  products: [
    {
      productId: {
        type: Schema.Types.ObjectId, // Should be ObjectId, not Number
        ref: "Product", // Reference model name
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1, // prevent 0 or negative quantity
      },
    },
  ],
});

// Export model
export default model("Cart", cartSchema);
