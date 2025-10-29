import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"


const registerUser = asyncHandler(async (req, res) => {
    try {
        const { userName, email, password } = req.body;
        console.log("📝 Received data:", { userName, email, password });

        // Create new user using User.create()
        const user = await User.create({
            userName: userName.toLowerCase(),
            email: email.toLowerCase(),
            password: password
        })

        // Explicitly save to database
        // await user.save()
        // console.log(" User saved to DB:", user);

        // Fetch from database to confirm
        const createdUser = await User.findById(user._id).select("-password")
        console.log("✅ User found in DB:", createdUser);

        if (!createdUser) {
            throw new ApiError(500, "something went wrong while registering the user!!!")
        }

        return res.status(201).json(
            new ApiResponse(201, createdUser, "User created successfully")
        )
    } catch (error) {
        console.error("❌ Error in registerUser:", error.message);
        throw error;
    }

})

export { registerUser }


