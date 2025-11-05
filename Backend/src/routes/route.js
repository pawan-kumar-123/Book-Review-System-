import express from "express"
import { registerUser } from "../controllers/user.controller.js";
import {
    checkUserNameExists,
    checkEmailExists,
    validateRegisteration
} from "../middlewares/user.middlewares.js"
import {
    createReview,
    getBookReviews,
    updateReview,
    deleteReview
} from "../controllers/review.controllers.js";
import { loginUser } from "../controllers/user.controller.js";


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


router.post("/login", loginUser)


router.post("/books/:bookId/reviews", createReview)
router.get("/books/:bookId/reviews", getBookReviews)
router.put("/reviews/:reviewId", updateReview)
router.delete("/reviews/:reviewId", deleteReview)

export default router;

