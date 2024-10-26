const validator = require('validator');


//Common helper function for validating required fields
const validateSignUpData = (req) => {
    const { firstName,lastName, emailId, password } = req.body;
    if (!firstName || !lastName) {
        throw new Error("No first name or last name")
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Invalid Credentials")
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Password must be strong")
    }

};

module.exports = { validateSignUpData };