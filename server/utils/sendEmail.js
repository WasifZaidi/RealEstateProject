const nodemailer = require("nodemailer")
exports.sendEmail = async ({ to, subject, text }) => {
    const transpoter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })
    await transpoter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
    })
}