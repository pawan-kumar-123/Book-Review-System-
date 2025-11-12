import { asyncHandler } from "../utils/asyncHandler.js";
import { Review } from "../models/Review.models.js";
import { Book } from "../models/book.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
// import updateAverageRating  from "../models/book.models.js";

// Create a review/comment
const createReview = asyncHandler(async (req, res) => {
    const { bookId } = req.params;
    const { comment, rating, userId } = req.body;

    if (!comment || !comment.trim()) {
        throw new ApiError(400, "Comment is required");
    }

    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
        throw new ApiError(404, "Book not found");
    }

    // Create review
    const review = await Review.create({
        reviewByUser: userId,
        book: bookId,
        comment: comment.trim(),
        rating: rating || null
    });

  
    await book.updateAverageRating();

    
    const populatedReview = await Review.findById(review._id)
        .populate("reviewByUser", "userName email");

    return res.status(201).json(
        new ApiResponse(201, populatedReview, "Review created successfully")
    );
});

// Get all reviews for a book
const getBookReviews = asyncHandler(async (req, res) => {
    const { bookId } = req.params;

    const reviews = await Review.find({ book: bookId })
        .populate("reviewByUser", "userName email")
        .sort({ createdAt: -1 }); // Newest first

    return res.status(200).json(
        new ApiResponse(200, reviews, `Found ${reviews.length} reviews`)
    );
});

// Update a review
const updateReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const { comment, rating, userId } = req.body;

    if (!comment || !comment.trim()) {
        throw new ApiError(400, "Comment is required");
    }

    const review = await Review.findById(reviewId);
    if (!review) {
        throw new ApiError(404, "Review not found");
    }

    // Check if user owns the review
    if (review.reviewByUser.toString() !== userId) {
        throw new ApiError(403, "You can only update your own reviews");
    }

    review.comment = comment.trim();
    if (rating) {
        review.rating = rating;
    }

    await review.save();

    // Update book's average rating after review update
    const book = await Book.findById(review.book);
    if (book) {
        await book.updateAverageRating();
    }

    const updatedReview = await Review.findById(reviewId)
        .populate("reviewByUser", "userName email");

    return res.status(200).json(
        new ApiResponse(200, updatedReview, "Review updated successfully")
    );
});

// Delete a review
const deleteReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const { userId } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
        throw new ApiError(404, "Review not found");
    }

    
    if (review.reviewByUser.toString() !== userId) {
        throw new ApiError(403, "You can only delete your own reviews");
    }

    // Store book ID before deletion for updating average rating
    const bookId = review.book;

    await Review.findByIdAndDelete(reviewId);

    // Update book's average rating after review deletion
    const book = await Book.findById(bookId);
    if (book) {
        await book.updateAverageRating();
    }

    return res.status(200).json(
        new ApiResponse(200, null, "Review deleted successfully")
    );
});

export {
    createReview,
    getBookReviews,
    updateReview,
    deleteReview
}