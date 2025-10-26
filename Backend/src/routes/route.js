import express from "express"
import { registerUser } from "../controllers/user.controller.js";
import {
    checkUserNameExists,
    checkEmailExists,
    validateRegisteration
} from "../middlewares/user.middlewares.js"

const router = express.Router();
router.get('/', (req, res) => {
    res.json({
        message: "Book route working "
    })
})

router.route("/register.html").post(
    validateRegisteration,
    checkUserNameExists,
    checkEmailExists,
    registerUser
)


export default router;


