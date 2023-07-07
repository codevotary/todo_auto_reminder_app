require("dotenv").config()
const nodemailer = require("nodemailer");



const sendMail = async (subject, message, receiver, receiver_name) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            port: 465,
            secure: process.env.ENV === "development" ? false : true,
            auth: {
              user: process.env.USER,
              pass: process.env.PASS
            }
        })
    
        const sent = await transporter.sendMail({
            from: `${process.env.SENDER_NAME} 👻" ${process.env.SENDER}`, // sender address
            to: `${receiver_name}, ${receiver}`, // list of receivers
            subject: subject, // Subject line
            html: message, // html body
        });

        return { error: false, data: sent }
    } catch(error) {
        return { error: true, message: `Could not send mail. Reason => ${error.message}` }
    }
}







module.exports = {
    sendMail
}