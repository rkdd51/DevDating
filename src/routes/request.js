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

module.exports = requestRouter;
