const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const complaintSchemaModel = new Schema({
  userId: {
    type: 'String',
    required: true,
    trim: true,
    unique: true,
  },
  status: {
    type: Number,
    required: true,
    trim: true,
    unique: true,
  },
  address: {
    type: 'String',
    trim: true,
  },
  filename: {
    type: 'String',
    trim: true,
  },
  description: {
    type: 'String',
    trim: true,
  },
  latitude: {
    type: Number,
    trim: true,
  },
  longitude: {
    type: Number,
    trim: true,
  },
});
