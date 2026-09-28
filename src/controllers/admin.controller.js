const mongoose = require("mongoose")
const { Team } = require("../models/Team.schema")
const { AppError } = require("../utils/AppError")
const { User } = require("../models/User.schema")
const bcrypt = require("bcrypt")
const validator = require("validator")
const {Task} = require("../models/task.schema")

/* 
      ||  T E A M     C O N T R O L L E R S  ||
*/


const addTeam = async(req, res) => {


    const{ name }  = req.body

    if(!name.trim() || name.trim().length > 50)
    {
        throw new AppError("Name is invalid", 400)
    }

    const createdTeam = await Team.create(
        {
            name,
            adminId : req.user._id,
            organizationId : req.user.organizationId._id
        }
    )

    res
    .status(200)
    .json({
        message : "Team created successfully",
        data : createdTeam
    })


}


const getAllTeams = async(req, res) => {


    const organizationId = req.user.organizationId._id
    const foundTeams = await Team.find({organizationId})

    res
    .status(200)
    .json({
        data : foundTeams
    })
}


const getTeamById = async(req, res) => {

    const { id } = req.params 

    if(!mongoose.Types.ObjectId.isValid(id))
    {
        throw new AppError("Invalid team ID", 400)
    }

    const foundTeam = await Team.findById(id)

    if(!foundTeam)
    {
        throw new AppError("Team not found", 404)
    }

    res
    .status(200)
    .json({
        data : foundTeam
    })

}

const deleteTeam = async(req, res) => {

    const{ id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id))
    {
        throw new AppError("Invalid ID", 400)
    }


    const foundTeam = await Team.findOne({
        _id : id,
        organizationId : req.user.organizationId._id
    })

    if(!foundTeam)
    {
        throw new AppError("Team does not exists", 404)
    }

    foundTeam.isActive = false
    await foundTeam.save()

    res
    .status(200)
    .json({
        message : "Team deleted successfully",
        // data : foundTeam
    })



}

const updateTeam = async(req, res) => {

    const{ id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id))
    {
        throw new AppError("Invalid ID", 400)
    }


    const foundTeam = await Team.findOne({
        _id : id,
        organizationId : req.user.organizationId._id
    })

    if(!foundTeam)
    {
        throw new AppError("Team does not exists", 404)
    }

    foundTeam.isActive = true
    await foundTeam.save()

    res
    .status(200)
    .json({
        message : "Team updated successfully",
        // data : foundTeam
    })



}


/*
      || E M P L O Y E E     C O N T R O L L E R S  ||
*/


const createEmployee = async(req, res) => {
    
    const{ teamId } = req.params

    if(!mongoose.Types.ObjectId.isValid(teamId))
    {
        throw new AppError("Invalid ID",400)
    }

    const foundTeam = await Team.findOne({
        _id : teamId,
        organizationId : req.user.organizationId._id
    })

    if(!foundTeam)
    {
        throw new AppError("Team does not exists", 404)
    }

    const{ name, password, email } = req.body

    if(!name.trim() || name.trim().length > 20 || name.trim().length < 2)
    {
        throw new AppError("Invalid name", 400)
    }

    if(!validator.isEmail(email))
    {
        throw new AppError("Invalid Email", 400)
    }

    if(!validator.isStrongPassword(password))
    {
        throw new AppError("Please enter a strong password", 400)
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const createdUser = await User.create({
        password : hashedPassword,
        name, 
        email, 
        role : "employee",
        organizationId : req.user.organizationId._id,
        teamId : teamId
    })

    res
    .status(201)
    .json({
        message :  `Employee (${name}) created successfully`,
        data : createdUser
    })


}

const getAllEmployeesByTeamId = async(req, res) => {
    const{ teamId } = req.params

    if(!mongoose.Types.ObjectId.isValid(teamId))
    {
        throw new AppError("Invalid ID", 400)
    }

    const allEmployees = await User.find({
        teamId : teamId,
        organizationId : req.user.organizationId._id
    })


    res
    .status(200)
    .json({
        data : allEmployees
    })

}


const deleteEmployee = async(req, res) => {
    const{ employeeId } = req.params

    if(!mongoose.Types.ObjectId.isValid(employeeId))
    {
        throw new AppError("Invalid ID", 400)
    }

    const foundEmployee = await User.findOne({
        _id : employeeId,
        organizationId : req.user.organizationId._id
    })


    if(!foundEmployee)
    {
        throw new AppError("User does not exists", 404)
    }

    foundEmployee.isActive = false
    await foundEmployee.save()

    res
    .status(200)
    .json({
        message : "User deleted"
    })
}

const updateEmployee = async(req, res) => {
    const{ employeeId } = req.params

    if(!mongoose.Types.ObjectId.isValid(employeeId))
    {
        throw new AppError("Invalid ID", 400)
    }

    // const foundEmployee = await User.findOne({
    //     _id : employeeId,
    //     organizationId : req.user.organizationId._id
    // })


    // if(!foundEmployee)
    // {
    //     throw new AppError("User does not exists", 404)
    // }
    

    const{teamId, isActive} = req.body
    // foundEmployee.teamdId = teamId
    // foundEmployee.isActive = isActive

    const foundEmployee = await User.findOneAndUpdate({_id : employeeId, organizationId : req.user.organizationId._id}, {teamId : teamId, isActive}, {
        runValidators : true,
        returnDocument : "after"
    })




    // await foundEmployee.save()

    res
    .status(200)
    .json({
        message : "User Updated",
        data : foundEmployee
    })

}

/*

        || A D M I N     C O N T R O L L E R S     F O R     T A S K   ||

*/

const createTask = async(req, res) => {
    const {employeeId} = req.params

  if(!mongoose.Types.ObjectId.isValid(employeeId)){
      throw new AppError("Invalid Id" , 400)
  }

  const foundEmployee = await User.findOne({
    _id : employeeId,
    organizationId : req.user.organizationId._id
  })

if(!foundEmployee){
    throw new AppError("Employee does not exist", 404)
}

const { title , description , status, priority} = req.body


if(!title || !title.trim() || title.trim().length>100){
    throw new AppError("invalid title" , 400)
}

if(!description || !description.trim() || description.trim().length>300){
    throw new AppError("Invalid description", 400)
}

 if(!status || !status.trim() || !["todo", "in-progress", "completed"].includes(status.trim()))
    {
        throw new AppError("Invalid status", 400)
    }


    if(!priority || !priority.trim() || !["low", "medium", "high"].includes(priority.trim()))
    {
        throw new AppError("Invalid priority", 400)
    }
//   console.log(foundEmployee)
 const createdTask = await Task.create({
        title, 
        description,
        status, 
        priority,
        organizationId : req.user.organizationId._id,
        teamId : foundEmployee.teamId,
        assignedTo : employeeId,
        createdBy : req.user._id
    })
    
    res
    .status(201)
    .json({
        message : "Task created",
        data : createdTask
    })



}

const getAllTasks = async(req, res) => {


    const allTasks = await Task.find({
        organizationId : req.user.organizationId._id
    })
       


    res
    .status(200)
    .json({
        data : allTasks
    })
}


const getTaskById = async(req, res) => {
    const { taskId } = req.params

    if(!mongoose.Types.ObjectId.isValid(taskId))
    {
        throw new AppError("Invalid ID", 400)
    }

    const foundTask = await Task.findOne({
        _id : taskId,
        organizationId : req.user.organizationId._id
    })


    res
    .status(200)
    .json({
        data : foundTask
    })

    

}


const deleteTask = async(req, res) => {

    const { taskId } = req.params

    if(!mongoose.Types.ObjectId.isValid(taskId))
    {
        throw new AppError("Invalid ID", 400)
    }

    const data = await Task.findOneAndDelete({
        _id : taskId,
        organizationId : req.user.organizationId._id
    })

    // console.log(data)

    res
    .status(200)
    .json({
        message : "Done"
    })

}


const updateTask = async(req, res) => {

    const { taskId } = req.params

    if(!mongoose.Types.ObjectId.isValid(taskId))
    {
        throw new AppError("Invalid Task ID", 400)
    }

    const{title, description, status, priority, assignedTo} = req.body

    if(!title || !title.trim() || title.trim().length > 100)
    {
        throw new AppError("Invalid title", 400)
    }


    if(!description || !description.trim() || description.trim().length > 300)
    {
        throw new AppError("Invalid description", 400)
    }


    if(!status || !status.trim() || !["todo", "in-progress", "completed"].includes(status.trim()))
    {
        throw new AppError("Invalid status", 400)
    }


    if(!priority || !priority.trim() || !["low", "medium", "high"].includes(priority.trim()))
    {
       throw new AppError("Invalid entries", 400)
    }


    // if(!teamId || !mongoose.Types.ObjectId.isValid(teamId))
    // {
    //    throw new AppError("Invalid teamId", 400)
    // }


    if(!assignedTo || !mongoose.Types.ObjectId.isValid(assignedTo))
    {
       throw new AppError("Invalid assignTo", 400)
    }

    const foundEmployee = await User.findById(assignedTo)

    if(!foundEmployee)
    {
      throw new AppError("User not found", 400)
    }


    const updatedTask = await Task.findOneAndUpdate({
        _id : taskId,
        organizationId : req.user.organizationId._id
    }, {
        title,
        description,
        status,
        priority,
        teamId : foundEmployee.teamId,
        assignedTo
    }, {
        runValidators : true,
        returnDocument : "after"
    })
//   console.log(updatedTask)
    if(!updatedTask)
    {
        throw new AppError("Task not found", 404)
    }

    res
    .status(200)
    .json({
        message : "Task updated",
        data : updatedTask
    })

}








module.exports = {
    addTeam,
    getAllTeams,
    getTeamById,
    deleteTeam,
    updateTeam,
    createEmployee,
    getAllEmployeesByTeamId,
    deleteEmployee,
    updateEmployee,
    createTask,
    getAllTasks,
    getTaskById,
    deleteTask,
    updateTask
    
}