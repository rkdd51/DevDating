const mongoose = require('mongoose');

//This file is responsible for establishing a connection between the server mongodb and the backend nodejs server.
const connectDB = async () => {
    await mongoose.connect(
     "mongodb+srv://devdating:vSAHu2xzIP366GiZ@devdating.h4did.mongodb.net/devdating"
   );
}


module.exports = connectDB;

