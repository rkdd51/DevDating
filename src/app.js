const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./model/user");

app.use(express.json()); //Using this middleware to convert json object to javascript object

// //Find by Id and update
app.patch('/user', async(req, res) => {
  const user = req?.body?.userId;
  const updatedBody = req?.body;
  try {
    let updatedUser = await User.findByIdAndUpdate(user, updatedBody, {
      returnDocument: "before",
      runValidators:true,
    });
    res.send("Data updated successfully");
  } catch (err) {
    console.log(err);
  }
});


//Find by id and delete
app.delete('/user', async (req, res) => {
  try {
    let userId = req.body.userId;
    if (!userId) {
      return res.status(400).send("No user id provided");
    } else {
      let user = await User.findByIdAndDelete(userId);
        res.send("User deleted successfully"); 
    }
  } catch (err) {
    console.log(err);
  }
})

// User that gets all user data from database
app.get('/feed', async(req, res) => {
  try {
    let users = await User.find()
    res.send(users);
  } catch (err) {
    console.log(err);
  }
})


// User that gets one user data from database
app.get("/user", async (req, res) => {
  let userEmail = req.body.emailId;
  try {
    let user = await User.findOne({ emailId: userEmail });
    if (!user) {
      res.send("No Email Found");
    } else {
      res.send(user);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

//User for signup
app.post('/signup', async (req, res) => {
  const user = new User(req.body);
  console.log('user: ', user);
  try {
    await user.save()
    res.send("Data added successfully")
  } catch (err) {
    console.log("Error saving user",err);
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
    console.log("Database connection failed:", error);
  });
