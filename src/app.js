const express = require("express");

const app = express();

app.use("/hello", (req, res) => {
  res.send("Hello World");
});

app.use("/test", (req, res) => {
  res.send("Test");
});

app.use("/", (req, res) => {
  res.send("Hello Rahul");
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
