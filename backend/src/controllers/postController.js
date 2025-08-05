import { asyncHandler } from "../utils/asyncHandeller.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/userModel.js";
import {
  deleteImageOnCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { Comment } from "../models/commentModel.js";
import { isValidObjectId } from "mongoose";
import { Post } from "../models/postModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import { LikeNotification } from "../models/likenotification.js";

const addNewPost = asyncHandler(async (req, res) => {
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

  const post = await Post.create({
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
    $push: { posts: post?._id },
  });

  await post.populate({ path: "author", select: "-password -refreshToken" });

  return res
    .status(201)
    .json(new ApiResponse(201, post, "Post created successfully"));
});

const getAllPost = asyncHandler(async (req, res) => {
  const getPosts = await Post.find()
    .sort({ createdAt: -1 })
    .populate({ path: "author", select: "-password -refreshToken" })
    .populate({
      path: "comments",
      sort: { createdAt: -1 },
      populate: { path: "author", select: "username profilePicture" },
    });

  if (!getPosts) {
    throw new ApiError("Posts cant fetched");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, getPosts, "Posts fetched successfully"));
});

const getUserPost = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  const getUserPost = await Post.find({ author: userId })
    .sort({ createdAt: -1 })
    .populate({ path: "author", select: "username, profilePicture" })
    .populate({
      path: "comments",
      sort: { createdAt: -1 },
      populate: { path: "author", select: "username, profilePicture" },
    });

  if (!getUserPost) {
    return res
      .status(404)
      .json(new ApiResponse(404, {}, "User post not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, getUserPost, "User post fetched successfully"));
});

const getSinglePost = asyncHandler(async (req, res) => {
  const postId = req.params.postId;

  if (!isValidObjectId(postId)) {
    return res.status(400).json(new ApiResponse(400, {}, "Invalid id"));
  }

  const getPost = await Post.findById(postId)
    .populate({ path: "author", select: "username profilePicture" })
    .populate({
      path: "comments",
      sort: { createdAt: -1 },
      populate: { path: "author", select: "username profilePicture" },
    });

  if (!getPost) {
    return res.status(404).json(new ApiResponse(404, {}, "Post not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, getPost, "Post fetched successfully"));
});

const editePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { caption } = req.body;

  const localContantFile = req.file?.path;

  if (!isValidObjectId(postId)) {
    return res.status(400).json(new ApiResponse(400, {}, "Invalid id"));
  }

  if (localContantFile) {
    if (!localContantFile) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Image is required"));
    }

    const getPublicid = await Post.findById(postId);

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

    const updatePost = await Post.findByIdAndUpdate(
      postId,
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

    if (!updatePost) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "Post cant updated"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, updatePost, "Post updated successfully"));
  } else {
    const updatePost = await Post.findByIdAndUpdate(
      postId,
      {
        $set: {
          caption,
        },
      },
      { new: true }
    );

    if (!updatePost) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "Post cant updated"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, updatePost, "Post updated successfully"));
  }
});

const likeUnlikePost = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { postId } = req.params;

  if (!isValidObjectId(postId)) {
    return res.status(400).json(new ApiResponse(400, {}, "Invalid id"));
  }
  const getNotification = await LikeNotification.findOne({
    postId: postId,
    userId: userId,
  });
  if (!getNotification) {
    await LikeNotification.create({
      postId: postId,
      userId: userId,
      type: "",
    });
  }
  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json(new ApiResponse(404, {}, "Post not found"));
  }

  const cheackLike = post.likes.includes(userId);

  const user = await User.findById(userId).select("username profilePicture");
  const postOwnerId = post.author.toString();

  if (cheackLike) {
    await post.updateOne({ $pull: { likes: userId } });
    await post.save();
    const likeNotification = await LikeNotification.findOneAndUpdate(
      {
        postId: postId,
        userId: userId,
      },
      {
        $set: {
          type: "dislike",
          postId: postId,
          userId: userId,
        },
      },
      {
        new: true,
      }
    );

    if (likeNotification) {
      if (postOwnerId !== userId) {
        const notification = {
          _id: likeNotification._id,
          type: likeNotification.type,
          userId: likeNotification.userId,
          userDetails: user,
          postId: likeNotification.postId,
          post: post,
          message: "Your post was Disliked",
        };

        const postOwnerSocketId = getReceiverSocketId(postOwnerId);
        io.to(postOwnerSocketId).emit("notification", notification);
      }

      return res.status(201).json(new ApiResponse(201, {}, "Disliked"));
    }
  } else {
    await post.updateOne({ $addToSet: { likes: userId } });
    await post.save();
    const likeNotification = await LikeNotification.findOneAndUpdate(
      {
        postId: postId,
        userId: userId,
      },
      {
        $set: {
          type: "like",
          postId: postId,
          userId: userId,
        },
      },
      {
        new: true,
      }
    );

    if (likeNotification) {
      if (postOwnerId !== userId) {
        const notification = {
          _id: likeNotification._id,
          type: likeNotification.type,
          userId: likeNotification.userId,
          userDetails: user,
          post: post,
          postId: likeNotification.postId,
          message: "Your post was liked",
        };

        const postOwnerSocketId = getReceiverSocketId(postOwnerId);
        io.to(postOwnerSocketId).emit("notification", notification);
        return res.status(201).json(new ApiResponse(201, {}, "Liked"));
      }
    }
  }
});

const deletePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const userId = req.user?._id;

  if (!isValidObjectId(postId)) {
    return res.status(400).json(new ApiResponse(400, {}, "Invalid id"));
  }

  const post = await Post.findById(postId);

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
    { posts: postId },
    {
      $pull: { posts: postId },
    }
  );

  await Comment.deleteMany({ post: postId });
  await Post.findByIdAndDelete(postId);

  return res

    .status(200)
    .json(new ApiResponse(200, {}, "Post deleted successfully"));
});

const bookmarkPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const userId = req.user?._id;

  if (!isValidObjectId(postId)) {
    return res.status(400).json(new ApiResponse(400, {}, "Invalid id"));
  }

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json(new ApiResponse(404, {}, "Cant add right now"));
  }

  const cheackBookmark = user.bookmarks.includes(postId);

  if (cheackBookmark) {
    await user.updateOne({ $pull: { bookmarks: postId } });

    return res.status(200).json(new ApiResponse(200, {}, "Removed bookmark"));
  } else {
    await user.updateOne({ $addToSet: { bookmarks: postId } });

    return res.status(200).json(new ApiResponse(200, {}, "Addedbookmark"));
  }
});

export {
  addNewPost,
  getAllPost,
  getUserPost,
  getSinglePost,
  editePost,
  likeUnlikePost,
  deletePost,
  bookmarkPost,
};
