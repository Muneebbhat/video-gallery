import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateAccessAndRefreshToken } from "../utils/tokens.js";
import jwt from "jsonwebtoken";
import { options } from "../constants.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }
  //console.log(req.files);

  const avatarLocalPath = req.files?.avatar[0]?.path;
  //const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  console.log(avatarLocalPath, avatarLocalPath);
  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

// login user
export const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  if (!email && !username) {
    throw new ApiError(400, "username or email is required");
  }
  const foundUser = await User.findOne({ $or: [{ username }, { email }] });
  if (!foundUser) {
    throw new ApiError(404, "user does not exist");
  }
  const isPasswordValid = await foundUser.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "invaled user credentials");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    foundUser._id
  );
  const logedInUser = await User.findById(foundUser._id).select(
    "-password -refreshToken"
  );
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: logedInUser, accessToken, refreshToken },
        "user logged in successfully"
      )
    );
});
// logout user
export const logoutUser = asyncHandler(async (req, res) => {
  const _id = req.user.id;
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    { $set: { refreshToken: undefined } },
    { new: true }
  );
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logedout successifully"));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingToken = req.cookies?.refreshToken || req.body?.refreshToken;
  if (!incomingToken) {
    throw new ApiError(401, "un authorize request");
  }
  const verifiedToken = jwt.verify(
    incomingToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  if (!verifiedToken) {
    throw new ApiError(401, "invalid refresh token");
  }
  const foundUser = await User.findById(verifiedToken?._id);
  if (!foundUser) {
    throw new ApiError(401, "invalid refresh token");
  }
  if (incomingToken !== foundUser.refreshToken) {
    throw new ApiError(401, "refresh token is expired or used");
  }

  const { accessToken, refreshToken } = generateAccessAndRefreshToken(
    foundUser._id
  );
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken },
        "access token refreshed"
      )
    );
});
