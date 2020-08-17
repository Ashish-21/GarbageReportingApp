const express = require('express');
const complaintRouter = express.Router();
const jwt = require('jsonwebtoken');
const complaintModel = require('../models/complaintModel');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const Randnumber = Math.floor(Math.random() * Math.floor(100000));
    cb(null, Randnumber + file.originalname);
  },
});
const uploadFile = multer({ storage: storage });
complaintRouter.get('/complaint', (req, res) => {
  console.log('hello');
  res.send('hello');
});

complaintRouter.post(
  '/savecomplaint',
  authenticateToken,
  uploadFile.single('complaintImage'),
  async (req, res) => {
    try {
      const complaint = new complaintModel({
        userId: req.userTokenData._id,
        status: req.body.status,
        address: req.body.address,
        filename: req.file.filename,
        description: req.body.description,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
      });
      await complaint.save().then((result) => {
        res.status(201).json({
          message: 'Complaint Registered Successfully',
          complaint: complaint,
        });
      });
    } catch (error) {
      console.log('Error Occurred');
    }
  }
);

complaintRouter.put('/changeStatus', authenticateToken, async (req, res) => {
  try {
    const query = {
      _id: req.body._id,
    };
    const updateStatus = {
      status: req.body.status,
    };
    const updatedComplaint = await complaintModel
      .findOneAndUpdate(query, updateStatus, {
        new: true,
      })
      .then((result) => {
        res.status(201).json({
          message: 'Complaint Registered Successfully',
          updatedComplaint: result,
        });
      });
  } catch (error) {}
});

complaintRouter.put(
  '/updateComplaint',
  authenticateToken,
  uploadFile.single('complaintImage'),
  async (req, res) => {
    try {
      const query = {
        _id: req.body._id,
      };
      console.log(req.file);
      req.body.filename = req.file.originalname;
      const updatedComplaint = await complaintModel
        .findOneAndUpdate(query, req.body, {
          new: true,
        })
        .then((result) => {
          res.status(201).json({
            message: 'Complaint Updated Successfully',
            updatedComplaint: result,
          });
        });
    } catch (error) {}
  }
);

complaintRouter.delete('/deleteComplaint', async (req, res) => {
  try {
    await complaintModel.findByIdAndRemove(req.body._id).then((result) => {
      res.status(201).json({
        message: 'Complaint Deleted Successfully',
        deletedComplaint: result,
      });
    });
  } catch (error) {}
});

function authenticateToken(req, res, next) {
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

module.exports = complaintRouter;
