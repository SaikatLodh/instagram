import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import crypto, { createHash } from "crypto";

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
      index: true,
      minLength: [3, "Username must be at least 3 characters."],
      maxLength: [32, "Username cannot exceed 32 characters."],
      required: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      index: true,
      validator: [validator.isEmail, "Please provide valid email."],
      required: true,
    },
    password: {
      type: String,
      minLength: [3, "Password must cantain at least 3 chatacters."],
      maxLength: [64, "Password cannot exceed 64 characters."],
      required: true,
    },
    profilePicture: {
      public_id: {
        type: String,
        default: "",
      },
      url: {
        type: String,
        default: "",
      },
    },
    bio: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "post",
      },
    ],
    reels: [
      {
        type: Schema.Types.ObjectId,
        ref: "reels",
      },
    ],
    bookmarks: [
      {
        type: Schema.Types.ObjectId,
        ref: "post",
      },
    ],
    reelsBookmarks: [
      {
        type: Schema.Types.ObjectId,
        ref: "reels",
      },
    ],
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpire: {
      type: Date,
      default: null,
    },
    isverified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
  },

  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);

  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id },

    process.env.ACCESS_TOKEN_SECRET,

    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },

    process.env.REFRESH_TOKEN_SECRET,

    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

//Generating Reset Password Token
userSchema.methods.getResetPasswordToken = function () {
  const resettoken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resettoken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resettoken;
};

export const User = mongoose.model("user", userSchema);
