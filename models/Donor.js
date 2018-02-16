import mongoose from 'mongoose';
import User from './User';

const Schema = mongoose.Schema;

const donorSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  geometry: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere' }
  },
  bloodGroups: [{ type: Schema.Types.ObjectId, ref: 'BloodGroup' }]
});

const Donor = mongoose.model('Donor', donorSchema, 'donors');

Donor.getAll = (callback) => {
  Donor.find().populate('user').populate('bloodGroups').exec((err, donors) => {
    callback(err, donors);
  });
};

Donor.getById = (id, callback) => {
  Donor.findById(id, (err, donor) => {
    callback(err, donor);
  });
};

Donor.getByMobileNo = (countryCode, mobileNo, callback) => {
  User.getByMobileNo(countryCode, mobileNo, (err, user) => {
    if (err) return callback(err);
    Donor.find({ user: user }).populate('user').populate('bloodGroups').exec((err, donors) => {
      callback(err, donors);
    });
  });
};

Donor.getWithinXKms = (user, bloodGroups, longitude, latitude, distance, callback) => {
  Donor.aggregate()
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
           bloodGroups: { $in : bloodGroups }
         } 
       }).exec((err, donors) => {
    if (err) return callback(err);
    Donor.populate(donors, { path: 'user' }, (err, donorsWithUserInfo) => {
      if (err) return callback(err);
      Donor.populate(donorsWithUserInfo, { path: 'bloodGroups' }, (err, donorsWithUserInfoAndBloodGroups) => {
        callback(err, donorsWithUserInfoAndBloodGroups);
      });
    });
  });
}

Donor.createDonor = (donor, callback) => {
  const newDonor = new Donor(donor)
  newDonor.save(callback);
};

Donor.updateDonor = (donor, callback) => {
  Donor.findOneAndUpdate(
    { "_id": donor._id },
    {
      "$set": {
        "user": donor.user,
        "geometry": donor.geometry,
        "bloodGroups": donor.bloodGroups
      }
    },
    { new: true }
  ).populate('user').populate('bloodGroups').exec((err, updatedDonor) => {
    callback(err, updatedDonor);
  });
};

Donor.deleteDonor = (id, callback) => {
  Donor.findByIdAndRemove(id, (err, donor) => {
    callback(err, donor._id);
  });
}

export default Donor;
