import mongoose from "mongoose"

const Schema = mongoose.Schema
const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        lowercase: true,
        max: 256
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        max: 64,
        unique: true
    },
    dob: {
        type: Date
    },
    phone_number: {
        type: String,
        trim: true,
        unique: true
    },
    password: {
        type: String
    }
}, {
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            delete ret._id
            delete ret.__v
            delete ret.createAt
            delete ret.updateAt
            delete ret.hash
        }
    },
    timestamps: true
})

const User = mongoose.model('User', userSchema)
export default User
