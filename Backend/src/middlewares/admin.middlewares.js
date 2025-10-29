import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Admin } from "../models/admin.models.js";

const verifyAdmin = asyncHandler(async (req, res, next) => {
    const { userName } = req.body

    if (!userName) {
        throw new ApiError(400, "Username is required to verify admin");
    }

    const admin = await Admin.findOne({ userName: userName.toLowerCase() });

    if (!admin) {
        throw new ApiError(401, "Admin not found. Please login with correct credentials.");
    }  

    req.admin = admin;
    next();
});

export { verifyAdmin };

