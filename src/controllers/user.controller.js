import { asyncHandler } from "../utils/asyncHandler.js";

export const registerUser = asyncHandler(async (req, res) => {
  res.status(400).send({ message: "this is a regestering test" });
});
