import { Follow } from '../db/index.js';

export const followUser = async (followerId, followingId) => {
  return Follow.findOrCreate({
    where: { followerId, followingId },
  });
};

export const unfollowUser = async (followerId, followingId) => {
  return Follow.destroy({
    where: { followerId, followingId },
  });
};

export const getFollowingUsers = async (user, limit, offset) => {
  return user.getFollowing({
    attributes: ['id', 'name', 'email', 'avatarURL'],
    through: { attributes: [] },
    limit,
    offset,
  });
};

export const getFollowersOfUser = async (user, limit, offset) => {
  return user.getFollowers({
    attributes: ['id', 'name', 'email', 'avatarURL'],
    through: { attributes: [] },
    limit,
    offset,
  });
};
