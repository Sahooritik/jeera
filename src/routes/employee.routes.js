const express = require("express")
const router = express.Router()
const { isLoggedIn, authorize, isOrganizationActive} = require("../middileware/index")
const{ getAllTasks, getTaskById, updateTaskEmployee} = require("../controllers/employee.controller")

router.get("/tasks",isLoggedIn,authorize("employee"),isOrganizationActive,getAllTasks)
router.get("/tasks/:taskId",isLoggedIn,authorize("employee"),isOrganizationActive,getTaskById)
router.patch("/tasks/:taskId",isLoggedIn,authorize("employee"),isOrganizationActive,updateTaskEmployee)







module.exports = {
    EmployeeRouter : router
}