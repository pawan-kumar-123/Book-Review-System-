import { Router } from "express";
import {
    loginAdmin,
    getAllUsers,
    deleteUser,
    createBook,
    editBook,
    deleteBook,
    getAllBooks
} from "../controllers/admin.controller.js";
import { upload } from "../utils/multer.js";

const router = Router()

router.post("/login", loginAdmin)
router.get("/users", getAllUsers)
router.delete("/users/:userId", deleteUser)
router.post("/books", upload.single("image"), createBook) // Add multer middleware here
router.post("/books", createBook)
router.put("/books/:bookId", editBook)
router.delete("/books/:bookId", deleteBook)
router.get("/books", getAllBooks)


export default router

