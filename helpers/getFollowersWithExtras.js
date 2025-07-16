import { getPagination } from './pagination.js';
import * as userService from '../services/userService.js';
import * as followService from '../services/followService.js';
import { mapUserWithExtras } from './mapUserWithExtras.js';

export const getFollowersWithExtras = async ({
  targetUserId,
  authUserId,
  page = 1,
  limit = 5,
}) => {
  const user = await userService.findUserById(targetUserId);
  const total = await userService.countFollowers(user);
  const followers = await followService.getFollowersOfUser(
    user,
    limit,
    (page - 1) * limit
  );

  const results = await Promise.all(
    followers.map(async (follower) => {
      const isFollowing = await userService.checkIfFollowed(
        authUserId,
        follower.id
      );
      const extras = await mapUserWithExtras(follower);
      return {
        ...extras,
        isFollowing,
      };
    })
  );

  return {
    results,
    pagination: getPagination(total, page, limit),
  };
};
