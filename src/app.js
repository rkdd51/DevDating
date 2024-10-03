const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./model/user")

app.use(express.json()); //Using this middleware to convert json object to javascript object 

app.post('/signup', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save()
    res.send("Data added successfully")
  } catch (err) {
    console.log("Error saving user");
  }
})

   connectDB()
     .then(() => {      
       console.log("Database connection established");
        app.listen(3000, () => {
          console.log("Server is running on port 4000");
        });
     })
     .catch((error) => {
       console.log("Database connection failed: +++++", error);
     });

