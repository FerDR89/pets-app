// const cloudinary = require('cloudinary').v2;
import { v2 as cloudinary } from "cloudinary";
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryOptions = {
  resource_type: "image",
  discard_original_filename: true,
  width: 330,
  height: 150,
};

export { cloudinary, cloudinaryOptions };
