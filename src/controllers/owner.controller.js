const {AppError} = require("../utils/AppError")
const {Organization} = require("../models/Organization.schema")
const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcrypt")

const createOrg = async (req, res) => {
    const {name , isActive} = req.body

    if(!name.trim() || name.trim().length>100){
        throw new AppError("Invaild name" , 400)

    }

const createdOrg = await Organization.create({
   name,
   isActive,
   createdBy : req.user._id
})



res.status(201).json({
   message : "Created successfully",
   data :  createdOrg
})



}


const getOrg = async (req,res)=>{
      const{skip, limit} = req.query 
      const data = await Organization.find().limit(10).skip(skip * limit)

      res.status(200).json({
         data 
      })


}


const getOrgById = async (req, res , next)=>{
         const {id} = req.params

         if(!mongoose.Types.ObjectId.isValid(id)){
            throw new AppError("Invaild id", 400)
         }

         const data = await  Organization.findById(id)

         if(!data){
            throw new AppError("organization not found" , 400)
         }

         res.status(200).json({
            message : "success",
            data : data
         })
}

const deletOrg =   async(req , res)=>{
   const {id} = req.params

   if(!id || !mongoose.Types.ObjectId.isValid(id)){
      throw new AppError("invaild Id ", 400)
   }
  
  const deletedData = await Organization.findByIdAndUpdate(id, {isActive : false} , {returnDocument : "after"})

  if(!deletedData){
   throw new AppError("organization not found", 400)
  }




  
  
  res.status(200).json({message : "deleted Successfully", deletedData})

}

const updatedOrg =  async(req , res)=>{
   const {id} = req.params
   const {name , isActive} = req.body

   if(!id || !mongoose.Types.ObjectId.isValid(id)){
      throw new AppError("invaild Id ", 400)
   }

   if(!name.trim() || name.trim().length>100){
      throw new AppError("Invaild name" , 400)

  }

  const updatedData = await Organization.findByIdAndUpdate(id, {name , isActive} , {returnDocument : "after"})

  if(!updatedData){
   throw new AppError("organization not found", 400)
  }

  res.status(200).json({message : "updated Successfully", updatedData})

}

const createAdmin = async(req, res) => {

    const{ id } = req.params

    if(!id || !mongoose.Types.ObjectId.isValid(id))
    {
        throw new AppError("Invalid ID", 400)
    }

    const{ email, password, name} = req.body

    if(!validator.isEmail(email))
    {
        throw new AppError(`${email} is not a valid email`, 400)
    }

    if(!validator.isStrongPassword(password))
    {
        throw new AppError(`${password} is not a strong password`,400)
    }

    if(!name.trim() || name.trim().length > 20 || name.trim().length < 2)
    {
        throw new AppError("Invalid name", 400)
    }

    const foundOrg = await Organization.findById(id)

    if(!foundOrg)
    {
        throw new AppError("Organization does not exists", 400)
    }


    const hashedPassword = await bcrypt.hash(password, 10)

    const createdAdmin = await User.create({
        name,
        password : hashedPassword,
        email,
        role : "admin",
        organizationId : id,
        isActive : foundOrg.isActive
    })

    // if(!foundOrg.isActive)
    // {
    //     throw new AppError(400, "Organization Inactive")
    // }
    

    res
    .status(201)
    .json({
        data : createdAdmin,
        message : foundOrg.isActive ?  
        `Admin created under org ${foundOrg.name}` : 
        `Admin created under org ${foundOrg.name} which is currently INACTIVE`
    })

}

const getAllAdmins = async(req, res) => {

    const{ id } = req.params

    if(!id || !mongoose.Types.ObjectId.isValid(id))
    {
        throw new AppError(400,"Invalid ID")
    }

    const foundOrg = await Organization.findById(id)

    if(!foundOrg)
    {
        throw new AppError("Organization does not exists", 400)
    }

    const foundAdmins = await User.find({
        organizationId : foundOrg._id,
        role : "admin"
    })


    res
    .status(200)
    .json({
        data : foundAdmins,
        message : foundOrg.isActive ?  
        `Organization ACTIVE` : 
        `Organization INACTIVE`
    })


}


const getAdminById = async(req, res) => {

    const{ id } = req.params

    if(!id || !mongoose.Types.ObjectId.isValid(id))
    {
        throw new AppError("Invalid ID", 400)
    }

    const foundUser = await User.findById(id)

    if(!foundUser)
    {
        throw new AppError("User does not exists", 400)
    }

    const foundOrg = await Organization.findById(foundUser.organizationId)

    res
    .status(200)
    .json({
        data : foundUser,
        message : foundOrg.isActive ?  
        `Organization ACTIVE` : 
        `Organization INACTIVE`
    })




}


const activateAdmin = async(req, res) => {
    const{ id } = req.params

    if(!id || !mongoose.Types.ObjectId.isValid(id))
    {
        throw new AppError("Invalid ID", 400)
    }

    const foundUser = await User.findById(id)

    if(!foundUser)
    {
        throw new AppError("User does not exists", 400)
    }

    foundUser.isActive = true


    await foundUser.save()

    res
    .status(200)
    .json({
        message : `${foundUser.name} activated successfully`,
        data : foundUser
    })
}

const deactivateAdmin = async(req, res) => {
      const{ id } = req.params

    if(!id || !mongoose.Types.ObjectId.isValid(id))
    {
        throw new AppError("Invalid ID", 400)
    }

    const foundUser = await User.findById(id)

    if(!foundUser)
    {
        throw new AppError("User does not exists", 400)
    }

    foundUser.isActive = false


    await foundUser.save()

    res
    .status(200)
    .json({
        message : `${foundUser.name} deactivated successfully`,
        data : foundUser
    })
}







module.exports = {
    createOrg , 
    getOrg,
    getOrgById,
    deletOrg,
    updatedOrg,
    createAdmin,
    getAllAdmins,
    getAdminById,
    activateAdmin,
    deactivateAdmin
}
