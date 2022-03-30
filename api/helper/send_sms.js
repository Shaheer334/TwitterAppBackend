import dotenv from 'dotenv'
import twilio from 'twilio'
import nodemailer from 'nodemailer'
dotenv.config()

const client = new twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
)

const sendSMS = (number, code, user) => {
    // console.log("number hereeeeeeeeeeeeee",number)
    client.messages
        .create({
            body: `[TWITTER APP]
            Hi ${user} use this ${code} code. This code will expires in 10 minutes. Please keep this confidential`,
            from: "+19108123413",
            to: number
        })
        .then((message) => console.log(message.sid))
}

const send_sms_email = (email, code, name) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    })
    let mailOptions = {
        from: '"TWITTER APP" shaheerzeb001@gmail.com',
        to: email,
        subject: `OTP for your account activation`,
        html: `
        <h3>Hi ${name} <br> OTP for email verification</h3><br>
        <h1>${code}</h1>
        `
    }
    transporter.sendMail(mailOptions, (err) => {
        console.log("send mailer: ",)
        if (!err) {
            console.log('otp has been sent to your email')
        }
        else {
            console.log("error occured", err)
        }

    })
}

export default sendSMS
export { send_sms_email }