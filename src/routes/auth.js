const express = require("express");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utils/validator");
const User = require("../model/user");


const authRouter = express.Router();

//User for signup
authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailId, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
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
authRouter.post("/login", async function (req, res) {
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
});


module.exports = authRouter;