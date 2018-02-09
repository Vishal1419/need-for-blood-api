import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const countrySchema = new Schema({
  code: { type: String, required: true },
  name: { type: String, required: true }
});

const Country = mongoose.model('Country', countrySchema, 'countries');

Country.getAll = (callback) => {
  Country.find().sort('name').exec((err, countries) => {
    callback(err, countries);
  });
};

Country.getById = (id, callback) => {
  Country.findById(id, (err, country) => {
    callback(err, country);
  });
};

Country.getByName = (name, callback) => {
  Country.find({ name: new RegExp('^' + name + '$', "i") }).sort('name').exec((err, countries) => {
    callback(err, countries);
  });
};

Country.getByCode = (code, callback) => {
  Country.find({ code: new RegExp('^' + code + '$', "i") }).sort('code').exec((err, countries) => {
    callback(err, countries);
  });
};

Country.createCountry = (country, callback) => {
  const newCountry = new Country(country)
  newCountry.save(callback);
};

Country.updateCountry = (country, callback) => {
  Country.update(
    { "_id": country._id },
    {
      "$set": {
        "code": country.code,
        "name": country.name
      }
    },
    { multi: false },
    callback
  );
};

Country.deleteCountry = (id, callback) => {
  Country.findByIdAndRemove(id, (err, country) => {
    callback(err, country._id);
  })
}

export default Country;
