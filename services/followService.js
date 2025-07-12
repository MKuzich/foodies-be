import { User, Follow } from '../db/index.js';
import HttpError from '../helpers/httpError.js';

const buildPagination = (total, page, limit) => ({
  total,
  page,
  limit,
  pages: Math.ceil(total / limit),
});

export const findUserWithOptions = (where, options = {}) => {
  return User.findOne({
    where,
    ...options,
  });
};

export const getFollowing = async (userId, page = 1, limit = 5) => {
  const offset = (page - 1) * limit;

  const user = await User.findByPk(userId);
  if (!user) throw HttpError(404, 'User not found');

  const total = await user.countFollowing();

  const following = await user.getFollowing({
    attributes: ['id', 'name', 'email', 'avatarURL'],
    through: { attributes: [] },
    limit,
    offset,
  });

  return {
    results: following,
    pagination: buildPagination(total, page, limit),
  };
};
export const getFollowers = async (userId, page = 1, limit = 5) => {
  const offset = (page - 1) * limit;

  const user = await User.findByPk(userId);
  if (!user) throw HttpError(404, 'User not found');

  const total = await user.countFollowers();

  const followers = await user.getFollowers({
    attributes: ['id', 'name', 'email', 'avatarURL'],
    through: { attributes: [] },
    limit,
    offset,
  });

  return {
    results: followers,
    pagination: buildPagination(total, page, limit),
  };
};

export const followUser = async (followerId, followingId) => {
  if (followerId === followingId)
    throw HttpError(400, 'You can not follow yourself');

  const userToFollow = await User.findByPk(followingId);
  if (!userToFollow) throw HttpError(404, 'User not found');

  const [follow, created] = await Follow.findOrCreate({
    where: { followerId, followingId },
  });

  if (!created) throw HttpError(409, 'Already following this user');

  const followersCount = await userToFollow.countFollowers();
  const followingCount = await User.findByPk(followerId).then((user) =>
    user.countFollowing()
  );

  return {
    ...userToFollow.toPublicJSON(),
    followersCount,
    followingCount, 
    isFollowed: true, 
  };
};

export const unfollowUser = async (followerId, followingId) => {
  const userToUnfollow = await User.findByPk(followingId);
  if (!userToUnfollow) throw HttpError(404, 'User not found');

  const deleted = await Follow.destroy({
    where: { followerId, followingId },
  });

  if (!deleted) throw HttpError(404, 'Not following this user');

  const followersCount = await userToUnfollow.countFollowers();
  const followingCount = await User.findByPk(followerId).then((user) =>
    user.countFollowing()
  );

  return {
    ...userToUnfollow.toPublicJSON(),
    followersCount,
    followingCount,
    isFollowed: false,
  };
};
