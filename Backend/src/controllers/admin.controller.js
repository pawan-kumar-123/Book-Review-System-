import { asyncHandler } from "../utils/asyncHandler.js";
import { Admin } from "../models/admin.models.js"
import { User } from "../models/user.models.js"
import { Book } from "../models/book.models.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"


const loginAdmin = asyncHandler(async (req, res) => {
    const { userName, password } = req.body;
    console.log("Admin Login - Recived:", { userName });
    if (!userName || !password) {
        throw new ApiError(400, "Username and password are required")
    }
    const admin = await Admin.findOne({ userName: userName.toLowerCase() })
    if (!admin) {
        throw new ApiError(404, "Admin not found ")
    }

    const isPasswordValid = await admin.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password")
    }

    // JWT Token Generation (Commented for now - will use in future)
    // const accessToken = admin.generateAccessToken()
    // const refreshToken = admin.generateRefreshToken()

    const adminData = await Admin.findById(admin._id).select("-password")
    console.log("Admin logged in successfully");

    return res.status(200).json(
        new ApiResponse(200, { admin: adminData }, "Admin logged in successfully")
    )
})

const getAllUsers = asyncHandler(async (req, res) => {
    console.log("fetching all users");
    const users = await User.find().select("-password")
    if (!users) {
        throw new ApiError(500, "Error fetching users")
    }
    console.log(`Found ${users} users`);
    return res.status(200).json(
        new ApiResponse(200, users, `found ${users} users`)
    )
})

const deleteUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    console.log("deleting user", userId);

    const user = await User.findByIdAndDelete(userId)
    if (!user) {
        throw new ApiError(404, "User not found")
    }
    console.log("user deleated successfully");
    return res.status(200).json(
        new ApiResponse(200, user, "user deleated successfully")
    )
})


const createBook = asyncHandler(async (req, res) => {
    const { title, author, description, genre } = req.body;
    console.log("creating book:", { title, author });
    if (!title || !description || !author) {
        throw new ApiError(400, "Title,author and description are required")
    }
    const book = await Book.create({
        title,
        author,
        description,
        genre,
        addBy: req.admin.id
    })
    console.log("book created:", book);
    return res.status(201).json(
        new ApiResponse(201, book, "Book created successfully")
    )
})


const editBook = asyncHandler(async (req, res) => {
    const { bookId } = req.params;
    const { title, author, description, genre } = req.body
    console.log("editing book:", bookId);
    const book = await Book.findByIdAndUpdate(
        bookId,
        { title, author, description, genre },
        { new: true }
    )
    if (!book) {
        throw new ApiError(404, "book not found")
    }
    console.log(" Book updated:", book);
    return res.status(200).json(
        new ApiResponse(200, book, "book updated successfully")
    )
})


const deleteBook = asyncHandler(async (req, res) => {
    const { bookId } = req.params
    console.log("deleting book:", bookId);
    const book = await Book.findByIdAndDelete(bookId)
    if (!book) {
        throw new ApiError(404, "Book not found")
    }
    console.log(" Book deleted successfully");
    return res.status(200).json(
        new ApiResponse(200, book, "Book deleted successfully")
    )
})

const getAllBooks = asyncHandler(async (req, res) => {
    console.log("fetching all books");

    const books = await Book.find().populate("addBy", "userName email")

    if (!books) {
        throw new ApiError(500, "error fetching books")
    }
    console.log(`found ${books.length} books`);

    return res.status(200).json(
        new ApiResponse(200, books, `Found ${books.length} books`)
    )

})



export {
    loginAdmin,
    getAllUsers,
    deleteUser,
    createBook,
    editBook,
    deleteBook,
    getAllBooks
}