'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const jwt = require('jsonwebtoken');

const User = mongoose.model('User');
const Stamp = mongoose.model('Stamp');

let config = require('../../middlewares/config');

/**
 * Function to add a stamp to a user
 */
exports.add_stamp = (req, res) => {
  let requester = req.body._id;
  let customerId = req.body.customerId;
  let stampCountToAdd = req.body.stampsToAdd;
  User.findOne({ _id: requester }, (err, user) => {
    /**
     * Checks if user is an admin.
     * If false, error returned to user.
     */
    if (!user.isAdmin) {
      return res.status(401).json({
        success: false,
        title: 'Stamping failed',
        error: {
          error: err,
          message: 'User not valid'
        }
      });
    }
    /**
     * Finds user to add stamps to in db
     */
    User.findOne({ customerId: customerId }, (err, user) => {
      if (!user) {
        return res.status(500).json({
          success: false,
          title: 'Error finding user to add stamp to'
        });
      }
      let currentStamps = user.current_stamps;
      if (currentStamps < 10) {
        let newTotal = currentStamps + stampCountToAdd;
        if (newTotal < 10) {
          User.updateOne(
            { customerId: customerId },
            { $set: { current_stamps: newTotal } },
            {
              $push: {
                transactions: {
                  stamp_count: stampCountToAdd,
                  created_date: new Date()
                }
              }
            },
            (err, done) => {
              if (err) {
                return res.status(500).json({
                  success: false,
                  title: 'Error adding stamp'
                });
              }
            }
          );
          User.updateOne(
            { customerId: customerId },
            {
              $push: {
                transactions: {
                  stamp_count: stampCountToAdd,
                  created_date: new Date()
                }
              }
            },
            (err, done) => {
              if (err) {
                return res.status(500).json({
                  success: false,
                  title: 'Error adding transaction'
                });
              }
            }
          );
          return res.status(200).json({
            success: true,
            title: 'Stamp added',
            data: {}
          });
        }
      }
      if (currentStamps === 10) {
      }
      // return res.status(200).json({
      //   success: true,
      //   title: 'Stamp added',
      //   data: {}
      // });
    });
  });
};
