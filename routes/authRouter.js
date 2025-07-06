import express from "express";

import authController from "../controllers/authController.js";
import userSchemas from "../schemas/userSchemas.js";
import validateBody from "../decorators/validateBody.js";
import authenticate from "../middlewares/authenticate.js";
import {upload} from "../middlewares/upload.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(userSchemas.authRegisterSchema), authController.register);
authRouter.post("/login", validateBody(userSchemas.authLoginSchema), authController.login);
authRouter.post("/logout", authenticate, authController.logout);
authRouter.get("/current", authenticate, authController.getCurrent);
authRouter.patch("/avatars", authenticate, upload.single("avatar"), authController.updateAvatar);
authRouter.get("/verify/:verificationToken", authController.verifyController);
authRouter.post("/verify", validateBody(userSchemas.authEmailSchema), authController.resendVerifyController);


export default authRouter;
