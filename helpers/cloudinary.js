import { v2 as cloudinary } from 'cloudinary';

const { CLOUDIDNARY_CLOUD_NAME, CLOUDIDNARY_API_KEY, CLOUDIDNARY_API_SECRET } =
  process.env;

cloudinary.config({
  cloud_name: CLOUDIDNARY_CLOUD_NAME,
  api_key: CLOUDIDNARY_API_KEY,
  api_secret: CLOUDIDNARY_API_SECRET,
});

export default cloudinary;
