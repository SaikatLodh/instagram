import mongoose, { Schema } from "mongoose";

const likeNotificationSchema = new Schema({
  type: {
    type: String,
    default: "",
  },
  postId: {
    type: String,
    default: null,
  },
  userId: {
    type: String,
    default: null,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
});

export const LikeNotification = mongoose.model(
  "likenotification",
  likeNotificationSchema
);
