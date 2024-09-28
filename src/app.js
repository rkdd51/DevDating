const express = require("express");

const app = express();


app.get("/user", (req, res) => {
    res.send({
      name: "Rahul",
      method: "GET",
    });
});
app.post("/user", (req, res) => {
  res.send({
    name: "Rahul",
    method: "POST",
  });
});

app.put("/user", (req, res) => {
   res.send({
     name: "Rahul",
     method: "PUT",
   });
});

app.delete("/user", (req, res) => {
   res.send({
     name: "Rahul",
     method: "DELETE",
   });
});

app.use("/user", (req, res) => {
  res.send("Hello User!");
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
