import bcrypt from 'bcrypt';
import gravatar from 'gravatar';
import { nanoid } from 'nanoid';
import User from '../db/User.js';
import { createToken } from '../helpers/jwt.js';
import HttpError from '../helpers/httpError.js';
import sendEmail from '../helpers/sendEmail.js';

const { APP_DOMAIN } = process.env;

const createVerifyEmail = ({ email, verificationToken }) => ({
  to: email,
  subject: 'Verify email',
  html: `<a href="${APP_DOMAIN}/api/auth/verify/${verificationToken}" target="_blank">Click verify email</a>`,
});

export const findUser = (query) => {
  return User.findOne({
    where: query,
  });
};

export const registerUser = async (payload) => {
  const hashPassword = await bcrypt.hash(payload.password, 10);
  const verificationToken = nanoid();

  const user = await User.create({
    ...payload,
    password: hashPassword,
    verificationToken,
  });

  const verifyEmail = createVerifyEmail({
    email: payload.email,
    verificationToken,
  });

  await sendEmail(verifyEmail);

  return user.toPublicJSON();
};

export const loginUser = async ({ email, password }) => {
  const user = await findUser({ email });
  if (!user) throw HttpError(401, 'Email or password is wrong');

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) throw HttpError(401, 'Email or password is wrong');

  const payload = { id: user.id };

  const token = createToken(payload);

  user.token = token;
  await user.save();

  return {
    token,
    user: user.toPublicJSON(),
  };
};

export const logoutUser = async ({ id }) => {
  try {
    const user = await findUser({ id });
    if (!user) throw HttpError(401, 'User not found');
    user.token = '';
    await user.save();
  } catch (error) {
    throw HttpError(500, error.message);
  }
};

export const updateAvatar = async (id, avatar) => {
  try {
    const user = await findUser({ id });
    if (!user) throw HttpError(404, 'User not found');

    user.avatarURL = avatar;
    await user.save();
  } catch (error) {
    throw HttpError(500, error.message);
  }
};

export const verifyUser = async (verificationToken) => {
  try {
    const user = await findUser({ verificationToken });
    if (!user) throw HttpError(404, 'User not found');

    return user.update({ verify: true, verificationToken: null });
  } catch (error) {
    throw HttpError(500, error.message);
  }
};

export const resendVerifyUser = async (email) => {
  try {
    const user = await findUser({ email, verify: false });
    if (!user) throw HttpError(401, 'Email not found or already verified');

    const verifyEmail = createVerifyEmail({
      email,
      verificationToken: user.verificationToken,
    });

    await sendEmail(verifyEmail);
  } catch (error) {
    throw HttpError(500, error.message);
  }
};

export const getUserInfo = async (query) => {
  try {
    const user = await findUser(query);
    if (!user) {
      return null;
    }
    return user.toPublicJSON();
  } catch (error) {
    throw HttpError(500, error.message);
  }
};
