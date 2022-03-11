import User from '../../database/models/user.js'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import sendSMS, { send_sms_email } from '../../helper/send_sms.js'
import bcrypt from 'bcrypt'

dotenv.config()

var otp = Math.floor(1000 + Math.random() * 9000)
const total_time_limit = 10 * 60 * 1000
var expiration_time = Date.now() + total_time_limit


export const log_in = async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
        return res.send({
            code: res.sendStatus,
            data: { msg: "Email not found" },
            success: false
        })
    } else {
        if (user && bcrypt.compareSync(password, user.password)) {
            const phone_number = user.phone_number
            const data = `${phone_number}.${otp}.${expiration_time}`
            let hash = crypto.createHmac('sha256', process.env.OTP_SECRET_KEY_LOGIN).update(data).digest('hex')
            const hashed_finally = `${hash}.${expiration_time}`
            console.log("haaaaaaaaaaaaaaaaaasssssssssssshhhhhhhhhhhhh!!!!!", hashed_finally)
            //send otp
            sendSMS(phone_number, otp, user)
            send_sms_email(email, otp, user)

            return res.send({
                code: res.sendStatus,
                msg: 'otp has been sent on your number, otp will expire in 10 minutes.',
                data: {
                    otp: otp,
                    phone_number: `phone number: ${phone_number}, email: ${email}`,
                    hashed: hashed_finally
                },
                success: true
            })
        }
        return res.send({
            code: res.sendStatus,
            data: { msg: 'your password is incorrect' },
            success: false
        })
    }
}

export const verifyOTP = async (req, res) => {
    try {
        const { phone_number, otp, hashed } = req.body
        const [hash, expiration_time] = hashed.split('.')
        const current_time = Date.now()
        if (current_time > parseInt(expiration_time)) {
            return res.status(504).send({
                code: res.sendStatus,
                data: { msg: 'OTP timeout, please try for new otp' },
                success: false,
            })
        }
        let data = `${phone_number}.${otp}.${expiration_time}`
        let new_hashed_value = crypto.createHmac('sha256', process.env.OTP_SECRET_KEY_LOGIN).update(data).digest('hex')

        if (new_hashed_value === hash) {
            const user = await User.findOne({ phone_number: phone_number })
            if (user) {
                const access_token = jwt.sign({ email: user.email }, process.env.JWT_AUTH_SECRET_KEY_LOGIN, { expiresIn: '1d' })
                return res.send({
                    code: res.sendStatus,
                    msg: 'otp verified, please use the access token below to login',
                    data: { access_token: access_token },
                    success: true
                })
            } else {
                return res.send({
                    code: res.sendStatus,
                    msg: 'user not found',
                    data: { access_token: {} },
                    success: false
                })
            }
        } else {
            return res.send({
                code: res.sendStatus,
                msg: 'incorrect otp',
                data: {},
                success: false
            })
        }
    } catch (error) {
        console.log(error)
        res.status(400).send({
            code: res.sendStatus,
            data: { msg: `something happening worse against the rules and regulationsssssssss! Error message: ${error}` },
            success: false
        })
    }
}

export const sign_up = async (req, res) => {
    try {
        const { name, email, dob, phone_number, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            const data = `${email}.${otp}.${expiration_time}`
            const hash = crypto.createHmac('sha256', process.env.OTP_SECRET_KEY_SIGN_IN).update(data).digest('hex')
            const hashed_finally = `${hash}.${expiration_time}`
            // user.password = bcrypt.hashSync(passowrd, 10)
            send_sms_email(email, otp, name)
            return res.send({
                code: res.sendStatus,
                msg: `verification code has been sent to your provided email address ${email}`,
                data: {
                    name,
                    email,
                    dob,
                    phone_number,
                    password,
                    otp,
                    hashed: hashed_finally
                },
                success: true
            })
        } else {
            return res.send({
                code: res.sendStatus,
                msg: 'the provided email has already been registered',
                data: {},
                success: false
            })
        }

    } catch (error) {
        return res.status(400).send({
            code: res.sendStatus,
            data: { msg: `The sign up system failed with this error message : ${error}` },
            success: false
        })
    }
}

export const verifyOTP_sign_in = async (req, res) => {
    try {
        const { name, email, dob, phone_number, password, otp, hashed } = req.body
        const [hash, expiration_time] = hashed.split('.')
        let this_moment = Date.now()
        if (this_moment > parseInt(expiration_time)) {
            return res.send({
                code: res.sendStatus,
                data: { msg: 'OTP has been expired' },
                success: false
            })
        } else {
            const data = `${email}.${otp}.${expiration_time}`
            const newly_get_hashed_value = crypto.createHmac('sha256', process.env.OTP_SECRET_KEY_SIGN_IN).update(data).digest('hex')
            if (hash === newly_get_hashed_value) {
                const user = new User({
                    name,
                    email,
                    dob,
                    phone_number,
                })
                user.password = bcrypt.hashSync(password, 10)
                await user.save()
                return res.send({
                    code: res.sendStatus,
                    data: { msg: `User ${name} has been registered successfully` },
                    success: true
                })
            } else {
                return res.send({
                    code: res.sendStatus,
                    msg: 'Incorrect OTP',
                    data: {},
                    success: false
                })
            }
        }
    } catch (error) {
        return res.status(400).send({
            code: res.sendStatus,
            data: { msg: `Big error has been occured during OTP verification, error message is: ${error}` },
            success: false
        })
    }
}

