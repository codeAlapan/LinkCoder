const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {
  try {
    //*  read the token from req.cookies
    const { token } = req.cookies;
    if (!token) {
      throw new Error('Token is not valid!!!!!');
    }
    //*  validate my token
    const decodedObj = await jwt.verify(token, 'lionelmessi10');
    // console.log(decodedObj);
    //* getting info about the logged in user
    const { _id } = decodedObj;

    const loggedInUser = await User.findById(_id);

    if (!loggedInUser) {
      throw new Error('User is not Logged In');
    }
    req.loggedInUser = loggedInUser; //adding one property to return the found user so that we dont have to do that again
    next();
  } catch (err) {
    res.status(400).send('Error : ' + err.message);
  }
};
module.exports = {
  userAuth,
};
