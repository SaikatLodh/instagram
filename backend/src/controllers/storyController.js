import { Story } from "../models/storyModel.js";
import {
  deleteImageOnCloudinary,
  uploadOnCloudinary,
  deleteVideoOnCloudinary,
} from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandeller.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { isValidObjectId } from "mongoose";

const createStory = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const localContentFile = req?.file?.path;
  const userId = req?.user?._id;

  if (!isValidObjectId(userId)) {
    return res.status(500).json(new ApiResponse(400, {}, "Invalid id"));
  }

  if (!localContentFile) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Story content is required"));
  }

  const cloudinaryVideo = await uploadOnCloudinary(localContentFile);
  if (!cloudinaryVideo.public_id || !cloudinaryVideo.url) {
    return res
      .status(400)
      .json(new ApiResponse(500, {}, "Failed to upload story content"));
  }

  const story = await Story.create({
    title,
    story: {
      url: cloudinaryVideo?.url,
      public_id: cloudinaryVideo?.public_id,
    },
    author: userId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { story }, "Story created successfully"));
});

const getStories = asyncHandler(async (req, res) => {
  try {
    // Aggregation pipeline to group stories by author and format the output
    const groupedStories = await Story.aggregate([
      // Stage 1: Populate the author details from the 'users' collection
      {
        $lookup: {
          from: "users", // The collection name for your user model (Mongoose often pluralizes)
          localField: "author",
          foreignField: "_id",
          as: "authorDetails",
        },
      },
      // Stage 2: Deconstruct the authorDetails array
      {
        $unwind: "$authorDetails",
      },
      // Stage 3: Group stories by author to build the final structure
      {
        $group: {
          _id: "$authorDetails._id", // Group by the author's ID
          username: { $first: "$authorDetails.username" },
          userAvatar: { $first: "$authorDetails.profilePicture" }, // Assuming this is the field for the avatar
          contents: {
            $push: {
              // Push each story's content into an array for the author
              type: { $literal: "image" }, // Assuming all stories are images. Adjust if dynamic.
              url: "$story.url",
              duration: { $literal: 5000 }, // Hardcoded duration as it's not in your model
            },
          },
        },
      },
      // Stage 4: Project the final output to match the desired format
      {
        $project: {
          _id: 0, // Exclude the default _id field
          id: "$_id",
          userId: "$_id",
          username: "$username",
          userAvatar: "$userAvatar",
          contents: "$contents",
          seen: { $literal: false }, // Hardcoded 'seen' status
        },
      },
    ]);

    if (!groupedStories || groupedStories.length === 0) {
      return res.status(404).json(new ApiResponse(404, {}, "No stories found"));
    }

    // Return the formatted stories in a successful API response
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { stories: groupedStories },
          "Stories fetched successfully"
        )
      );
  } catch (error) {
    // Handle any potential errors during the aggregation
    console.error("Error fetching stories:", error);
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          {},
          "An error occurred while fetching stories. " + error.message
        )
      );
  }
});

const deleteStory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
  const videoExtensions = [".mp4", ".webm", ".mov", ".avi", ".mkv"];

  const findStory = await Story.findById(id);

  if (!findStory) {
    return res.status(404).json(new ApiResponse(404, {}, "Story not found"));
  }

  if (findStory.author.toString() !== req.user._id.toString()) {
    return res.status(403).json(new ApiResponse(403, {}, "Unauthorized"));
  }

  const url = findStory.story.url.toLowerCase();

  if (imageExtensions.some((ext) => url.endsWith(ext))) {
    await deleteImageOnCloudinary(findStory.story.public_id);

    const story = await Story.findByIdAndDelete(id);
    if (!story) {
      return res.status(404).json(new ApiResponse(404, {}, "Story not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Story deleted successfully"));
  } else if (videoExtensions.some((ext) => url.endsWith(ext))) {
    await deleteVideoOnCloudinary(findStory.story.public_id);

    const story = await Story.findByIdAndDelete(id);
    if (!story) {
      return res.status(404).json(new ApiResponse(404, {}, "Story not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Story deleted successfully"));
  }
});

export { createStory, getStories, deleteStory };
