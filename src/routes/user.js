const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const ConnectionRequest = require("../model/connectionRequest");
const User = require("../model/user");

//Get all the pending requests that user have received
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName"]);
    res.json({
      message: "Received connection requests",
      connectionRequests: connectionRequest,
    });
  } catch (err) {
    res.status(400).send("Error fetching user requests:" + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      status: "accepted",
    }).populate("fromUserId", ["firstName", "lastName"]);

    let connectionDetails = connections.map((data) => data?.fromUserId);

    res.json({
      message: "User connections",
      connectionDetails,
    });
  } catch (err) {
    res.status(400).send("Error fetching user connections:" + err.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {

    //* Pagination

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 20; // Number of cards per page
    limit = limit > 10 ? 20 : limit; // Number of cards per page
    const skip = (page - 1) * limit;


    //User should see all the cards except
    //1. His own cards
    //2. Cards from the users whom user has already sent the request
    //3. Cards from the user whom user has already received the request
    //4. His own connections

    let loggedInUser = req.user;

    //*Find all the connection requests (sent + received)
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");
    // .populate("fromUserId", "firstName")
    // .populate("toUserId", "firstName");

    const hideUserFromFeed = new Set();

    connectionRequests.forEach((req) => {
      hideUserFromFeed.add(req?.fromUserId.toString());
      hideUserFromFeed.add(req?.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
    .select("firstName lastName skills")
    .skip(skip)
    .limit(limit);
    

    res.send(users);
  } catch (err) {
    res.status(400).send("Error fetching feed:" + err.message);
  }
});

module.exports = userRouter;
