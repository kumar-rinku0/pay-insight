import { configDotenv } from "dotenv";
configDotenv(); // Load from .env file

// const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });
// export const handleUploadImage = async (req, res, next) => {
//   if (!req.file) {
//     return res.status(400).send("No file uploaded");
//   }

//   const fileName = `${Date.now()}${path.extname(req.file.originalname)}`;

//   const uploadParams = {
//     Bucket: BUCKET_NAME,
//     Key: fileName,
//     Body: req.file.buffer, // buffer instead of buffer
//     ContentType: req.file.mimetype,
//   };

//   const upload = new Upload({
//     client: s3,
//     params: uploadParams,
//   });

//   const result = await upload.done();
//   console.log(result.Location);
//   // const fileUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
//   // http://attendence-management123.s3-website.ap-south-1.amazonaws.com
//   req.url = result.Location;
//   return next();
// };

import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;
cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});
export const handleUploadImage = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }
  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: "payinsight",
    transformation: {
      quality: "auto",
      format: "auto",
      crop: "thumb",
      gravity: "face",
      width: 400,
      height: 400,
    },
  });

  fs.unlinkSync(req.file.path); // Clean up local file

  req.url = result.secure_url;
  return next();
};
