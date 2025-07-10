import * as followService from "../services/followService.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";

const getFollowersController = async (req, res) => {
  const { id } = req.params;
  const followers = await followService.getFollowers(id);
  res.json(followers);
};
const getFollowingController = async (req, res) => {
    const userId = req.user.id;
    const following = await followService.getFollowing(userId);
    res.json(following);
};

const followUserController = async (req, res) => {
  const followerId = req.user.id;
  const followingId = parseInt(req.params.id);

  await followService.followUser(followerId, followingId);
  res.status(201).json({ message: "Followed successfully" });
};
const unfollowUserController = async (req, res) => {
  const followerId = req.user.id;
  const followingId = parseInt(req.params.id);

  await followService.unfollowUser(followerId, followingId);
  res.json({ message: "Unfollowed successfully" });
};


export default {
  getFollowersController: ctrlWrapper(getFollowersController),
  getFollowingController: ctrlWrapper(getFollowingController),
  followUserController: ctrlWrapper(followUserController),
  unfollowUserController: ctrlWrapper(unfollowUserController),
};