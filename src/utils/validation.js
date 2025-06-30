//  in this file we will write all of the validation function required for our app
const validator = require('validator');

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  //* case1: validating firstName and lastName
  if (!firstName || !lastName) {
    throw new Error('Name is not valid');
  } else if (!validator.isEmail(emailId)) {
    throw new Error('Email is not valid');
  } else if (!validator.isStrongPassword(password)) {
    throw new Error('Please enter a strong password');
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    'firstName',
    'lastName',
    'emailId',
    'photoUrl',
    'gender',
    'age',
    'about',
    'skills',
  ];
  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  return isEditAllowed;
};

const validateEditProfilePassword = (req) => {
   if(!validator.isStrongPassword(req.body.password)){
    throw new Error('Please enter a strong password');
   }

}

module.exports = { validateSignUpData, validateEditProfileData,validateEditProfilePassword };
