/* User Handler handles all the  request for Handling User Data */
const express = require('express');
const userRouter = express.Router();
const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken'); //Using JWT for Auth
const Bcrypt = require('bcryptjs'); //Using Bcrypt for Hashing Password

/* Registering User  */
userRouter.post('/register', async (req, res) => {
  console.log('[userHandler.js] Entering Post Call for Registering User in DB');
  try {
    req.body.password = Bcrypt.hashSync(req.body.password, 10);
    var user = new UserModel(req.body);
    var registerUser = await user.save().then((result) => {
      res.status(201).json({
        message: 'User Registered Successfully',
      });
    });
  } catch (error) {
    console.log(
      '[userHandler.js] Error Occurred Post Call for Registering User in DB' +
        error
    );
    res.json({
      message: 'Error Occurred in Registration of User' + error,
    });
  }
  console.log('[userHandler.js] Existing Post Call for Registering User in DB');
});

/* Fetching List of users from DB */
userRouter.get('/listUsers', verifyToken, async (req, res) => {
  console.log('[userHandler.js] Entering Get List of  Users in DB');
  try {
    const Users = await UserModel.find().then((result) => {
      res.status(201).json({
        message: 'List of Users',
        users: result,
      });
    });
  } catch (error) {
    console.log('[userHandler.js] Error Occurred in list User' + error);
    res.json({
      message: 'Error Occurred in getting list of users' + error,
    });
  }
  console.log('[userHandler.js] Existing Get List of  Users in DB');
});

/* Updating User Details in DB */
userRouter.put('/updateUsers', async (req, res) => {
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
      res.status(201).json({
        message: 'User Updated Successfully',
      });
    });
  } catch (error) {
    console.log('[userHandler.js] Error Occurred in list User' + error);
    res.json({
      message: 'Error Occurred in Updating User' + error,
    });
  }
  console.log('[userHandler.js] Existing  Update User in DB');
});

/* Login of user and providing authorization token  */
userRouter.post('/login', async (req, res) => {
  console.log('[userHandler.js] Entering Login of User');
  try {
    const user = await UserModel.findOne({
      username: req.body.username,
    });
    if (!user) {
      return res.status(400).send({ message: 'The username does not exist' });
    } else if (!Bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(400).send({ message: 'The password is invalid' });
    } else {
      //Generate JWT Token for user
      const userTokenData = {
        _id: user._id,
        username: user.username,
        password: user.password,
      };
      const accessToken = jwt.sign(userTokenData, process.env.SECRETKEY);
      res.json({
        message: 'Login Successful',
        accessToken: accessToken,
      });
    }
  } catch (error) {
    res.json({
      message: 'Error Occurred in Login of User' + error,
    });
  }
  console.log('[userHandler.js] Existing Login of User');
});

/* Utility to verify token retrieve for request */
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).end();
  }
  jwt.verify(token, process.env.SECRETKEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.userTokenData = user;
    next();
  });
}

module.exports = userRouter;
