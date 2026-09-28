const mongoose = require("mongoose")
const { Task } = require("../models/task.schema")
const { AppError } = require("../utils/AppError")

const getAllTasks = async(req, res) => {
    
    const id = req.user._id

    const allTasks = await Task.find({
        assignedTo : id
    })

    res
    .status(200)
    .json({
        data : allTasks
    })


}

const getTaskById = async(req, res) => {

    const{ taskId } = req.params

    if(!mongoose.Types.ObjectId.isValid(taskId))
    {
        throw new AppError("Invalid Task ID", 400)
    }

    const data = await Task.findOne({
        _id : taskId,
        assignedTo : req.user._id
    })

    if(!data)
    {
        throw new AppError("Task not found", 400)
    }

    res
    .status(200)
    .json({
        data
    })

}


const updateTaskEmployee = async(req, res) => {

    const{ status } = req.body
    const{ taskId } = req.params

    if(!mongoose.Types.ObjectId.isValid(taskId))
    {
        throw new AppError("Invalid Task ID",400)
    }

    if(!status || !["todo", "in-progress", "completed"].includes(status))
    {
        throw new AppError("Invalid Status",400)
    }

    const data = await Task.findOneAndUpdate({
        _id : taskId,
        assignedTo : req.user._id
    }, {
        status
    },{
        runValidators : true,
        returnDocument : "after"
    })


    if(!data){throw new AppError("Task not found", 400)}

    res
    .status(200)
    .json({
        message : 'Task updated',
        data
    })

}

module.exports = {
    getAllTasks,
    getTaskById,
    updateTaskEmployee
}