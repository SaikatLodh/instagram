import { asyncHandler } from "../utils/asyncHandeller.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/userModel.js";
import { Otp } from "../models/otpModel.js";
import {
  deleteImageOnCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import crypto from "crypto";
import { isValidObjectId } from "mongoose";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";

// RqoUSvyRcCOjCRDS

const generateAccessAndRefereshTokens = async (id) => {
  try {
    const user = await User.findById(id);
    // console.log(user)
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, "Something went wrong try again"));
  }
};

const otpsend = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json(new ApiResponse(400, {}, "Email is required"));
  }

  const userExist = await Otp.findOne({ email });

  if (userExist) {
    await Otp.findOneAndDelete({ email });
  }

  const otp = Math.floor(1000 + Math.random() * 9000);

  const user = await Otp.create({
    email: email,
    otp: otp,
    otpExpire: new Date(Date.now() + 2 * 60 * 1000),
  });

  if (!user) {
    return res
      .status(500)
      .json(new ApiResponse(500, "Something went wrong try again"));
  }

  const mailOption = {
    email: user.email,
    subject: "OTP for email verification",
    message: `<h3>OTP for email verification is ${otp}</h3>`,
  };

  try {
    await sendEmail(mailOption);
    user.isotpsend = true;
    await user.save({ validateBeforeSave: false });
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Otp send successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Something went wrong try again"));
  }
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "All fields are required"));
  }

  const user = await Otp.findOne({ email });

  if (!user.isotpsend) {
    return res.status(404).json(new ApiResponse(404, {}, "Otp not send"));
  }

  if (user.otp !== otp) {
    return res.status(400).json(new ApiResponse(400, {}, "Invalid otp"));
  }

  if (user.otpExpire < Date.now()) {
    return res.status(400).json(new ApiResponse(400, {}, "Otp expired"));
  }

  user.isotpsend = false;
  user.otpVerified = true;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Email verified successfully"));
});

const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "All fields are required"));
  }

  const checkOtpverified = await Otp.findOne({ email });

  if (!checkOtpverified) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Enter the verification email"));
  }

  if (!checkOtpverified.otpVerified) {
    return res.status(400).json(new ApiResponse(400, {}, "Email not verified"));
  }

  await Otp.findOneAndDelete({ email });

  const cheackUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (cheackUser) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "User with this username already exist"));
  }

  const createuser = await User.create({
    username,
    email,
    password,
    isverified: true,
  });

  const user = await User.findById(createuser._id);

  if (!user) {
    return res
      .status(500)
      .json(
        new ApiResponse(500, {}, "User cant created some thing went wrong")
      );
  }

  return res
    .status(201)
    .json(new ApiResponse(201, {}, "User register successfully"));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "All fields are required"));
  }

  const cheackUser = await User.findOne({
    email,
  });

  if (!cheackUser) {
    return res
      .status(404)
      .json(new ApiResponse(404, {}, "User with this email does not exist"));
  }

  if (cheackUser.isverified === false) {
    return res.status(401).json(new ApiResponse(401, {}, "Email not verified"));
  }

  const cheackpassword = await cheackUser.isPasswordCorrect(password);

  if (!cheackpassword) {
    return res.status(400).json(new ApiResponse(400, {}, "Invalid password"));
  }

  const user = await User.findById(cheackUser._id).select(
    "-password -refreshToken"
  );

  if (!user) {
    return res.status(404).json(new ApiResponse(404, {}, "User not found"));
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  const options = {
    expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: user, token: accessToken },
        "User login successfully"
      )
    );
});

const logout = asyncHandler(async (req, res) => {
  const user = req.user?._id;

  if (!isValidObjectId(user)) {
    return res.status(400).json(new ApiResponse(400, {}, "Invalid id"));
  }

  const logoutUser = await User.findByIdAndUpdate(user, {
    $unset: {
      refreshToken: 1,
    },
  });

  if (!logoutUser) {
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "You cant not logout"));
  }

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    expires: new Date(0),
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logout successfully"));
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json(new ApiResponse(400, {}, "Email is required"));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json(new ApiResponse(404, {}, "User not found"));
  }

  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${process.env.PASSWORD_URL || process.env.SECONS_PASSWORD_URL}/forgotresetpassword/${resetToken}`;

  const message = `Your Reset Password Token is:- \n\n ${resetPasswordUrl}  \n\n If
     You've not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Personal Portfolio Dashboard Password Recovery`,
      message,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, {}, `Email sent to ${user.email} successfully`)
      );
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    throw new ApiError(500, error.message);
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { password, confirmPassword } = req.body;

  if (!id) {
    return res.status(400).json(new ApiResponse(400, {}, "Id is required"));
  }

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(id)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: {
      $gt: Date.now(),
    },
  }).select("-password -refreshToken");

  if (!user) {
    return res.status(404).json(new ApiResponse(404, {}, "User not found"));
  }

  if (!password || !confirmPassword) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "All fields are required"));
  }

  if (password !== confirmPassword) {
    return res.status(400).json(new ApiResponse(400, {}, "Password not match"));
  }

  user.password = confirmPassword;
  user.resetPasswordToken = null;
  user.resetPasswordExpire = null;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Reset Password Successfully!"));
});

const getProfile = asyncHandler(async (req, res) => {
  const user = req.user._id;

  if (!isValidObjectId(user)) {
    return res.status(400).json(new ApiResponse(400, {}, "Invalid id"));
  }

  const getUser = await User.findOne(user)
    .select("-password -refreshToken")
    .populate({ path: "posts" })
    .populate({ path: "bookmarks" })
    .populate({ path: "reelsBookmarks" })
    .populate({ path: "reels" });

  if (!getUser) {
    return res.status(404).json(new ApiResponse(404, {}, "User not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, getUser, "User fetched successfully"));
});

const getotheruser = asyncHandler(async (req, res) => {
  const { otheruserId } = req.params;

  if (!isValidObjectId(otheruserId)) {
    return res.status(400).json(new ApiResponse(400, {}, "Invalid id"));
  }

  const getUser = await User.findById(otheruserId)
    .select(
      "-password -email -refreshToken -bookmarks -resetPasswordToken -resetPasswordExpire -isverified"
    )
    .populate({ path: "posts reels" });

  if (!getUser) {
    return res.status(404).json(new ApiResponse(404, {}, "User not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, getUser, "User fetched successfully"));
});

const editProfile = asyncHandler(async (req, res) => {
  const { bio, gender } = req.body;
  const localimagepath = req.file?.path;
  const id = req.user._id;

  if (!isValidObjectId(id)) {
    return res.status(400).json(new ApiResponse(400, {}, "Invalid id"));
  }

  const userid = await User.findById(id);

  const publicId = userid.profilePicture?.public_id;

  if (publicId) {
    await deleteImageOnCloudinary(publicId);
  }

  if (localimagepath) {
    const uploadImage = await uploadOnCloudinary(localimagepath);

    const updateProfile = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          profilePicture: {
            public_id:
              uploadImage?.public_id || userid?.profilePicture?.public_id,
            url: uploadImage?.url || userid?.profilePicture?.url,
          },
        },
      },
      { new: true }
    ).select("-password -refreshToken");

    if (!updateProfile) {
      return res.status(404).json(new ApiResponse(404, {}, "User not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, updateProfile, "User profile updated"));
  } else {
    const updateProfile = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          bio,
          gender,
        },
      },
      { new: true }
    ).select("-password -refreshToken");

    if (!updateProfile) {
      return res.status(404).json(new ApiResponse(404, {}, "User not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, updateProfile, "User profile updated"));
  }
});

const updatePassword = asyncHandler(async (req, res) => {
  const { currentpassword, newpassword, confirmpassword } = req.body;
  const id = req.user?._id;

  if (!isValidObjectId(id)) {
    return res.status(400).json(new ApiResponse(400, {}, "Invalid id"));
  }

  if (!currentpassword || !newpassword || !confirmpassword) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "All fields are require"));
  }

  if (newpassword !== confirmpassword) {
    return res.status(400).json(new ApiResponse(400, {}, "Password not match"));
  }

  const user = await User.findById(id);

  const cheackPassword = await user.isPasswordCorrect(currentpassword);

  if (!cheackPassword) {
    return res.status(400).json(new ApiResponse(400, {}, "Invalid password"));
  }

  user.password = confirmpassword;

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password updated successfully"));
});

const followOrUnfollow = asyncHandler(async (req, res) => {
  const follower = req.user?._id;
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json(new ApiResponse(400, {}, "Invalid id"));
  }

  if (follower == id) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "You cant follow your self"));
  }

  const getfollowerId = await User.findById(follower);
  const getfollowingId = await User.findById(id);

  if (!getfollowerId || !getfollowingId) {
    return res.status(404).json(new ApiResponse(404, {}, "User not found"));
  }

  const cheackfollowing = getfollowerId.following.includes(id);

  if (cheackfollowing) {
    await Promise.all([
      User.updateOne({ _id: follower }, { $pull: { following: id } }),
      User.updateOne({ _id: id }, { $pull: { followers: follower } }),
    ]);

    return res
      .status(201)
      .json(new ApiResponse(200, {}, "Unfollow successfully"));
  } else {
    await Promise.all([
      User.updateOne({ _id: follower }, { $push: { following: id } }),
      User.updateOne({ _id: id }, { $push: { followers: follower } }),
    ]);

    return res
      .status(201)
      .json(new ApiResponse(200, {}, "Follow successfully"));
  }
});

const getSuggestedUsers = asyncHandler(async (req, res) => {
  // const suggestedUsers = await User.find({ _id: { $ne: req.user?._id } },{ following: { $ne: req.user?._id } },{ followers: { $ne: req.user?._id } }).select("-password -refreshToken")
  const suggestedUsers = await User.find({
    _id: { $ne: req.user?._id },
    following: { $ne: req.user?._id },
    followers: { $ne: req.user?._id },
  }).select(
    "-password -refreshToken -resetPasswordToken -resetPasswordExpire -isverified -bio -followers -following -posts -bookmarks"
  );

  if (!suggestedUsers) {
    return res.status(404).json(new ApiResponse(404, {}, "User not found"));
  }

  return res
    .status(201)
    .json(
      new ApiResponse(200, suggestedUsers, "Suggestuser fetched successfully")
    );
});

const getChatUser = asyncHandler(async (req, res) => {
  const userId = req.user?._id; // get the user id from the token

  if (!isValidObjectId(userId)) {
    return res.status(400).json(new ApiResponse(400, {}, "Invalid id"));
  }

  const chatUsers = await User.find({ _id: { $ne: userId } })
    .select("followers following")
    .populate({ path: "followers", select: "username profilePicture bio" })
    .populate({ path: "following", select: "username profilePicture bio" });

  if (!chatUsers) {
    return res.status(404).json(new ApiResponse(404, {}, "User not found"));
  }

  return res
    .status(201)
    .json(new ApiResponse(200, chatUsers, "Chatuser fetched successfully"));
});

const checkUserLogin = asyncHandler(async (req, res) => {
  const incomingaccesstoken =
    req.cookies?.accesstoken ||
    req.body?.accesstoken ||
    req.header("Authorization")?.replace("Bearer ", "") ||
    req.headers["x-access-token"];

  try {
    if (!incomingaccesstoken) {
      return res
        .status(401)
        .json(new ApiResponse(401, {}, "Currently user not login"));
    }

    const decodedtoken = jwt.verify(
      incomingaccesstoken,
      process.env.ACCESS_TOKEN_SECRET
    );

    if (!decodedtoken) {
      return res
        .status(401)
        .json(new ApiResponse(401, {}, "Currently user not login"));
    } else {
      return res
        .status(200)
        .json(new ApiResponse(200, {}, "Currently user login"));
    }
  } catch (error) {
    return res
      .status(401)
      .json(
        new ApiResponse(
          401,
          {},
          `${error?.message} ` || "Invalid refresh token"
        )
      );
  }
});

export {
  otpsend,
  verifyOtp,
  register,
  login,
  logout,
  getProfile,
  getotheruser,
  editProfile,
  updatePassword,
  forgotPassword,
  resetPassword,
  followOrUnfollow,
  getSuggestedUsers,
  getChatUser,
  checkUserLogin,
};
