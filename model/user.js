import { Schema, model } from "mongoose";

const userSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true, // each user should have a unique id
  },
  email: {
    type: String,
    required: true,
    unique: true, // no duplicate emails
    lowercase: true, // normalize email
    trim: true,
  },
  username: {
    type: String,
    required: true,
    unique: true, // each username must be unique
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // security: min password length
  },
  name: {
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
    },
  },
  address: {
    city: {
      type: String,
      default: "",
    },
    street: {
      type: String,
      default: "",
    },
    number: {
      type: Number,
      default: null,
    },
    zipcode: {
      type: String,
      default: "",
    },
    geolocation: {
      lat: {
        type: String,
        default: "",
      },
      long: {
        type: String,
        default: "",
      },
    },
  },
  phone: {
    type: String,
    default: "",
  },
});

// Export model (capitalized name)
export default model("User", userSchema);
