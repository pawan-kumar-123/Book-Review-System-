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
        res.status(err.code || 500).json({
            success: false,
            massage: err.code
        })
    }
}

export { asyncHandler } 


