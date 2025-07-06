import * as userService from "../services/userService.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";

const getUserInfo = async (req, res) => {
    const {id} = req.params;
    const user = await userService.getUserInfo({id});
    const currentUser = req.user;
    res.json({currentUser: currentUser.toPublicJSON(), user})
}

export default {
    getUserInfo: ctrlWrapper(getUserInfo),
}