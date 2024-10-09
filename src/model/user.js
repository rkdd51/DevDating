const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    minLength: 3,
    required: true,
  },
  lastName: {
    type: String,
    minLength: 3,
    // required: true,
  },
  emailId: {
    type: String,
    // required: true, 
    unique: true,
  },
  password: {
    type: String,
    // required: true,
  },
  age: {
    type: Number,
    min: 18,
    max:65,
    // required: true,
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
