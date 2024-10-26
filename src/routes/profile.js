const express = require('express');
const { userAuth } = require("../middlewares/auth"); 
const profileRouter = express.Router();

//Profile
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    // Find user by _id
    const user = req?.user;
    res.send(user);
  } catch (err) {
    console.log("Error in profile:", err.message);
    res.status(200).send("Error fetching profile");
  }
});


module.exports = profileRouter;