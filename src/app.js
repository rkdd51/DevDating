const express = require("express");
const { authPath, userAuth } = require("./middlewares/auth");

const app = express();

app.use("/admin", authPath, ((req, res) => {
  res.send("Hello from the admin section");
}));

app.use("/getAllData", authPath, (req, res) => {
  res.send("Hello from the admin getAllData");
});

app.get('/user',userAuth, (req, res) => {
  res.send("Hello from the user section");
})


app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
