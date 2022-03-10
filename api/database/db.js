import mongoose from "mongoose"
import dotenv from 'dotenv'
dotenv.config()

const connectionOptions = {useNewUrlParser: true, useUnifiedTopology: true}

export const databaseConnect = () => {
    try {
         mongoose.connect(process.env.MONGODB_URI, connectionOptions)
        console.log("Twitter DB is connected")
        
    } catch (err) {
        console.log("DB is not connected: " + err)
    }
}
export default databaseConnect