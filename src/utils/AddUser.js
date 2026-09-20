const {User} = require("../models/User.schema")
const bcrypt = require("bcrypt")

const AddUser = (name , email, password,role)=>{



    bcrypt.hash(password, 10)
    .then((data)=>{
        User.create({name , email, password: data , role : role})
    })
   

}
 


module.exports = {
    AddUser
}