require("dotenv").config()
// Import required modules
const express = require("express")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")



/*
     || M I D D I L E W A R E S      AND    R O U T E     F I L E S  ||
*/
// const {AddUser} = require("./utils/AddUser")
const {AuthRoutes} = require("./routes/Auth.routes")
const {errorHandler} = require("./middileware/errorHandler.middileware")
const {ownerRouter} = require("./routes/owner.routes")
const {AdminRouter} = require("./routes/admin.routes")
const {EmployeeRouter} = require("./routes/employee.routes")



const app = express()
app.use(express.json()) // Middleware to parse JSON request bodies
app.use(cookieParser()) // Middleware to parse cookies


/*
      || R O U T E S  || 
*/
app.use("/api/auth",AuthRoutes)
app.use("/api/owner",ownerRouter)
app.use("/api/admin", AdminRouter)
app.use("/api/employee",EmployeeRouter)

/*
      || D A T A B A S E   C O N N E C T I O N  || 
*/

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