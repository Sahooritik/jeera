const mongoose = require("mongoose")
const validator = require("validator")


const UserSchema = new mongoose.Schema({
     name : {
        type : String,
        required : true,
        trim : true,
        minLength: 2,
        maxLength : 20,
        immutable : true
     },
     password : {
        type : String,
        required : true
     },
     email : {
        type : String,
        validate : {
            validator : (info)=>{
                return validator.isEmail(info)

            }
        },
        required : true,
        immutable : true,
        unique : true,
        trim : true

     },
    role : {
        type : String,
        required : true,
        enum : {
            values : ["owner", "admin" , "employee"],
            message : "{VALUES} is not a valid role"
        }
    },
    organizationId : {
        type : mongoose.Schema.Types.ObjectId
    },
    teamId : {
     type : mongoose.Schema.Types.ObjectId
    },


    isActive : {
        type : Boolean,
        default : true
    }




}, { timestamps : true})


const User = mongoose.model("user" , UserSchema)

module.exports = {
    User
}