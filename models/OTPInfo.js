import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const otpInfoSchema = new Schema({
  country_code: { type: String, required: true },
  mobile_no: { type: String, required: true },
  otp: { type: String, required: true },
  no_of_trials: { type: Number, required: true }
});

const OTPInfo = mongoose.model('OTPInfo', otpInfoSchema, 'otpInfo');

OTPInfo.getAll = (callback) => {
  OTPInfo.find().exec((err, otpInfos) => {
    callback(err, otpInfos);
  });
};

OTPInfo.getById = (id, callback) => {
  OTPInfo.findById(id, (err, otpInfo) => {
    callback(err, otpInfo);
  });
};

OTPInfo.getByMobileNo = (countryCode, mobile, callback) => {
  OTPInfo.find({ country_code: countryCode, mobile_no: mobile }).sort('mobile_no').exec((err, otpInfos) => {
    callback(err, otpInfos);
  });
};

OTPInfo.createOTPInfo = (otpInfo, callback) => {
  const newOTPInfo = new OTPInfo(otpInfo)
  newOTPInfo.save(callback);
};

OTPInfo.updateOTPInfo = (otpInfo, callback) => {
  OTPInfo.update(
    { "_id": otpInfo._id },
    {
      "$set": {
        "country_code": otpInfo.country_code,
        "mobile_no": otpInfo.mobile_no,
        "otp": otpInfo.otp,
        "no_of_trials": otpInfo.no_of_trials
      }
    },
    { multi: false },
    callback
  );
};

OTPInfo.deleteOTPInfo = (id, callback) => {
  OTPInfo.findByIdAndRemove(id, (err, otpInfo) => {
    callback(err, otpInfo._id);
  })
}

export default OTPInfo;
