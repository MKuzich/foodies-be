import express from "express";

import authControllers from "../controllers/authController.js";
import userSchemas from "../schemas/userSchemas.js";
import validateBody from "../decorators/validateBody.js";
import authenticate from "../middlewares/authenticate.js";
import {upload} from "../middlewares/upload.js";

const userRouter = express.Router();

userRouter.post("/register", validateBody(userSchemas.authRegisterSchema), authControllers.register);
userRouter.post("/login", validateBody(userSchemas.authLoginSchema), authControllers.login);
userRouter.post("/logout", authenticate, authControllers.logout);
userRouter.get("/current", authenticate, authControllers.getCurrent);
userRouter.patch("/avatars", authenticate, upload.single("avatar"), authControllers.updateAvatar);
userRouter.get("/verify/:verificationToken", authControllers.verifyController);
userRouter.post("/verify", validateBody(userSchemas.authEmailSchema), authControllers.resendVerifyController);


export default userRouter;
