import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "reels",
      required: true,
    },
  },

  { timestamps: true }
);

export const ReelsComment = mongoose.model("reelscomment", commentSchema);
