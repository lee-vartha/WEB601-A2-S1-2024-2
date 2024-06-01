function errorHandler(req, res, err, next) {
    if(err.name === "UnauthorizedError") {
        return res.status(401).json({message: "The user is not authorized"}); // 401 means unauthorized
    }
    if(err.name === "ValidationError") {
        return res.status(401).json({message: err})
    }
    return res.status(500).json(err)
}

module.exports = errorHandler