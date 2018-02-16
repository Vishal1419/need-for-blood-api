import async from 'async';

import User from '../models/User';
import BloodGroup from '../models/BloodGroup';
import Seeker from '../models/Seeker';
import Donor from '../models/Donor';
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

export const checkIfDonorInSameGroup = (req, res) => {
  async.waterfall([
    (callback) => {
      Donor.getByMobileNo(req.body.countryCode, req.body.mobileNo, (err, donors) => {
        if (err) return callback(err);
        callback(null, donors[0]);
      });
    },
    (donor, callback) => {
      if (donor) {
        const donorBloodGroups = donor.bloodGroups.map(bloodGroup => bloodGroup.name);
        callback(null, donorBloodGroups.includes(req.body.bloodGroup));
      } else {
        callback(null, false);
      }
    }
  ], (err, isDonorInSameBloodGroup) => {
    const bloodResponse = new BloodResponse(res);
    if (err) {
      console.error(err);
      return bloodResponse.setStatusCode(BloodResponse.DATABASE_ERROR).send();
    }
    bloodResponse.setStatusCode(BloodResponse.SUCCESS_CODE).setResponseBody({ isDonorInSameBloodGroup: isDonorInSameBloodGroup }).send();
  });
}

export const checkIfSeekerInSameGroup = (req, res) => {
  async.waterfall([
    (callback) => {
      Seeker.getByMobileNo(req.body.countryCode, req.body.mobileNo, (err, seekers) => {
        if (err) return callback(err);
        callback(null, seekers[0]);
      });
    },
    (seeker, callback) => {
      if (seeker) {
        const seekerBloodGroups = seeker.bloodGroups.map(bloodGroup => bloodGroup.name);
        callback(null, seekerBloodGroups.includes(req.body.bloodGroup));
      } else {
        callback(null, false);
      }
    }
  ], (err, isSeekerInSameBloodGroup) => {
    const bloodResponse = new BloodResponse(res);
    if (err) {
      console.error(err);
      return bloodResponse.setStatusCode(BloodResponse.DATABASE_ERROR).send();
    }
    bloodResponse.setStatusCode(BloodResponse.SUCCESS_CODE).setResponseBody({ isSeekerInSameBloodGroup: isSeekerInSameBloodGroup }).send();
  });
}

/*
 * inputs: countryCode, mobileNo, longitude and latitude
 * donateBlood will
 *  - find the donor
 *  - if found then update the location of donor else add the current user to donors list
 *  - return seekers
 */
export const donateBlood = (req, res) => {
  async.waterfall([
    (callback) => {
      Seeker.getByMobileNo(req.body.countryCode, req.body.mobileNo, (err, seekers) => {
        if (err) return callback(err);
        callback(null, seekers[0]);
      });
    },
    (seeker, callback) => {
      if (seeker) {
        const seekerBloodGroups = seeker.bloodGroups.map(bloodGroup => bloodGroup.name);
        if (seekerBloodGroups) {
          const otherBloodGroups = seeker.bloodGroups.filter(bloodGroup => bloodGroup.name !== req.body.bloodGroup)
          if (otherBloodGroups && otherBloodGroups.length > 0) {
            Seeker.updateSeeker({
              _id: seeker._id,
              user: seeker.user,
              geometry: {
                type: 'Point',
                coordinates: [req.body.longitude, req.body.latitude]
              },
              bloodGroups: otherBloodGroups
            }, (err, updatedSeeker) => {
              callback(err, seeker);
            });
          } else {
            Seeker.deleteSeeker(seeker._id, (err, deletedSeekerId) => {
              callback(err, {});
            });
          }
        } else {
          callback(null, {});
        }
      } else {
        callback(null, {});
      }
    },
    (seeker, callback) => {
      Donor.getByMobileNo(req.body.countryCode, req.body.mobileNo, (err,donors) => {
        if (err) return callback(err);
        callback(null, seeker, donors[0]);
      });    
    },
    (seeker, donor, callback) => {
      if (donor) {
        //update donor's location and bloodGroups
        BloodGroup.getByName(req.body.bloodGroup, (err, bloodGroups) => {
          if (err) return callback(err); 
          Donor.updateDonor({
            _id: donor._id,
            user: donor.user,
            geometry: {
              type: 'Point',
              coordinates: [req.body.longitude, req.body.latitude]
            },
            bloodGroups: donor.bloodGroups.some(bloodGroup => bloodGroup._id.toString() === bloodGroups[0]._id.toString()) ? donor.bloodGroups : [...donor.bloodGroups, bloodGroups[0]]
          }, (err, updatedDonor) => {
            if (err) return callback(err);
            callback(null, seeker, 'updated', updatedDonor);
          });
        });
      } else {
        // add new donor
        User.getByMobileNo(req.body.countryCode, req.body.mobileNo, (err, users) => {
          if (err) return callback(err);
          BloodGroup.getByName(req.body.bloodGroup, (err, bloodGroups) => {
            if (err) return callback(err);   
            Donor.createDonor({
              user: users[0],
              geometry: {
                type: 'Point',
                coordinates: [req.body.longitude, req.body.latitude]
              },
              bloodGroups: [bloodGroups[0]]
            }, (err, donor) => {
              if (err) return callback(err);
              callback(null, seeker, 'created', donor);
            });
          })
        });
      }
    },
    (seeker, data, donor, callback) => {
      Seeker.getWithinXKms(donor.user, donor.bloodGroups, req.body.longitude, req.body.latitude, 5, (err, seekersInRange) => {
        if (err) return callback(err);
        Seeker.getAll((err, allSeekers) => {
          if (err) return callback(err);
          if (seeker._id) {
            const filteredSeekers = allSeekers.filter(s => s._id.toString() !== seeker._id.toString());
            return callback(null, { seekersInRange: seekersInRange, allSeekers: filteredSeekers });
          }
          callback(null, { seekersInRange: seekersInRange, allSeekers: allSeekers });
        })
      });
    }
  ], (err, seekers) => {
    const bloodResponse = new BloodResponse(res);    
    if(err) {
      console.log(err);
      return bloodResponse.setStatusCode(BloodResponse.DATABASE_ERROR).send();
    }
    console.log(seekers);
    bloodResponse.setStatusCode(BloodResponse.SUCCESS_CODE).setResponseBody({ seekersInRange: seekers.seekersInRange, allSeekers: seekers.allSeekers }).send();
  });
}

/*
 * inputs: countryCode, mobileNo, longitude and latitude
 * seekBlood will
 *  - find donor
 *  - if donating in same blood group then remove blood group from his donation record also update his location
 *  - find the seeker
 *  - if found then update the location of seeker else add the current user to seekers list
 *  - return donors
 */
export const seekBlood = (req, res) => {
  async.waterfall([
    (callback) => {
      Donor.getByMobileNo(req.body.countryCode, req.body.mobileNo, (err, donors) => {
        if (err) return callback(err);
        callback(null, donors[0]);
      });
    },
    (donor, callback) => {
      if (donor) {
        const donorBloodGroups = donor.bloodGroups.map(bloodGroup => bloodGroup.name);
        if (donorBloodGroups) {
          const otherBloodGroups = donor.bloodGroups.filter(bloodGroup => bloodGroup.name !== req.body.bloodGroup)
          if (otherBloodGroups && otherBloodGroups.length > 0) {
            Donor.updateDonor({
              _id: donor._id,
              user: donor.user,
              geometry: {
                type: 'Point',
                coordinates: [req.body.longitude, req.body.latitude]
              },
              bloodGroups: otherBloodGroups
            }, (err, updatedDonor) => {
              callback(err, donor);
            });
          } else {
            Donor.deleteDonor(donor._id, (err, deletedDonorId) => {
              callback(err, {});
            });
          }
        } else {
          callback(null, {});
        }
      } else {
        callback(null, {});
      }
    },
    (donor, callback) => {
      Seeker.getByMobileNo(req.body.countryCode, req.body.mobileNo, (err, seekers) => {
        if (err) return callback(err);
        callback(null, donor, seekers[0]);
      });
    },
    (donor, seeker, callback) => {
      if (seeker) {
        //update donor's location
        BloodGroup.getByName(req.body.bloodGroup, (err, bloodGroups) => {
          if (err) return callback(err);
          Seeker.updateSeeker({
            _id: seeker._id,
            user: seeker.user,
            geometry: {
              type: 'Point',
              coordinates: [req.body.longitude, req.body.latitude]
            },
            bloodGroups: seeker.bloodGroups.some(bloodGroup => bloodGroup._id.toString() === bloodGroups[0]._id.toString()) ? seeker.bloodGroups : [...seeker.bloodGroups, bloodGroups[0]]
          }, (err, updatedSeeker) => {
            if (err) return callback(err);
            callback(null, donor, 'updated', updatedSeeker);
          });
        });
      } else {
        // add new donor
        User.getByMobileNo(req.body.countryCode, req.body.mobileNo, (err, users) => {
          if (err) return callback(err);
          BloodGroup.getByName(req.body.bloodGroup, (err, bloodGroups) => {
            if (err) return callback(err);
            Seeker.createSeeker({
              user: users[0],
              geometry: {
                type: 'Point',
                coordinates: [req.body.longitude, req.body.latitude]
              },
              bloodGroups: [bloodGroups[0]]
            }, (err, seeker) => {
              if (err) return callback(err);
              callback(null, donor, 'created', seeker);
            });
          });
        });
      }
    },
    (donor, data, seeker, callback) => {
      Donor.getWithinXKms(seeker.user, seeker.bloodGroups, req.body.longitude, req.body.latitude, 5, (err, donorsInRange) => {
        if (err) return callback(err);
        Donor.getAll((err, allDonors) => {
          if (err) return callback(err);
          if (donor._id) {
            console.log(donor._id);
            const filteredDonors = allDonors.filter(d => d._id.toString() !== donor._id.toString());
            return callback(null, { donorsInRange: donorsInRange, allDonors: filteredDonors })
          }
          callback(null, { donorsInRange: donorsInRange, allDonors: allDonors });
        })
      });
    }
  ], (err, donors) => {
    const bloodResponse = new BloodResponse(res);
    if (err) {
      console.log(err);
      return bloodResponse.setStatusCode(BloodResponse.DATABASE_ERROR).send();
    }
    console.log(donors);
    bloodResponse.setStatusCode(BloodResponse.SUCCESS_CODE).setResponseBody({ donorsInRange: donors.donorsInRange, allDonors: donors.allDonors }).send();
  });
}