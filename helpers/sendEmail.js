import nodemailer from "nodemailer";

const { MAIL_EMAIL, MAIL_PASSWORD } = process.env;

const nodemailerConfig = {
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: MAIL_EMAIL,
    pass: MAIL_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (payload) => {
  const email = { ...payload, from: MAIL_EMAIL };
  return transport.sendMail(email);
};

export default sendEmail;
