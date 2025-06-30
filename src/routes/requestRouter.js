const express = require('express');
const { userAuth } = require('../middlewares/auth');
const User = require('../models/user');
const connectionRequestModel = require('../models/connectionRequest');
const requestRouter = express.Router();

requestRouter.post(
  '/request/send/:status/:toUserId',
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.loggedInUser._id;
      const { toUserId, status } = req.params;
      //* checking if the status is valid or not
      const allowedStatus = ['ignored', 'interested'];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: 'Invalid status type: ' + status });
      }
      //* check if the toUserId actually exist in our DB
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: 'User not found!' });
      }
      //* check if already a connectionrequest exist between the two user
      const existingConnectionRequest = await connectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res
          .status(400)
          .send({ message: 'Connection Request Already Exists!!!' });
      }
      //* Now save the data to collection
      const connectionRequest = new connectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      //* send a response to user that connection request was sent successfully
      res.json({
        message:
          req.loggedInUser.firstName +
          ' is ' +
          status +
          ' in ' +
          toUser.firstName,
        data,
      });
    } catch (err) {
      res.status(400).send('ERROR: ' + err.message);
    }
  }
);

requestRouter.post(
  '/request/review/:status/:requestId',
  userAuth,
  async (req, res) => {
    try {
      //* get the loggedin user
      const loggedInUser = req.loggedInUser;
      const { status, requestId } = req.params;
      //* check if request has valid status
      const allowedStatus = ['accepted', 'rejected'];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ messaage: 'Status not allowed!' });
      }
      //* check if there exits a connection where someone has interest on loggedin user
      const connectionRequest = await connectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: 'interested',
      });

      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: 'Connection request not found' });
      }
      //* set the new status
      connectionRequest.status = status;
      //* save the connectionRequest with changed status
      const data = await connectionRequest.save();
      //* send a msg that requested was accepted or rejected
      res.json({ message: 'Connection request ' + status, data });
    } catch (err) {
      res.status(400).send('ERROR: ' + err.message);
    }
  }
);
module.exports = requestRouter;
