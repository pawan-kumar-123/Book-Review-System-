import mongoose from "mongoose"
import bcrypt from "bcrypt"
// import jwt from "jsonwebtoken"
const adminSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    role: {
        type: String,
        enum: ["admin"],
        default: "admin"
    },
    permissions: {
        type: [String],
        default: ["manage_users", "manage_books"]
    }
},
    { timestamps: true })

adminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})
adminSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

// // 🔐 Generate Access Token (Short-lived - 7 days)
// adminSchema.methods.generateAccessToken = function () {
//     return jwt.sign(
//         {
//             _id: this._id,
//             email: this.email,
//             userName: this.userName,
//             role: this.role
//         },
//         process.env.ACCESS_TOKEN_SECRET,
//         {
//             expiresIn: process.env.ACCESS_TOKEN_EXPIRY
//         }
//     )
// }

// // 🔄 Generate Refresh Token (Long-lived - 30 days)
// adminSchema.methods.generateRefreshToken = function () {
//     return jwt.sign(
//         {
//             _id: this._id
//         },
//         process.env.REFRESH_TOKEN_SECRET,
//         {
//             expiresIn: process.env.REFRESH_TOKEN_EXPIRY
//         }
//     )
// }

export const Admin = mongoose.model("Admin", adminSchema)


