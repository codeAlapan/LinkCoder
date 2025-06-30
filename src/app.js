const express = require('express');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database');


const app = express(); //creating a web server

//* Body parser middleware => json data to js object
app.use(express.json()); //as there are no routes,so it takes every request and converts req.body into a readable js object format from a raw stream
app.use(cookieParser());

const authRouter = require('./routes/authRouter');
const profileRouter = require('./routes/profileRouter');
const requestRouter = require('./routes/requestRouter');
const userRouter = require('./routes/userRouter');

app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);
app.use('/',userRouter);



connectDB()
  .then(() => {
    console.log('Database connection established.....');
    app.listen(7777, () => {
      console.log('Server is successfully listening on port no 7777');
    });
  })
  .catch((err) => {
    console.log("Database can't be connected!!");
  });
