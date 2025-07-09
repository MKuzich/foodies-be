import express from "express";

import authenticate from "../middlewares/authenticate.js";
import validateId from "../middlewares/validateId.js";
import followControllers from "../controllers/followController.js";

const followRouter = express.Router();

followRouter.get(
  "/:id/following",
  authenticate,
  validateId,
  followControllers.getFollowingController
);

followRouter.get(
  "/:id/followers",
  authenticate,
  validateId,
  followControllers.getFollowersController
);

followRouter.post(
  "/:id/follow",
  authenticate,
  validateId,
  followControllers.followUserController
);

followRouter.delete(
  "/:id/unfollow",
  authenticate,
  validateId,
  followControllers.unfollowUserController
);

export default followRouter;
