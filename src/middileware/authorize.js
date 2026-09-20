const { AppError } = require("../utils/AppError")

const authorize = (...roles) => {


    return (req, res, next) => {

        if(!roles.includes(req.user.role))
        {
            throw new AppError("Unauthorised Operation", 403)
        }

        next()


    }
 

}

module.exports = {
    authorize
}