import mongoose from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const reviewSchema = new mongoose.Schema({

    reviewByUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    books: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true })

videoSchema.plugin(mongooseAggregatePaginate)

export const Review = mongoose.model("Review", reviewSchema)