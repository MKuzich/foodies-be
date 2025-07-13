import { unlink } from 'fs/promises';
import cloudinary from './cloudinary.js';
import HttpError from './httpError.js';

export const fileUpload = async (filePath, folder) => {
  try {
    const { url } = await cloudinary.uploader.upload(filePath, {
      folder,
      use_filename: true,
    });
    await unlink(filePath);
    return url;
  } catch (error) {
    await unlink(filePath);
    throw HttpError(500, error.message);
  }
};

export const deleteImageFromCloudinary = async (imageUrl) => {
  try {
    const publicId = imageUrl
      .split('/')
      .slice(-2)
      .join('/')
      .replace(/\.[^/.]+$/, '');

    await cloudinary.uploader.destroy(publicId);
    console.log('Image deleted from Cloudinary:', publicId);
  } catch (error) {
    console.warn('Cloudinary delete failed:', error.message);
  }
};
