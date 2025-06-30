const express = require('express');
const { userAuth } = require('../middlewares/auth');
const connectionRequestModel = require('../models/connectionRequest');
const User = require('../models/user');

const userRouter = express.Router();

//* setting which data are required to show to the loggedin user
const USER_SAFE_DATA = 'firstName lastName photoUrl age gender about skills ';

//* Get all the pending connection request for the loggedIn user
userRouter.get('/user/requests/received', userAuth, async (req, res) => {
  try {
    //* get the loggedin user
    const loggedInUser = req.loggedInUser;
    //* find all the requests which was sent to the loggedin user & send only allowed fields
    const connectionRequests = await connectionRequestModel
      .find({ toUserId: loggedInUser._id, status: 'interested' })
      .populate('fromUserId', USER_SAFE_DATA);
    // .populate("fromUserId",[ "firstName", "lastName", "photoUrl", "age" ,"gender" ,"about" ,"skills" ,"-_id"])

    res.json({
      message: 'Data fetched successfully',
      data: connectionRequests,
    });
  } catch (err) {
    res.status(404).json({ message: 'Error: ' + err.message });
  }
});

//* Get all the accepted connection request for the loggedIn user
userRouter.get('/user/connections', userAuth, async (req, res) => {
  try {
    // get the loggedIn user
    const loggedInUser = req.loggedInUser;
    // get all the connections
    const connectionRequests = await connectionRequestModel
      .find({
        $or: [
          { fromUserId: loggedInUser._id, status: 'accepted' },
          { toUserId: loggedInUser._id, status: 'accepted' },
        ],
      })
      .populate('fromUserId', USER_SAFE_DATA)
      .populate('toUserId', USER_SAFE_DATA);

    // console.log(connectionRequests);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      } else {
        return row.fromUserId;
      }
    });

    res.json({ data });
  } catch (err) {
    res.status(404).json({ message: 'Error: ' + err.message });
  }
});

userRouter.get('/user/feed', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.loggedInUser;

    //* from req.query get the values of no of pages to skip and how may people to show
    // console.log(req.query);
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    //* get all the connections associated with loggedIn user
    const connectionRequests = await connectionRequestModel.find(
      {
        $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      },
      'fromUserId toUserId'
    );
    // .select('fromUserId toUserId');

    //* store all the userIds into a set which we dont have to include in the feed
    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    //* find the other users to show in the feed(including not himself)
    const feedUsers = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({ data: feedUsers });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = userRouter;
