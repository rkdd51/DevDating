const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./model/user");
const { validateSignUpData } = require("./utils/validator");
const cookieParser = require("cookie-parser");
const { userAuth } = require("../src/middlewares/auth"); 
const bcrypt = require("bcrypt");

app.use(express.json()); //Using this middleware to convert json object to javascript object
app.use(cookieParser());

//User for signup
app.post("/signup", async (req, res) => {
  
  try {
    
    const { firstName, lastName, emailId, password } = req.body;
    const hashPassword = await bcrypt
    .hash(password, 10);
    validateSignUpData(req);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
    });
    if (!user) {
      return res.status(400).send("Invalid User Data");
    }
    await user.save();
    res.send("Data added successfully");
  } catch (err) {
    console.log("Error : ", err.message);
  }
});

//Login
app.post("/login", async function (req, res) {
  const { emailId, password } = req.body;

  try {
    let user = await User?.findOne({ emailId });
    if (!user) {
      return res?.status(404).send("User not found");
    }
    const isPasswordMatch = await user.getPasswordVerified(password);
    if (!isPasswordMatch) {
      return res.status(400).send("Invalid Credentials");
    }
    if (isPasswordMatch) {
      const token = await user.getJWT();
      res.cookie("token", token);
      res.send("Login Successful");
    }
  } catch (err) {
    console.log("Error is" + err?.message);
  }
})

//Profile
app.get("/profile", userAuth, async (req, res) => {
  try {
    // Find user by _id
    const user = req?.user
    res.send(user);
  } catch (err) {
    console.log("Error in profile:", err.message);
    res.status(200).send("Error fetching profile");
  }
});


connectDB()
  .then(() => {
    console.log("Database connection established");
    app.listen(3000, () => {
      console.log("Server is running on port 4000");
    });
  })
  .catch((error) => {
    console.log("Database connection failed:", error);
  });
