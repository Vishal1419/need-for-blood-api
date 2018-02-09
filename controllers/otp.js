import async from 'async';

import OTPInfo from '../models/OTPInfo';
import User from '../models/User';
import BloodResponse from '../utils/bloodResponse';
import twilio from '../config/twilio';

export const saveOTPInfo = (req, res) => {
  async.waterfall([
    (callback) => {
      OTPInfo.getByMobileNo(req.body.countryCode, req.body.mobileNo, (err, OTPInfos) => {
        if (err) {
          console.error(err);
          return callback(err);
        }
        callback(null, OTPInfos);
      })
    },
    (OTPInfos, callback) => {
      if (OTPInfos.length > 0) {
        //OTP already exists. so, delete it
        OTPInfo.deleteOTPInfo(OTPInfos[0]._id, (err, deletedOTPInfoId) => {
          if (err) {
            console.error(err);
            return callback(err);
          }
          return callback(null);
        })
      } else {
        callback(null)
      }
    },
    (callback) => {
      //generate otp
      const newOTP = Math.floor(100000 + Math.random() * 900000);
      console.log(newOTP);
      callback(null, newOTP);
    },
    (newOTP, callback) => {
      //send SMS using Twilio
      twilio.messages.create({
        body: `Your OTP is ${newOTP}`,
        to: req.body.countryCode + req.body.mobileNo,
        from: '+19728611015'
      }).then(() => {
        callback(null, newOTP)
      });
    },
    (newOTP, callback) => {
      OTPInfo.createOTPInfo({
        country_code: req.body.countryCode,
        mobile_no: req.body.mobileNo,
        otp: newOTP,
        no_of_trials: 0
      }, (err) => {
        if (err) {
          console.error(err);
          return callback(err);
        }
        return callback(null, 'done')
      });
    }
  ], (err, response) => {
    const bloodResponse = new BloodResponse(res);

    if (err) {
      return bloodResponse.setStatusCode(BloodResponse.DATABASE_ERROR).send();
    }
    if (response === 'done') {
      return bloodResponse.setStatusCode(BloodResponse.SUCCESS_CODE)
                          .setResponseBody({
                            countryCode: req.body.countryCode,
                            mobileNo: req.body.mobileNo
                           })
                          .send();
    }
    bloodResponse.setStatusCode(BloodResponse.UNKNOWN_ERROR).send();
  });
}

export const verifyOTP = (req, res) => {
  OTPInfo.getByMobileNo(req.body.countryCode, req.body.mobileNo, (err, OTPInfos) => {
    const bloodResponse = new BloodResponse(res);
    if (err) {
      console.error(err);
      return bloodResponse.setStatusCode(BloodResponse.SUCCESS_CODE).send();
    } 
    if (OTPInfos.length > 0) {
      const otpVerified = OTPInfos[0].otp === req.body.otp;
      if (otpVerified) {
        User.getByMobileNo(req.body.countryCode, req.body.mobileNo, (err, user) => {
          return bloodResponse.setStatusCode(BloodResponse.SUCCESS_CODE)
                              .setResponseBody({
                                OTPVerified: true,
                                user: user && user.length > 0 ? user[0] : {}
                              })
                              .send();
        });
      } else {
        return bloodResponse.setStatusCode(BloodResponse.SUCCESS_CODE)
                            .setResponseBody({ 
                              OTPVerified: false,
                              user: {}
                            })
                            .send();
      }
    } else {
      bloodResponse.setStatusCode(BloodResponse.UNKNOWN_ERROR).send();
    }
  })
}