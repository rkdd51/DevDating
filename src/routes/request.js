const express = require('express');
requestRouter = express.Router();

requestRouter.post('/sendConnectionRequest', async(req, res) => {
    const user = req.user;
    console.log("Sending a connection request");
    res.send(user.firstName + "send a connection request")
})

module.exports = requestRouter;