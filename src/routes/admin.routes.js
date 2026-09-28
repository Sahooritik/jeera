const express = require('express');
const router = express.Router();
const { isLoggedIn, authorize , isOrganizationActive } = require('../middileware/index');
const { addTeam , 
    getAllTeams , 
    getTeamById , 
    deleteTeam , 
    updateTeam , 
    createEmployee, 
    getAllEmployeesByTeamId,
    deleteEmployee, 
    updateEmployee,
    createTask,
    getAllTasks,
    getTaskById,
    deleteTask,
    updateTask
    
} = require('../controllers/admin.controller');


/*
              ||  A D M I N    A P I  F O R   T E A M S  ||
*/


router.post( "/teams", isLoggedIn, isOrganizationActive, authorize("admin"), addTeam)
router.get("/teams",isLoggedIn,isOrganizationActive, authorize("admin"),getAllTeams)
router.get("/teams/:id",isLoggedIn,isOrganizationActive,authorize("admin"),getTeamById)
router.delete("/teams/:id",isLoggedIn,isOrganizationActive,authorize("admin"),deleteTeam)
router.patch("/teams/:id",isLoggedIn,isOrganizationActive,authorize("admin"),updateTeam)



/*
    ||  A D M I N    R O U T E S   F O R   E M P L O Y E E S  ||
*/


router.post("/teams/:teamId/employees",isLoggedIn,isOrganizationActive,authorize("admin"),createEmployee)
router.get("/teams/:teamId/employees",isLoggedIn,isOrganizationActive,authorize("admin"),getAllEmployeesByTeamId)
router.delete( "/employees/:employeeId",isLoggedIn,isOrganizationActive,authorize("admin"), deleteEmployee)
router.patch("/employees/:employeeId",isLoggedIn,isOrganizationActive,authorize("admin"),updateEmployee)



/*
   
    || A D M I N    R O U T E S   F O R  T A S K ||

*/

router.post( "/tasks/employee/:employeeId", isLoggedIn,isOrganizationActive, authorize("admin"),createTask)
router.get("/tasks",isLoggedIn,isOrganizationActive,authorize("admin"),getAllTasks)
router.get("/tasks/:taskId",isLoggedIn, isOrganizationActive,authorize("admin"),getTaskById)
router.delete("/tasks/:taskId",isLoggedIn,isOrganizationActive,authorize("admin"),deleteTask)
router.patch("/tasks/:taskId",isLoggedIn,isOrganizationActive, authorize("admin"),updateTask)



module.exports = {AdminRouter: router};    