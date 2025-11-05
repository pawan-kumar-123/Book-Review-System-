import mongoose from "mongoose"
const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        default: ""
    },
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    addBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    }
}, { timestamps: true })
export const Book = mongoose.model('Book', bookSchema)
