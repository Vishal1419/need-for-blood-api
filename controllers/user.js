import async from 'async';

import User from '../models/User';
import BloodResponse from '../utils/bloodResponse';

export const registerUser = (req, res) => {
  const user = {
    name: req.body.name,
    address: req.body.address,
    blood_group: req.body.bloodGroup,
    country_code: req.body.countryCode,
    mobile_no: req.body.mobileNo,
    profile_pic: req.body.profilePicture
  }

  User.createUser(user, (err, user) => {
    const bloodResponse = new BloodResponse(res);
    if (err) {
      console.error(err);
      return bloodResponse.setStatusCode(BloodResponse.DATABASE_ERROR).send();
    }
    bloodResponse.setStatusCode(BloodResponse.SUCCESS_CODE).setResponseBody({ user: user }).send();
  });
}