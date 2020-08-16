require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());
const url = process.env.CONNECTION_URL;
mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true });
var conn = mongoose.connection;
const userRouter = require('./routes/userHandler');
const complaintRouter = require('./routes/complaintHandler');

app.use('/userHandler', userRouter);
app.use('/complaintHandler', complaintRouter);

conn.on('open', () => {
  console.log('Connected to MongoDB');
});

conn.on('error', () => {
  console.log('Error in Connecting MongoDB');
});

app.listen(process.env.SERVER_PORT_NUMBER, () => {
  console.log('Server is Listening');
});
