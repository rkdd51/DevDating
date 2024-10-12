const mongoose = require('mongoose')
var validator = require("validator");

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    minLength: 3,
    required: true,
  },
  lastName: {
    type: String,
    minLength: 3,
  },
  emailId: {
    type: String,
    required: true, 
    unique: true, 
    trim:true,
    validate(value) {
      if (!validator.isEmail(value)){
        throw new Error("Invalid Email")
      }
    }
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    min: 18,
    max:65,
    required: true,
  },
  gender: {
    type: String,
    validate: {
      validator: (value) => {
        return ['male', 'female', 'other'].includes(value.toLowerCase());
      },
      message: '{VALUE} is not a valid gender and this is not a generated message.',
        }
    // required: true,
  },
  skills: {
    type: [String],
    default: ["javascript"],
    required: false,
  },
}, {
  timestamps:true,
});

const userModel = mongoose.model('User', userSchema)

module.exports = userModel;
