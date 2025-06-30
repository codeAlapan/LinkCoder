const mongoose = require('mongoose');

const connectDB = async () => {
  await mongoose.connect(
    'mongodb+srv://namastedev:3BkwPzVuxHx1o9hX@namastenode.o8fjc.mongodb.net/devTinder'
  );
};

module.exports = connectDB;
