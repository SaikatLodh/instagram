import { asyncHandler } from "../utils/asyncHandeller.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/userModel.js";

const searchUser = asyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json(new ApiResponse(400, {}, "Query is required"));
  }

  const searchUser = await User.find({
    $or: [
      { username: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } },
    ],
  }).select(
    "-password -refreshToken -resetPasswordToken -resetPasswordExpire -isverified -bio -posts -bookmarks"
  );

  if (!searchUser) {
    return res.status(404).json(new ApiResponse(404, {}, "User not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, searchUser, "User fetched successfully"));
});

export { searchUser };
