import express from 'express';

import userController from "../controllers/userController.js";
import followControllers from "../controllers/followController.js";

import authenticate from "../middlewares/authenticate.js";
import validateId from "../middlewares/validateId.js";

const userRouter = express.Router();

userRouter.get(
    "/following", authenticate,
    followControllers.getFollowingController
);

userRouter.get(
    "/:id/followers",
    authenticate,
    validateId,
    followControllers.getFollowersController
);

userRouter.post(
    "/:id/follow",
    authenticate,
    validateId,
    followControllers.followUserController
);

userRouter.delete(
    "/:id/unfollow",
    authenticate,
    validateId,
    followControllers.unfollowUserController
);

userRouter.get("/:id", authenticate, validateId, userController.getUserInfo);

export default userRouter;
