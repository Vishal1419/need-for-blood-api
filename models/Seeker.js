import mongoose from 'mongoose';
import User from './User';

const Schema = mongoose.Schema;

const seekerSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  geometry: { 
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere' }
  },
  bloodGroups: [{ type: Schema.Types.ObjectId, ref: 'BloodGroup' }]  
});

const Seeker = mongoose.model('Seeker', seekerSchema, 'seekers');

Seeker.getAll = (callback) => {
  Seeker.find().populate('user').populate('bloodGroups').exec((err, seekers) => {
    callback(err, seekers);
  });
};

Seeker.getById = (id, callback) => {
  Seeker.findById(id, (err, seeker) => {
    callback(err, seeker);
  });
};

Seeker.getByMobileNo = (countryCode, mobileNo, callback) => {
  User.getByMobileNo(countryCode, mobileNo, (err, user) => {
    if (err) return callback(err);
    Seeker.find({ user: user }).populate('user').populate('bloodGroups').exec((err, seekers) => {
      callback(err, seekers);
    });
  });
};

Seeker.getWithinXKms = (user, bloodGroups, longitude, latitude, distance, callback) => {
  Seeker.aggregate()
        .near({ 
          near: { 
            type: 'Point', 
            coordinates: [longitude, latitude] 
          }, 
          distanceField: 'dist.calculated', 
          maxDistance: distance * 1000, 
          spherical: true, 
          query: {
            user: { $ne: user._id },
            bloodGroups: { $in: bloodGroups }
          }
        }).exec((err, seekers) => {
    if (err) return callback(err);
    Seeker.populate(seekers, { path: 'user' }, (err, seekersWithUserInfo) => {
      if (err) return callback(err);
      Seeker.populate(seekersWithUserInfo, { path: 'bloodGroups' }, (err, seekersWithUserInfoAndBloodGroups) => {
        callback(err, seekersWithUserInfoAndBloodGroups);
      });
    });
  });
}

Seeker.createSeeker = (seeker, callback) => {
  const newSeeker = new Seeker(seeker)
  newSeeker.save(callback);
};

Seeker.updateSeeker = (seeker, callback) => {
  Seeker.findOneAndUpdate(
    { "_id": seeker._id },
    {
      "$set": {
        "user": seeker.user,
        "geometry": seeker.geometry,
        "bloodGroups": seeker.bloodGroups
      }
    },
    { new: true }
  ).populate('user').populate('bloodGroups').exec((err, updatedSeeker) => {
    callback(err, updatedSeeker);
  });
};

Seeker.deleteSeeker = (id, callback) => {
  Seeker.findByIdAndRemove(id, (err, seeker) => {
    callback(err, seeker._id);
  });
}

export default Seeker;
