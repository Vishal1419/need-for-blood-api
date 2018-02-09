import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  blood_group: { type: String, required: true },
  country_code: { type: String, required: true },
  mobile_no: { type: String, required: true },
  profile_pic: { type: String }
});

const User = mongoose.model('User', userSchema, 'users');

User.getAll = (callback) => {
  User.find().sort('name').exec((err, users) => {
    callback(err, users);
  });
};

User.getById = (id, callback) => {
  User.findById(id, (err, user) => {
    callback(err, user);
  });
};

User.getByName = (name, callback) => {
  User.find({ name: new RegExp('^' + name + '$', "i") }).sort('name').exec((err, users) => {
    callback(err, users);
  });
};

User.getByMobileNo = (countryCode, mobile, callback) => {
  User.find({ country_code: countryCode, mobile_no: mobile }).sort('mobile_no').exec((err, users) => {
    callback(err, users);
  });
};

User.createUser = (user, callback) => {
  const newUser = new User(user)
  newUser.save(callback);
};

User.updateUser = (user, callback) => {
  User.update(
    { "_id": user._id },
    {
      "$set": {
        "name": user.name,
        "address": user.address,
        "blood_group": user.blood_group,
        "country_code": user.country_code,
        "mobile_no": user.mobile_no,
        "profile_pic": user.profile_pic
      }
    },
    { multi: false },
    callback
  );
};

User.deleteUser = (id, callback) => {
  User.findByIdAndRemove(id, (err, user) => {
    callback(err, user._id);
  })
}

export default User;
