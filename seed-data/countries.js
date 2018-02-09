import Country from '../models/Country';
import * as config from '../app_config';

const mongoose = require('mongoose');
mongoose.connect(`mongodb://${config.ENV_CONFIG.db.host}:${config.ENV_CONFIG.db.port}/${config.ENV_CONFIG.db.name}`);

const countries = [
  new Country({ code: "+91", name: "India" }),
  new Country({ code: "+44", name: "England" }),
  new Country({ code: "+61", name: "Australia" }),
  new Country({ code: "+81", name: "Japan" }),
  new Country({ code: "+86", name: "China" })
];

let done = 0;

for (let i = 0; i < countries.length; i++) {
  countries[i].save((err, result) => {
    done++;
    if (done == countries.length) {
      exit();
      return;
    }
  });
}

const exit = () => {
  mongoose.disconnect();
}