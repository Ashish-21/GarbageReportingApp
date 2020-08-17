require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());
const url = process.env.CONNECTION_URL;
mongoose.connect(url, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
}); //Connecting MongoDB using Mongoose
var conn = mongoose.connection; //Obtaining Connection Object

const userRouter = require('./routes/userHandler');
const complaintRouter = require('./routes/complaintHandler');

app.use('/userHandler', userRouter); //Route all request of  User Handling Data to userRouter
app.use('/complaintHandler', complaintRouter); //Route all request of  Complaint Handling Data to complaintRouter

conn.on('open', () => {
  console.log('Connected to MongoDB');
});

conn.on('error', () => {
  console.log('Error in Connecting MongoDB');
});

app.listen(process.env.SERVER_PORT_NUMBER, () => {
  //listening to server
  console.log('Server is Listening');
});
