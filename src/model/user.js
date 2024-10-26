const mongoose = require("mongoose");
var validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Schema and its validation 
const userSchema = mongoose.Schema(
  {
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
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email");
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
      max: 65,
    },
    gender: {
      type: String,
      validate: {
        validator: (value) => {
          return ["male", "female", "other"].includes(value.toLowerCase());
        },
        message:
          "{VALUE} is not a valid gender and this is not a generated message.",
      },
      // required: true,
    },
    skills: {
      type: [String],
      default: ["javascript"],
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Validation through schema methods provided by mongoose , this is responsible for JWT validation. NOTE: This can also be managed through the API level validation
userSchema.methods.getJWT = async function () {
  const token = await jwt.sign({ _id: this._id }, "PrivateKey", {
    expiresIn: "7d",
  });
  return token;
};

//Validation through schema methods provided by mongoose , this is responsible for password validation.
userSchema.methods.getPasswordVerified = async function (passwordInputByUser) {
  const isPasswordMatch = await bcrypt?.compare(
    passwordInputByUser,
    this.password
  );
  if (!isPasswordMatch) {
    return res.status(400).send("Invalid Credentials");
  }
  return isPasswordMatch;
};

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
