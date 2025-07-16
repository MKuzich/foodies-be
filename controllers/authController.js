import * as userService from '../services/userService.js';
import ctrlWrapper from '../decorators/ctrlWrapper.js';
import HttpError from '../helpers/httpError.js';
import { AVATAR_FOLDER } from '../constants/files.js';
import {
  deleteImageFromCloudinary,
  fileUpload,
} from '../helpers/fileStorage.js';

const register = async (req, res) => {
  const user = await userService.registerUser(req.body);

  res.status(201).json(user);
};

const login = async (req, res) => {
  const { token, user } = await userService.loginUser(req.body);

  res.json({
    token,
    user: user,
  });
};

export const logout = async (req, res) => {
  await userService.logoutUser(req.user);

  res.status(204).json();
};

export const getCurrent = async (req, res) => {
  res.json(req.user.toPublicJSON());
};

export const updateAvatar = async (req, res) => {
  const { id, avatarURL } = req.user;

  if (!req.file) {
    throw HttpError(404, 'No file uploaded');
  }
  if (avatarURL !== null && avatarURL.includes('res.cloudinary.com')) {
    await deleteImageFromCloudinary(avatarURL);
  }
  const uploadedAvatarURL =
    (await fileUpload(req.file.path, AVATAR_FOLDER)) || null;

  await userService.updateAvatar(id, uploadedAvatarURL);

  res.json({ avatarURL: uploadedAvatarURL });
};

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  getCurrent: ctrlWrapper(getCurrent),
  updateAvatar: ctrlWrapper(updateAvatar),
};
