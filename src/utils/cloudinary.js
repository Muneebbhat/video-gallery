import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return "could not find local file";
    // upload file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    //file has been upload successfully
    console.log(`file uploaded successfully on cloudinary`, response.url);
    return response;
  } catch (error) {
    //remove the locally uploaded file if failed
    fs.unlinkSync(localFilePath);
  }
};

export { uploadOnCloudinary };
