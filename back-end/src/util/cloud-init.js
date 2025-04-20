import { S3Client } from "@aws-sdk/client-s3";
import path from "path";
import { configDotenv } from "dotenv";
import { Upload } from "@aws-sdk/lib-storage";

configDotenv(); // Load from .env file

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
export const handleUploadImage = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  const fileName = `${Date.now()}${path.extname(req.file.originalname)}`;

  const uploadParams = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: req.file.buffer, // buffer instead of buffer
    ContentType: req.file.mimetype,
  };

  const upload = new Upload({
    client: s3,
    params: uploadParams,
  });

  const result = await upload.done();
  console.log(result.Location);
  // const fileUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
  // http://attendence-management123.s3-website.ap-south-1.amazonaws.com
  req.url = result.Location;
  return next();
};
