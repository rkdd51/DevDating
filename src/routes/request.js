const express = require("express");
requestRouter = express.Router();
const ConnectionRequest = require("../model/connectionRequest");
const { userAuth } = require("../middlewares/auth");
const User = require("../model/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;

      const toUserId = req.params.toUserId;

      const status = req.params.status;

      if (fromUserId.equals(toUserId)) {
        res.status(400).json({
          message: "Cannot send connection request to yourself",
          fromUserId,
          toUserId,
        });
      }

      const isAllowedStatus = ["ignored", "interested"];
      if (!isAllowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid status",
          status,
        });
      }
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(400).json({
          message: "User not found",
          toUserId,
        });
      }
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res.status(400).json({
          message: "Connection request already sent",
          // existingConnectionRequest,
        });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const connectionRequestData = await connectionRequest.save();
      res.json({
        message: req.user.firstName + " is " + status + " in " + toUser.firstName,
        connectionRequestData,
      });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);


requestRouter.post('/request/review/:status/:requestId', userAuth, (async(req, res) => {
  
  try {
    let loggedInUser = req?.user;
    const allowedStatus = ["accepted", "rejected"];
    let { status, requestId } = req.params;
    if (!allowedStatus.includes(status)) {
      return res.status(400).send('Invalid status');
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested",
    });

    if (!connectionRequest) {
      return res.status(400).send('Connection request not found');
    }

    connectionRequest.status = status;

    const data = await connectionRequest.save();

    res.json({
      message: loggedInUser.firstName +' has '+ status +' the connection request',
      data,
    });
  } catch (err) {
    res.status(400).send('Error reviewing connection request:'+ err.message);
  }

}))
module.exports = requestRouter;
