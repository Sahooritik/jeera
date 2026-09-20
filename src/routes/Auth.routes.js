const express = require("express")
const {User} = require("../models/User.schema")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const {AppError} = require("../utils/AppError")
const {isLoggedIn} = require("../middileware/isLoggedin")
const router = express.Router()




router.post("/login", async (req, res) => {

    const { email, password } = req.body;

   // Check if email and password are provided
    if(!email || !password) {

        throw new AppError("Email and password are required", 400);

    }
    
    const foundUser = await User.findOne({ email });
  // Check if user exists
    if(!foundUser) {

        throw new AppError("Invalid credentials", 401);

    }
  // Check if password is valid
    const isPasswordValid = await bcrypt.compare(password, foundUser.password);
    if(!isPasswordValid) {

        throw new AppError("Invalid credentials", 401);

    } 
    // Generate JWT token
  const token = jwt.sign({ id: foundUser._id }, process.env.JWT_SECRET,{ expiresIn: "1d" });

  
  
  
  
  
//   res.cookie("token", token, { maxAge: 1000 * 60 * 60 * 24 });
  res.cookie("token", token, { maxAge: 1000 * 60 * 60 * 24 }).status(200).json({ message: "Login successful", email });



 

});



router.get("/me", isLoggedIn, async (req, res) => {

    const{name, email, role, isActive} = req.user



    res.json({
        message : "OK",
        data : {name, email, role, isActive}
    })
    
 


     

});     


router.get("/logout", (req, res) => {

    res.clearCookie("token").status(200).json({ message: "Logout successful" });

});



module.exports = {AuthRoutes : router}