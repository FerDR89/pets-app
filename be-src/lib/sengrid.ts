require("dotenv").config();
// import * as sgMail from "@sendgrid/mail";
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
export { sgMail };
