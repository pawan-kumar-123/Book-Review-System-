import mongoose, { Mongoose } from "mongoose"
const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        email: {
            type: String,
            unique: true
        },
        password: String,
        default: "user"
    }
}, { timestamps: true })
export const User = mongoose.model('User', userSchema)

