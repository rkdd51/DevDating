const jwt = require("jsonwebtoken");
const User = require("../model/user");

//This section is responsible for authentication
const userAuth = async(req, res, next) => {
   try {
     const token = req.cookies.token;
     if (!token) {
       res.status(401).send("Invalid token");
     }
     const decoded = jwt.verify(token, "PrivateKey", { expiresIn: '7d' });
     const user = await User.findById(decoded?._id);
     if (!user) return res.status(401).send("Access denied. Invalid token.");
     req.user = user;
     next();
   } catch (err) {
     res.status(400).send("Access denied: " + err.message);
   }
};

module.exports = {
  userAuth,
};
