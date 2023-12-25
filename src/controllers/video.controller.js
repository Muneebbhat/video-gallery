import { Video } from "../models/video.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const sendVideos = asyncHandler(async (req, res) => {
  const { title, _id } = req.body;
  console.log(title, _id);
  const response = await Video.create({ title, owner: _id });
  res.status(200).json(response);
});
