import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: "dvkyxnqpc",
  api_key: "496347875634526",
  api_secret: "MlF4KR21TXT_dAfwQhacN1_E6o4",
});

const uploadOnCloudinary = async (localFilePath) => {
  if (!localFilePath) return null;

  try {
    const respon = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    fs.unlinkSync(localFilePath);
    return respon;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
};

const deleteVideoOnCloudinary = async (localFilePath) => {
  if (!localFilePath) return null;

  try {
    const response = await cloudinary.uploader.destroy(localFilePath, {
      resource_type: "video",
    });

    return response;
  } catch (error) {
    console.log(error.message);
    return null;
  }
};

const deleteImageOnCloudinary = async (localFilePath) => {
  if (!localFilePath) return null;

  try {
    const response = await cloudinary.uploader.destroy(localFilePath, {
      resource_type: "image",
    });

    return null;
  } catch (error) {
    console.log(error.message);
    return null;
  }
};

export { uploadOnCloudinary, deleteVideoOnCloudinary, deleteImageOnCloudinary };
