const express = require('express');
const router = express.Router();
const UserModel = require('../models/userModel');
const { response } = require('express');
const Bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
//Registering User
router.post('/register', async (req, res) => {
  console.log('[userHandler.js] Entering Post Call for Registering User in DB');
  if (!req.body) {
    return res.status(400).send({
      message: 'Data can not be empty!',
    });
  }
  try {
    req.body.password = Bcrypt.hashSync(req.body.password, 10);
    var user = new UserModel(req.body);
    var registerUser = await user.save((err, user) => {
      if (!err) {
        res.json(registerUser);
      } else {
        console.log('Error Occurred');
      }
    });
  } catch (error) {
    console.log(
      '[userHandler.js] Error Occurred Post Call for Registering User in DB' +
        error
    );
    response.send('Error Occurred' + error);
  }
  console.log('[userHandler.js] Existing Post Call for Registering User in DB');
});

//List of Users from DB
router.get('/listUsers', async (req, res) => {
  console.log('[userHandler.js] Entering Get List of  Users in DB');
  try {
    const Users = await UserModel.find();
    res.json(Users);
  } catch (error) {
    console.log('[userHandler.js] Error Occurred in list User' + error);
    response.send('Error Occurred:' + error);
  }
  console.log('[userHandler.js] Existing Get List of  Users in DB');
});

//updating user in DB
router.put('/updateUsers', async (req, res) => {
  console.log('[userHandler.js] Entering  Update User in DB');
  if (!req.body) {
    return res.status(400).send({
      message: 'Data can not be empty!',
    });
  }
  try {
    const query = {
      username: req.body.username,
    };
    req.body.password = Bcrypt.hashSync(req.body.password, 10);
    const options = {
      returnNewDocument: true,
    };
    await UserModel.findOneAndUpdate(query, req.body, options).then(() => {
      res.send('user updated');
    });
  } catch (error) {
    console.log('[userHandler.js] Error Occurred in list User' + error);
    response.send('Error Occurred:' + error);
  }
  console.log('[userHandler.js] Existing  Update User in DB');
});

module.exports = router;
