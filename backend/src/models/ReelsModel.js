import mongoose, { Schema } from "mongoose";

const posrSchema = new Schema(
  {
    caption: {
      type: String,
      default: "",
    },
    contant: {
      url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "reelscomment",
      },
    ],
  },
  { timestamps: true }
);

export const Reels = mongoose.model("reels", posrSchema);
