const express = require('express');
const router = express.Router();
const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const Bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');

//Registering User
router.post('/register', async (req, res) => {
  console.log('[userHandler.js] Entering Post Call for Registering User in DB');
  try {
    req.body.password = Bcrypt.hashSync(req.body.password, 10);
    var user = new UserModel(req.body);
    var registerUser = await user.save();
    if (registerUser != null) {
      console.log('User Saved in DB');
      res.json(registerUser);
    } else {
      res.send('Error occurred in saving user in DB');
    }
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
router.get('/listUsers', verifyToken, async (req, res) => {
  console.log('[userHandler.js] Entering Get List of  Users in DB');
  try {
    if (req.userTokenData.username === 'admin') {
      const Users = await UserModel.find();
      res.json(Users);
    }
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

//login using jwt
router.post('/login', async (req, res) => {
  console.log('[userHandler.js] Login of User');
  if (!req.body) {
    return res.status(400).send({
      message: 'Data can not be empty!',
    });
  }
  try {
    const user = await UserModel.findOne({
      username: req.body.username,
    }).exec();
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
      res.send({
        message: 'Login Successful',
        accessToken: accessToken,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log(token);
  if (!token) {
    return res.status(401).end();
  }
  jwt.verify(token, process.env.SECRETKEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.userTokenData = user;
    next();
  });
}

module.exports = router;
