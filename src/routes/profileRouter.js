const express = require('express');
const { userAuth } = require('../middlewares/auth');
const {
  validateEditProfileData,
  validateEditProfilePassword,
} = require('../utils/validation');
const bcrypt = require('bcrypt');

const profileRouter = express.Router();

profileRouter.get('/profile/view', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.loggedInUser;
    res.send(loggedInUser);
  } catch (err) {
    res.status(400).send('Error : ' + err.message);
  }
});

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error('Invalid Edit Request');
    }
    const loggedInUser = req.loggedInUser;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfuly`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send('ERROR : ' + err.message);
  }
});

profileRouter.patch('/profile/password', userAuth, async (req, res) => {
  try {
    validateEditProfilePassword(req);
    const { password } = req.body;
    const loggedInUser = req.loggedInUser;
    const passwordHash = await bcrypt.hash(password, 10);
    loggedInUser.password = passwordHash;
    await loggedInUser.save();

    res.json({
      message: 'Password updated successfully',
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send('ERROR : ' + err.message);
  }
});

module.exports = profileRouter;
