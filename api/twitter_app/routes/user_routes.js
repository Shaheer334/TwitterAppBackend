import express from 'express'
import {
    log_in,
    verifyOTP,
    sign_up,
    verifyOTP_sign_in
} from '../controller/user_controller.js'

const user_router = express.Router()


user_router.post("/log-in", log_in)
user_router.post("/verify-login", verifyOTP)
user_router.post("/signup", sign_up)
user_router.post("/verify-signup", verifyOTP_sign_in)


export default user_router