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
import { Book } from "../models/book.models.js";

const router = Router()

router.post("/login", loginAdmin)
router.get("/users", getAllUsers)
router.delete("/users/:userId", deleteUser)
router.post("/books", createBook)
router.put("/books/:bookId", editBook)
router.delete("/books/:bookId", deleteBook)
router.get("/books", getAllBooks)


export default router