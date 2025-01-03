const express = require("express");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utils/validator");
const User = require("../model/user");

const authRouter = express.Router();

//User for signup

authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailId, password, age, gender } = req.body;

    // Validate user-provided data
    validateSignUpData(req);

    // Hash the user's password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
      age,
      gender,
    });

    if (!user) {
      return res.status(400).send("Invalid User Data");
    }

    // Save the user in the database
    await user.save();

    // Generate a JWT token
    const token = await user.getJWT();

    // Set the cookie with the token
    res.cookie("token", token, {
      httpOnly: true, // Prevent access by client-side scripts
      secure: process.env.NODE_ENV === "production", // Use HTTPS in production
      sameSite: "strict", // Helps prevent CSRF attacks
    });

    // Send the user data in the response (excluding sensitive data)
    const userResponse = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailId: user.emailId,
      age: user.age,
      gender: user.gender,
    };

    res.status(201).send(userResponse);
  } catch (err) {
    console.error("Error during signup:", err.message);
    res.status(500).send("An error occurred during signup. Please try again.");
  }
});

//Login
authRouter.post("/login", async function (req, res) {
  const { emailId, password } = req.body;

  try {
    let user = await User?.findOne({ emailId: emailId });

    if (!user) {
      res.status(400).send("Invalid Credentials");
    }
    const isPasswordMatch = await user.getPasswordVerified(password);
    if (!isPasswordMatch) {
      return res.status(400).send("Invalid Credentials");
    }
    if (isPasswordMatch) {
      const token = await user.getJWT();
      res.cookie("token", token);
      res.send(user);
    }
  } catch (err) {
    console.log("Error is " + err?.message);
  }
});

//Logout
authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logged out successfully");
});

module.exports = authRouter;
