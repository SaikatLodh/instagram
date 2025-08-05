import { asyncHandler } from "../utils/asyncHandeller.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";

const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "") ||
      req.headers["x-access-token"];

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const tokenVerify = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(tokenVerify?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(404, "user not found");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

export { verifyJWT };
