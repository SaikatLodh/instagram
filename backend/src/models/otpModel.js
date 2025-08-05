import mongoose, { Schema } from "mongoose";
import validator from "validator";
const otpSchema = new Schema({
  otp: {
    type: Number,
    default: null,
    required: true,
  },
  otpExpire: {
    type: Date,
    default: null,
    required: true,
  },
  email: {
    type: String,
    validator: [validator.isEmail, "Please provide valid email."],
    required: true,
  },
  isotpsend: {
    type: Boolean,
    default: false,
  },
  otpVerified: {
    type: Boolean,
    default: false,
  },
});

export const Otp = mongoose.model("otp", otpSchema);
