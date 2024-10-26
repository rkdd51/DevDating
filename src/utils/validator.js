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

//Common helper function for validating edit profile information
const validateEditData = (req) => {
    const isEditProfileAllowed = ["firstName", "lastName", "skills"]
    const isAllowed = Object.keys(req.body).every(val => isEditProfileAllowed.includes(val));
    return isAllowed
};

//Common helper function to match edit profile password
const validatePassword = (req) => {
    const { password } = req.body;
    if (!validator.isStrongPassword(password)) {
        throw new Error("Password must be strong")
    }
    return true;
}


module.exports = { validateSignUpData, validateEditData, validatePassword };