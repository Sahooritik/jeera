const {User} = require("../models/User.schems")
const bcrypt = require("bcrypt")

const AddOwner = (name , email, password)=>{



    bcrypt.hash(password, 10)
    .then((data)=>{
        User.create({name , email, password: data , role : "owner"})
    })
   

}



module.exports = {
    AddOwner
}