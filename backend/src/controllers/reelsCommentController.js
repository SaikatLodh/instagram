import { asyncHandler } from "../utils/asyncHandeller.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ReelsComment } from "../models/ReelsCommentModel.js";
import { isValidObjectId } from "mongoose";
import { Reels } from "../models/ReelsModel.js";

const addReelsComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const userId = req.user?._id;
  const { reelsId } = req.params;

  if (!isValidObjectId(reelsId)) {
    return res.status(400).json(new ApiResponse(400, {}, "Invalid id"));
  }

  if (!text) {
    return res.status(400).json(new ApiResponse(400, {}, "Text is required"));
  }

  const addComment = await ReelsComment.create({
    text,
    author: userId,
    post: reelsId,
  });

  const addCommentidInPost = await Reels.updateOne(
    { _id: reelsId },
    { $push: { comments: addComment._id } }
  );

  if (!addComment || !addCommentidInPost) {
    return res.status(500).json(new ApiResponse(500, {}, "Cant add comment"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, addComment, "Comment added successfully"));
});

const getCommentsOfReels = asyncHandler(async (req, res) => {
  const { reelsId } = req.params;

  if (!isValidObjectId(reelsId)) {
    return res.status(400).json(new ApiResponse(400, {}, "Invalid id"));
  }

  const getComment = await ReelsComment.find({ post: reelsId })
    .sort({ createdAt: -1 })
    .populate({ path: "author", select: "username profilePicture" });

  if (!getComment) {
    return res.status(404).json(new ApiResponse(404, {}, "Comments not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, getComment, "Comments fetched successfully"));
});

export { addReelsComment, getCommentsOfReels };
