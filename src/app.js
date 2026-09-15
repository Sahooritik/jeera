require("dotenv").config()

const express = require("express")
const mongoose = require("mongoose")
const {AddOwner} = require("./utils/AddOwner")

const app = express()



mongoose.connect(process.env.DB_URL)
.then(()=>{


//    AddOwner("RitikSahoo", "ritiksahoo@onwer.com", "Ritik@2001")

    console.log("DataBase connected")
    const port = process.env.PORT || 8080
    app.listen(port , ()=>{
        console.log("server is running")
    })


})


