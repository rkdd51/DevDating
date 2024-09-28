const express = require("express");

const app = express();

app.use(
  "/user",
  (req, res, next) => {
    // res.send("1st Response");
    next();
  },
  (req, res, next) => {
    res.send("2nd Response");
    next();
  },
  (req, res, next) => {
    res.send("3rd Response");
    next();
  }
);


app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
