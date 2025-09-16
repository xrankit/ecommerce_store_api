import { Schema, model } from "mongoose";

// Cart Schema
const cartSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true, // numeric cart ID
  },
  userId: {
    type: Number, // use numeric ID for consistency with your users
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  products: [
    {
      productId: {
        type: Number, // numeric product ID
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
});

export default model("Cart", cartSchema);
