// Validation is the user exists

import { User } from "../models/user.models.js"
// import { ApiError } from "../utils/ApiError.js"

const checkUserNameExists = async (req, res, next) => {
    const { userName } = req.body
    const user = await User.findOne({
        userName: userName.toLowerCase()
    })
    if (user) {
        return res.status(409).json({
            message: "User already exists"
        })
    }
    next()
}

const checkEmailExists = async (req, res, next) => {
    const { email } = req.body
    const user = await User.findOne({
        email: email.toLowerCase()
    })
    if (user) {
        return res.status(409).json({
            message: "Email already exists"
        })
    }
    next()
}

const validateRegisteration = (req, res, next) => {
    console.log("🔍 validateRegisteration middleware - req.body:", req.body);
    const { userName, email, password } = req.body
    if (!userName || !email || !password) {
        console.log("❌ Missing fields");
        return res.status(400).json({
            message: "All fields are required"
        })
    }
    if (password.length < 8) {
        console.log("❌ Password too short");
        return res.status(400).json({
            message: "Password must be at least 8 characters"
        })
    }
    console.log("✅ Validation passed");
    next()


}


export { checkUserNameExists, checkEmailExists, validateRegisteration }