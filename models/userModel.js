const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchemaModel = new Schema({
  username: {
    type: 'String',
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: 'String',
    required: true,
    trim: true,
  },
  emailId: {
    type: 'String',
    required: true,
    trim: true,
  },
});

module.exports = mongoose.model('userModel', userSchemaModel);
