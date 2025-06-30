const mongoose = require('mongoose');
const User = require('./user');

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ['ignored', 'interested', 'accepted', 'rejected'],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  { timestamps: true }
);

// connectionRequestModel.find({fromUserId:3868729629862528,toUserId:6369863243659836});

//* implement indexing to implement fast searching
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

//* Handle the case when user tries to send the request to himself
connectionRequestSchema.pre("save", function(next){
  const connectionRequest = this;
  // check if  the fromUserId is same as toUserId
  if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
    throw new Error("Cannot send connection request to yourself!");
  }
  next();
})


//* alternative way of creating and exporting model
const connectionRequestModel = new mongoose.model(
  'ConnectionRequest',
  connectionRequestSchema
);

module.exports = connectionRequestModel;
