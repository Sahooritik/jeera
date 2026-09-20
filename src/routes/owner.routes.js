const express = require("express")
const router = express.Router()

const { isLoggedIn } = require("../middileware/isLoggedin")
const {authorize} = require("../middileware/authorize")

const {
   createOrg,
   getOrg ,
   getOrgById,
   deletOrg, 
   updatedOrg,
   createAdmin,
   getAllAdmins,
   getAdminById,
   activateAdmin,
   deactivateAdmin
} =  require("../controllers/owner.controller")


/*
              ||  O W N E R    A P I  ||
*/

router.post("/", isLoggedIn,authorize("owner"), createOrg)
router.get("/", isLoggedIn, authorize("owner"), getOrg)
router.get("/:id", isLoggedIn , authorize("owner"), getOrgById )
router.delete("/:id", isLoggedIn, authorize("owner"), deletOrg)
router.patch("/:id", isLoggedIn, authorize("owner"), updatedOrg)







router.post("/organization/:id/admin", isLoggedIn, authorize("owner"), createAdmin)
router.get("/organization/:id/admin", isLoggedIn, authorize("owner"), getAllAdmins)
router.get("/admin/:id", isLoggedIn, authorize("owner"), getAdminById)
router.patch("/admin/:id", isLoggedIn, authorize("owner"), activateAdmin)
router.delete("/admin/:id", isLoggedIn, authorize("owner"), deactivateAdmin)





module.exports = {
   ownerRouter: router
}