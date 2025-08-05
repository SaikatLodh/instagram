import { asyncHandler } from "../utils/asyncHandeller.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/userModel.js";
import {
  deleteImageOnCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { ReelsComment } from "../models/ReelsCommentModel.js";
import { isValidObjectId } from "mongoose";
import { Reels } from "../models/ReelsModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

const addNewReels = asyncHandler(async (req, res) => {
  const { caption } = req.body;
  const localContantFile = req.file?.path;
  const userId = req.user?._id;

  if (!localContantFile) {
    return res.status(400).json(new ApiResponse(400, {}, "Image is required"));
  }

  const contant = await uploadOnCloudinary(localContantFile);

  if (!contant && (!contant?.url || !contant?.public_id)) {
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          {},
          "Image cant uploaded right now please try again"
        )
      );
  }

  const reels = await Reels.create({
    caption,
    contant: {
      url: contant?.url,
      public_id: contant?.public_id,
    },
    author: userId,
  });

  if (!isValidObjectId(userId)) {
    return res.status(400).json(new ApiResponse(400, {}, "Invalid id"));
  }

  await User.findByIdAndUpdate(userId, {
    $push: { reels: reels?._id },
  });

  await reels.populate({ path: "author", select: "-password -refreshToken" });

  return res
    .status(201)
    .json(new ApiResponse(201, reels, "Post created successfully"));
});

const getAllReels = asyncHandler(async (req, res) => {
  const getReels = await Reels.find()
    .sort({ createdAt: -1 })
    .populate({ path: "author", select: "-password -refreshToken" })
    .populate({
      path: "comments",
      sort: { createdAt: -1 },
      populate: { path: "author", select: "username profilePicture" },
    });

  if (!getReels) {
    throw new ApiError("Posts cant fetched");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, getReels, "Posts fetched successfully"));
});

const getUserReels = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  const getUserReels = await Reels.find({ author: userId })
    .sort({ createdAt: -1 })
    .populate({ path: "author", select: "username, profilePicture" })
    .populate({
      path: "comments",
      sort: { createdAt: -1 },
      populate: { path: "author", select: "username, profilePicture" },
    });

  if (!getUserReels) {
    return res
      .status(404)
      .json(new ApiResponse(404, {}, "User post not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, getUserReels, "User post fetched successfully"));
});

const getSingleReels = asyncHandler(async (req, res) => {
  const reelsId = req.params.reelsId;

  if (!isValidObjectId(reelsId)) {
    return res.status(400).json(new ApiResponse(400, {}, "Invalid id"));
  }

  const getReels = await Reels.findById(reelsId)
    .populate({ path: "author", select: "username profilePicture" })
    .populate({
      path: "comments",
      sort: { createdAt: -1 },
      populate: { path: "author", select: "username profilePicture" },
    });

  if (!getReels) {
    return res.status(404).json(new ApiResponse(404, {}, "Post not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, getReels, "Post fetched successfully"));
});

const editeReels = asyncHandler(async (req, res) => {
  const { reelsId } = req.params;
  const { caption } = req.body;

  const localContantFile = req.file?.path;

  if (!isValidObjectId(reelsId)) {
    return res.status(400).json(new ApiResponse(400, {}, "Invalid id"));
  }

  if (localContantFile) {
    if (!localContantFile) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Image is required"));
    }

    const getPublicid = await Reels.findById(reelsId);

    if (!getPublicid) {
      return res.status(404).json(new ApiResponse(404, {}, "Post not found"));
    }

    const getContentPublicid = getPublicid.contant?.public_id;

    if (getContentPublicid) {
      await deleteImageOnCloudinary(getContentPublicid);
    }

    const uploadContent = await uploadOnCloudinary(localContantFile);

    if (!uploadContent) {
      return res
        .status(500)
        .json(
          new ApiResponse(500, {}, "Content cant uploded please try again")
        );
    }

    const updateReels = await Reels.findByIdAndUpdate(
      reelsId,
      {
        $set: {
          contant: {
            url: uploadContent?.url,
            public_id: uploadContent?.public_id,
          },
        },
      },
      { new: true }
    );

    if (!updateReels) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "Post cant updated"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, updateReels, "Post updated successfully"));
  } else {
    const updateReels = await Reels.findByIdAndUpdate(
      reelsId,
      {
        $set: {
          caption,
        },
      },
      { new: true }
    );

    if (!updateReels) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "Post cant updated"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, updateReels, "Post updated successfully"));
  }
});

const likeUnlikeReels = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { reelsId } = req.params;

  if (!isValidObjectId(reelsId)) {
    return res.status(400).json(new ApiResponse(400, {}, "Invalid id"));
  }

  const reels = await Reels.findById(reelsId);

  if (!reels) {
    return res.status(404).json(new ApiResponse(404, {}, "Reels not found"));
  }

  const cheackLike = reels.likes.includes(userId);

  const user = await User.findById(userId).select("username profilePicture");
  const ReelsOwnerId = reels.author.toString();

  if (cheackLike) {
    await reels.updateOne({ $pull: { likes: userId } });
    await reels.save();

    if (ReelsOwnerId !== userId) {
      const notification = {
        type: "dislike",
        userId: userId,
        userDetails: user,
        reelsId,
        message: "Your Reels was disliked",
      };

      const ReelsOwnerSocketId = getReceiverSocketId(ReelsOwnerId);
      io.to(ReelsOwnerSocketId).emit("notification", notification);
    }

    return res.status(201).json(new ApiResponse(201, {}, "Uniked"));
  } else {
    await reels.updateOne({ $addToSet: { likes: userId } });
    await reels.save();

    if (ReelsOwnerId !== userId) {
      const notification = {
        type: "like",
        userId: userId,
        userDetails: user,
        reelsId,
        message: "Your Reels was liked",
      };

      const ReelsOwnerSocketId = getReceiverSocketId(ReelsOwnerId);
      io.to(ReelsOwnerSocketId).emit("notification", notification);
    }
    return res.status(201).json(new ApiResponse(201, {}, "Liked"));
  }
});

const deleteReels = asyncHandler(async (req, res) => {
  const { reelsId } = req.params;
  const userId = req.user?._id;

  if (!isValidObjectId(reelsId)) {
    return res.status(400).json(new ApiResponse(400, {}, "Invalid id"));
  }

  const post = await Reels.findById(reelsId);

  if (!post) {
    return res.status(404).json(new ApiResponse(404, {}, "Post not found"));
  }

  if (post.author.toString() !== userId.toString()) {
    return res
      .status(401)
      .json(new ApiResponse(401, {}, "You are not owner of this post"));
  }

  const deleteCloudPublic_id = post.contant?.public_id;

  await deleteImageOnCloudinary(deleteCloudPublic_id);
  await User.updateOne(
    { reels: reelsId },
    {
      $pull: { reels: reelsId },
    }
  );

  await ReelsComment.deleteMany({ post: reelsId });
  await Reels.findByIdAndDelete(reelsId);

  return res

    .status(200)
    .json(new ApiResponse(200, {}, "Post deleted successfully"));
});

const bookmarkReels = asyncHandler(async (req, res) => {
  const { reelsId } = req.params;
  const userId = req.user?._id;

  if (!isValidObjectId(reelsId)) {
    return res.status(400).json(new ApiResponse(400, {}, "Invalid id"));
  }

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json(new ApiResponse(404, {}, "Cant add right now"));
  }

  const cheackBookmark = user.reelsBookmarks.includes(reelsId);

  if (cheackBookmark) {
    await user.updateOne({ $pull: { reelsBookmarks: reelsId } });

    return res.status(200).json(new ApiResponse(200, {}, "Removed bookmark"));
  } else {
    await user.updateOne({ $addToSet: { reelsBookmarks: reelsId } });

    return res.status(200).json(new ApiResponse(200, {}, "Addedbookmark"));
  }
});

export {
  addNewReels,
  getAllReels,
  getUserReels,
  getSingleReels,
  editeReels,
  likeUnlikeReels,
  deleteReels,
  bookmarkReels,
};
