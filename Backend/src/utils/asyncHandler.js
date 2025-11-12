// const asyncHandler = (requestHandler) => {    
//     //requestHandler is a function that takes req,res,next as arguments and returns a promise or a value.
//     return (req, res, next) => {
//         Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
//     }
// }

// export { asyncHandler } 



const asyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next)
    } catch (err) {
        console.error("Error in asyncHandler:", err);
        const statusCode = err.statusCode || err.code || 500;
        const message = err.message || "Something went wrong";
        
        res.status(statusCode).json({
            success: false,
            message: message,
            statusCode: statusCode
        })
    }
}

export { asyncHandler }

