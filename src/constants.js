import { User } from "./models/user.model";
import { ApiError } from "./utils/apiError";

export const DB_NAME = "videoGallery";

export const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById({ _id: userId });
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "somehing went wrong while generating refresh and access token"
    );
  }
};
