import mongoose from "mongoose"
// import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const reviewSchema = new mongoose.Schema({

    reviewByUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: true
    },
    rating: {
        type: Number,
        required: false,
        min: 1,
        max: 5,
        default: null
    },
    comment: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true })

// videoSchema.plugin(mongooseAggregatePaginate)

export const Review = mongoose.model("Review", reviewSchema)