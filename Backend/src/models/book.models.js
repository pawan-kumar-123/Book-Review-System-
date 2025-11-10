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
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },

}, { timestamps: true })


bookSchema.methods.updateAverageRating = async function () {
    const reviews = await mongoose.model('Review').find({ book: this._id });
    if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
        this.averageRating = totalRating / reviews.length;
    } else {
        this.averageRating = 0;
    }
    await this.save();
};

export const Book = mongoose.model('Book', bookSchema)
