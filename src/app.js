require("dotenv").config()
// Import required modules
const express = require("express")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")



// Import routes and middleware
// const {AddUser} = require("./utils/AddUser")
const {AuthRoutes} = require("./routes/Auth.routes")
const {errorHandler} = require("./middileware/errorHandler.middileware")
const {ownerRouter} = require("./routes/owner.routes")




// Create an Express application
const app = express()
app.use(express.json()) // Middleware to parse JSON request bodies
app.use(cookieParser()) // Middleware to parse cookies



app.use("/api/auth",AuthRoutes)
app.use("/api/owner",ownerRouter)


mongoose.connect(process.env.DB_URL)
.then(()=>{
    console.log("DataBase connected")


//    AddUser("rohit", "rohit@admin.com", "Rohit@2001", "admin")

    const port = process.env.PORT || 8080
    app.listen(port , ()=>{
        console.log("server is running")
    }) 


})


app.use(errorHandler);