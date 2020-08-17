/* Complaint Handler handles all the request for handling Garbage Reporting complaint data  */
const express = require('express');
const complaintRouter = express.Router();
const jwt = require('jsonwebtoken');
const complaintModel = require('../models/complaintModel');
const multer = require('multer'); //Using Multer to store files on Server

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

/* Saving the complaint data in DB */
complaintRouter.post(
  '/savecomplaint',
  authenticateToken,
  uploadFile.single('complaintImage'),
  async (req, res) => {
    console.log(
      '[complaintHandler.js] Entering Post Call for Saving Complaint Data in DB'
    );
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
      console.log(
        '[complaintHandler.js] Error Occurred in Saving Complaint Data' + error
      );
      res.json({
        message: 'Error Occurred in Saving Complaint Data' + error,
      });
    }
    console.log(
      '[complaintHandler.js] Existing Post Call for Saving Complaint Data in DB'
    );
  }
);

/* Changing the status of complaint in DB */
complaintRouter.put('/changeStatus', authenticateToken, async (req, res) => {
  console.log(
    '[complaintHandler.js] Entering update Call for changing status of  Complaint Data in DB'
  );
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
          message: 'Status of Complaint changed Successfully',
          updatedComplaint: result,
        });
      });
  } catch (error) {
    console.log(
      '[complaintHandler.js] Error Occurred in Changing Status of Complaint' +
        error
    );
    res.json({
      message: 'Error Occurred in Changing Status of Complaint' + error,
    });
  }
  console.log(
    '[complaintHandler.js] Existing update Call for changing status of  Complaint Data in DB'
  );
});

/* Updating the Complaint Data in DB */
complaintRouter.put(
  '/updateComplaint',
  authenticateToken,
  uploadFile.single('complaintImage'),
  async (req, res) => {
    console.log(
      '[complaintHandler.js] Entering update Call for updating  Complaint Data in DB'
    );
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
    } catch (error) {
      console.log(
        '[complaintHandler.js] Error Occurred in updating data of Complaint' +
          error
      );
      res.json({
        message: 'Error Occurred in updating data of Complaint' + error,
      });
    }

    console.log(
      '[complaintHandler.js] Existing update Call for changing status of  Complaint Data in DB'
    );
  }
);

/* Deleting the complaint from DB  */
complaintRouter.delete('/deleteComplaint', async (req, res) => {
  console.log(
    '[complaintHandler.js] Entering delete Call for deleting Complaint Data in DB'
  );
  try {
    await complaintModel.findByIdAndRemove(req.body._id).then((result) => {
      res.status(201).json({
        message: 'Complaint Deleted Successfully',
        deletedComplaint: result,
      });
    });
  } catch (error) {
    console.log(
      '[complaintHandler.js] Error Occurred in Deleting Complaint' + error
    );
    res.json({
      message: 'Error Occurred in Deleting Complaint' + error,
    });
  }
  console.log(
    '[complaintHandler.js] Existing delete Call for deleting Complaint Data in DB'
  );
});

/* Utitlity to verify Authorization token */
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
