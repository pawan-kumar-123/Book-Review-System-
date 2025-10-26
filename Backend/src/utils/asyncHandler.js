const asyncHandler = (requestHandler) => {    
    //requestHandler is a function that takes req,res,next as arguments and returns a promise or a value.
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}

export { asyncHandler } 
