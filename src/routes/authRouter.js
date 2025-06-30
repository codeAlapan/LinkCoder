const express = require('express');
const { validateSignUpData } = require('../utils/validation');
const bcrypt = require('bcrypt');
const User = require('../models/user');




const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => {
  try {
    //* validation of data
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;

    //* Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    // console.log(passwordHash);

    //* Creating a new instance of the User model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send('user added successfully');
  } catch (err) {
    res.status(400).send('error saving the user:' + err.message);
  }
});

authRouter.post('/login', async (req, res) => {
    try {
      const { emailId, password } = req.body;
  
      //* Find the user with the same emailId
      const user = await User.findOne({ emailId: emailId });
  
      //* handling the case if user doesn't exist
      if (!user) {
        throw new Error('Invalid credentials');
      }
      //* find if password is valid or not
      // console.log(user);
      const isPasswordValid = await user.validatePassword(password);
      //* if valid user => login
      if (isPasswordValid) {
        //* Create a JWT Token using the schema-methods
        /* // w/o schema methods
        const token = await jwt.sign({ _id: user._id }, 'lionelmessi10', {
          expiresIn: '7d',
        });
        */
       
        const token = await user.getJWT();
        // console.log(token);
  
        //* Add the token to cookie and send the response back to the user
        // res.cookie('token', 'eeeeeetfvjsssscbj'); here we are passing dummy token
        res.cookie('token', token, {
          expires: new Date(Date.now() + 7 + 3600000),
        }); //passing the jwt token,where the cookie name is 'token'
  
        res.send('Login Successful!!!');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err) {
      // console.log(err);
      res.status(400).send('Error : ' + err.message);
    }
  });

authRouter.post('/logout', async (req,res) => {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
    }).send("Logout Successful!!"); //we used method of chaining ,or else we could have also written re.send separately
});

module.exports = authRouter;