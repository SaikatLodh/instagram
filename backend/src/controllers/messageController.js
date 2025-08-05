import { asyncHandler } from "../utils/asyncHandeller.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Message } from "../models/messageModel.js";
import { Conversation } from "../models/converstationModel.js";
import { isValidObjectId } from "mongoose";
import mongoose from "mongoose";
import { getReceiverSocketId, io } from "../socket/socket.js";

const sendMessage = asyncHandler(async (req, res) => {
  const { receiverId } = req.params;
  const senderId = req.user?._id;
  const { message } = req.body;

  const { ObjectId } = mongoose.Types;

  if (!isValidObjectId(receiverId) || !isValidObjectId(senderId)) {
    return res.status(400).json(new ApiResponse(400, {}, "Invalid id"));
  }

  if (!message) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Message is required"));
  }

  const senderObjectId = new ObjectId(senderId);
  const receiverObjectId = new ObjectId(receiverId);

  // console.log(senderObjectId,receiverObjectId)

  let conversation = await Conversation.findOne({
    participants: { $all: [senderObjectId, receiverObjectId] },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [senderObjectId, receiverObjectId],
    });
  }

  const newMessage = await Message.create({
    senderId: senderObjectId,
    receiverId: receiverObjectId,
    message,
  });

  if (newMessage) {
    conversation.messages.push(newMessage?._id);
    await conversation.save();
  }

  const receiverSocketId = getReceiverSocketId(receiverId);

  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", newMessage);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, newMessage, "Message sent successfully"));
});

const getMessage = asyncHandler(async (req, res) => {
  const { receiverId } = req.params;
  const senderId = req.user?._id;

  const { ObjectId } = mongoose.Types;

  if (!isValidObjectId(receiverId)) {
    return res.status(400).json(new ApiResponse(400, {}, "Invalid id"));
  }

  const senderObjectId = new ObjectId(senderId);
  const receiverObjectId = new ObjectId(receiverId);

  const conversation = await Conversation.findOne({
    participants: { $all: [senderObjectId, receiverObjectId] },
  }).populate("messages");

  if (!conversation) {
    return res.status(200).json(new ApiResponse(200, {}, "Send message"));
  } else {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { message: conversation?.messages },
          "Message fetched successfully"
        )
      );
  }
});

const getChatlist = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!isValidObjectId(userId)) {
    return res.status(400).json(new ApiResponse(400, {}, "Invalid id"));
  }

  const getlatestchat = await Conversation.find({ participants: userId })
    .populate("messages")
    .populate({
      path: "participants",
      select: "profilePicture username email bio",
    })
    .sort({ createdAt: -1 });

  if (!getlatestchat) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Not found chat list"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, getlatestchat, "Chat fetched successfully"));
});

export { sendMessage, getMessage, getChatlist };
