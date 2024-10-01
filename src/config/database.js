const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect(
     "mongodb+srv://devdating:vSAHu2xzIP366GiZ@devdating.h4did.mongodb.net/devdating"
   );
}


module.exports = connectDB;

