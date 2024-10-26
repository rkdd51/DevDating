const express = require('express');
const { userAuth } = require("../middlewares/auth"); 
const profileRouter = express.Router();
const { validateEditData, validatePassword } = require("../utils/validator");
const bcrypt = require("bcrypt");

//Profile view
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    // Find user by _id
    const user = req?.user;
    res.send(user);
  } catch (err) {
    console.log("Error in profile:", err.message);
    res.status(400).send("Error fetching profile");
  }
});

//Profile edit
profileRouter.post("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditData(req)) {
      throw new Error("Invalid edit request");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();  

    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfully`,
      user: loggedInUser,
    });
  } catch (err) {
    console.log("Error in profile:", err.message);
    res.status(400).send("Error editing profile");

  }
})

//Profile password change
profileRouter.post('/profile/edit/password', userAuth, async (req, res) => {
  try {
    if (!validatePassword(req)) {
      throw new Error("Invalid password change request");
    }

    const loggedInUser = req.user;
    const newPassword = await bcrypt.hash(req.body.password, 10);
    loggedInUser.password = newPassword;

    await loggedInUser.save();  

    res.json({
      message: `${loggedInUser.firstName}, your password updated successfully`,
      user: loggedInUser,
    });
  } catch (err) {
    console.log("Error in profile:", err.message);
    res.status(400).send("Error changing password");
  }
})

module.exports = profileRouter;