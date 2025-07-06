import bcrypt from "bcrypt";
import gravatar from "gravatar";
import {nanoid} from "nanoid";
import User from "../db/User.js";
import {createToken} from "../helpers/jwt.js";
import HttpError from "../helpers/httpError.js";
import sendEmail from "../helpers/sendEmail.js";

const {APP_DOMAIN} = process.env

const createVerifyEmail = ({email, verificationToken}) => ({
    to: email,
    subject: "Verify email",
    html: `<a href="${APP_DOMAIN}/api/auth/verify/${verificationToken}" target="_blank">Click verify email</a>`,
})


export const findUser = query => User.findOne({
    where: query,
})

export const registerUser = async payload => {
    const hashPassword = await bcrypt.hash(payload.password, 10);
    const verificationToken = nanoid();

    const avatarURL = gravatar.url(payload.email, {s: '200', r: 'pg', d: 'identicon'}, true);

    const user = await User.create({
        ...payload,
        password: hashPassword,
        avatarURL,
        verificationToken,
    });

    const verifyEmail = createVerifyEmail({email: payload.email, verificationToken});

    await sendEmail(verifyEmail);

    return user.toPublicJSON();
}

export const loginUser = async ({email, password}) => {
    const user = await findUser({email});
    if (!user) throw HttpError(401, "Email or password is wrong");

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) throw HttpError(401, "Email or password is wrong");

    const payload = {id: user.id};

    const token = createToken(payload);

    user.token = token;
    await user.save();

    return {
        token,
        user: user.toPublicJSON()
    };
}

export const logoutUser = async ({id}) => {
    const user = await findUser({id});
    if (!user) throw HttpError(401, "User not found");
    user.token = "";
    await user.save();
}

export const updateAvatar = async (id, avatar) => {
    const user = await findUser({id});
    if (!user) throw HttpError(404, "User not found");

    user.avatarURL = avatar;
    await user.save();
};

export const verifyUser = async verificationToken => {
    const user = await findUser({verificationToken});
    if (!user) throw HttpError(404, "User not found");

    return user.update({verify: true, verificationToken: null});
}

export const resendVerifyUser = async email => {
    const user = await findUser({email, verify: false});
    if (!user) throw HttpError(401, "Email not found or already verified");

    const verifyEmail = createVerifyEmail({email, verificationToken: user.verificationToken});

    await sendEmail(verifyEmail);
}

export const getUserInfo = async query => {
    try {
        const user = await findUser(query);
        if (!user) {
            return null
        }
        return user.toPublicJSON();
    } catch (error) {
        throw error;
    }
}