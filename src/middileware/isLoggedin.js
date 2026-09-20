const { AppError } = require("../utils/AppError")
const jwt = require("jsonwebtoken")
const validator = require("validator")
const { User } = require("../models/User.schema")

const isLoggedIn = async(req, res, next) => {
    const{ token } = req.cookies

    if(!token)
    {
        throw new AppError("Please log in" , 400)
    }

    if(!validator.isJWT(token))
    {
        throw new AppError("Please provide a valid token", 400)
    }

    const originalObject = jwt.verify(token, process.env.JWT_SECRET) 
    // console.log(originalObject)
    const foundUser = await User.findById(originalObject.id)
    //  console.log(foundUser)
    if(!foundUser)
    {
        throw new AppError("User not found", 400)
    }

    req.user = foundUser

    next()
}


module.exports = {
    isLoggedIn
}