import { Schema, model } from "mongoose";

const cartSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: Number,
    required: true,
    index: true
  },
  date: {
    type: Date,
    default: Date.now,
  },
  products: [
    {
      productId: {
        type: Number,
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
