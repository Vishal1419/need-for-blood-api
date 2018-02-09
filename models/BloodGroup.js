import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const bloodGroupSchema = new Schema({
  name: { type: String, required: true }
});

const BloodGroup = mongoose.model('BloodGroup', bloodGroupSchema, 'bloodGroups');

BloodGroup.getAll = (callback) => {
  BloodGroup.find().sort('name').exec((err, bloodGroups) => {
    callback(err, bloodGroups);
  });
};

BloodGroup.getById = (id, callback) => {
  BloodGroup.findById(id, (err, bloodGroup) => {
    callback(err, bloodGroup);
  });
};

BloodGroup.getByName = (name, callback) => {
  BloodGroup.find({ name: new RegExp('^' + name + '$', "i") }).sort('name').exec((err, bloodGroups) => {
    callback(err, bloodGroups);
  });
};

BloodGroup.createBloodGroup = (bloodGroup, callback) => {
  const newBloodGroup = new BloodGroup(bloodGroup)
  newBloodGroup.save(callback);
};

BloodGroup.updateBloodGroup = (bloodGroup, callback) => {
  BloodGroup.update(
    { "_id": bloodGroup._id },
    {
      "$set": {
        "name": bloodGroup.name
      }
    },
    { multi: false },
    callback
  );
};

BloodGroup.deleteBloodGroup = (id, callback) => {
  BloodGroup.findByIdAndRemove(id, (err, bloodGroup) => {
    callback(err, bloodGroup._id);
  })
}

export default BloodGroup;
