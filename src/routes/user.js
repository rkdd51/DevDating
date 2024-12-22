const express = require('express');
const { userAuth } = require('../middlewares/auth');
const userRouter = express.Router();
const ConnectionRequest = require("../model/connectionRequest");

//Get all the pending requests that user have received
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate(
        "fromUserId",
        ["firstName", "lastName"]
    );
      res.json({
          message: "Received connection requests",
          connectionRequests: connectionRequest,
        });
      
  } catch (err) {
    res.status(400).send("Error fetching user requests:" + err.message);
  }
});

module.exports = userRouter;