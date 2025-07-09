import Follow from "../db/Follow.js";
import HttpError from "../helpers/httpError.js";


export const findUserWithOptions = (where, options = {}) => {
  return User.findOne({
    where,
    ...options,
  });
};
export const getFollowers = async (userId) => {
  const userWithFollowers = await findUserWithOptions({
    where: { id: userId },
    include: {
      model: Follow,
      as: "followers",
      attributes: ["id", "name", "email", "avatarURL"],
    },
  });

  if (!userWithFollowers) throw HttpError(404, "User not found");

  return userWithFollowers.Followers || [];
};

export const getFollowing = async (userId) => {
  const userWithFollowing = await findUserWithOptions({
    where: { id: userId },
    include: {
      model: Follow,
      as: "following",
      attributes: ["id", "name", "email", "avatarURL"],
    },
  });

  if (!userWithFollowing) throw HttpError(404, "User not found");

  return userWithFollowing.Following || [];
};

export const followUser = async (followerId, followingId) => {
  if (followerId === followingId)
    throw HttpError(400, "You can't follow yourself");

  const userToFollow = await findUserWithOptions({ id: followingId });
  if (!userToFollow) throw HttpError(404, "User not found");

  const following = await Follow.findOne({
    where: { followerId, followingId },
  });
  if (following) throw HttpError(409, "Already following this user");

  await Follow.create({ followerId, followingId });
  return { success: true };
};

export const unfollowUser = async (followerId, followingId) => {
  const unfollow = await Follow.destroy({ where: { followerId, followingId } });
  if (!unfollow) throw HttpError(404, "Not following this user");

  return { success: true };
};
