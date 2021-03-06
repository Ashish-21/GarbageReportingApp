/* Model for storing Complaint in MongoDB */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const complaintSchemaModel = new Schema({
  userId: {
    type: 'String',
    required: true,
    trim: true,
  },
  status: {
    type: Number,
    required: true,
    default: 0,
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
module.exports = mongoose.model('complaintModel', complaintSchemaModel);
