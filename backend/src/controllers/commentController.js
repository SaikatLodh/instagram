import { asyncHandler } from "../utils/asyncHandeller.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Comment } from "../models/commentModel.js";
import { isValidObjectId } from "mongoose";
import { Post } from "../models/postModel.js";

const addComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const userId = req.user?._id;
  const { postId } = req.params;

  if (!isValidObjectId(postId)) {
    return res.status(400).json(new ApiResponse(400, {}, "Invalid id"));
  }

  if (!text) {
    return res.status(400).json(new ApiResponse(400, {}, "Text is required"));
  }

  const addComment = await Comment.create({
    text,
    author: userId,
    post: postId,
  });

  const addCommentidInPost = await Post.updateOne(
    { _id: postId },
    { $push: { comments: addComment._id } }
  );

  if (!addComment || !addCommentidInPost) {
    return res.status(500).json(new ApiResponse(500, {}, "Cant add comment"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, addComment, "Comment added successfully"));
});

const getCommentsOfPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!isValidObjectId(postId)) {
    return res.status(400).json(new ApiResponse(400, {}, "Invalid id"));
  }

  const getComment = await Comment.find({ post: postId })
    .sort({ createdAt: -1 })
    .populate({ path: "author", select: "username profilePicture" });

  if (!getComment) {
    return res.status(404).json(new ApiResponse(404, {}, "Comments not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, getComment, "Comments fetched successfully"));
});

export { addComment, getCommentsOfPost };
