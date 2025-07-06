import * as userService from "../services/userService.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import {unlink} from "node:fs/promises";
import HttpError from "../helpers/httpError.js";
import cloudinary from "../helpers/cloudinary.js";

const register = async (req, res) => {
    const user = await userService.registerUser(req.body);

    res.status(201).json(user)
}

const login = async (req, res) => {
    const {token, user} = await userService.loginUser(req.body);

    res.json({
        token,
        user: user
    });
}

export const logout = async (req, res) => {
    await userService.logoutUser(req.user);

    res.status(204).json()
}

export const getCurrent = async (req, res) => {
    res.json(req.user.toPublicJSON());
}

export const updateAvatar = async (req, res) => {
    const {id} = req.user;

    if (!req.file) {
        throw HttpError(404, "No file uploaded");
    }
    try {
        let avatarURL = null;

        const {url} = await cloudinary.uploader.upload(req.file.path, {
            folder: "avatars",
            use_filename: true,
        });
        avatarURL = url;
        await unlink(req.file.path);

        await userService.updateAvatar(id, avatarURL);

        res.json({avatarURL});
    } catch (error) {
        await unlink(req.file.path);
        throw HttpError(500);
    }
};

const verifyController = async (req, res) => {
    const {verificationToken} = req.params;
    await userService.verifyUser(verificationToken);

    res.json({
        message: "Verification successful"
    })
}

const resendVerifyController = async (req, res) => {
    await userService.resendVerifyUser(req.body.email);

    res.json({
        message: "Verification email sent"
    })
}

export default {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    logout: ctrlWrapper(logout),
    getCurrent: ctrlWrapper(getCurrent),
    updateAvatar: ctrlWrapper(updateAvatar),
    verifyController: ctrlWrapper(verifyController),
    resendVerifyController: ctrlWrapper(resendVerifyController),
}