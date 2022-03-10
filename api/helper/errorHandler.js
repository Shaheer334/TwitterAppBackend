const errorHandler = (err, req, res, next) => {
    if (typeof (err) === 'string') {
        // custom application error
        return res.status(400).json({message: err})
    }
    if (res.name === 'UnauthorizedError') {
        // jwt authentication error
        return res.status(401).json({message: 'unauthorized'})
    }
    
    // default server error
    return res.status(500).json({message: err.message})
}

export default errorHandler