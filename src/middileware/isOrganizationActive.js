const { AppError } = require("../utils/AppError")

const isOrganizationActive = (req, res, next) => {
    if(req.user.role == "owner")
    {
        next()
    }
    else
    {
        if(!req.user.organizationId.isActive)
        {
            throw new AppError("Organization Inactive", 403)
        }
        next()
    }
}



module.exports = {
    isOrganizationActive
}