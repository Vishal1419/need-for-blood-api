import BloodGroup from '../models/BloodGroup';
import * as config from '../app_config';

const mongoose = require('mongoose');
mongoose.connect(`mongodb://${config.ENV_CONFIG.db.host}:${config.ENV_CONFIG.db.port}/${config.ENV_CONFIG.db.name}`);

const bloodGroups = [
  new BloodGroup({ name: "O+" }),
  new BloodGroup({ name: "O-" }),
  new BloodGroup({ name: "A+" }),
  new BloodGroup({ name: "B+" }),
  new BloodGroup({ name: "AB+" })
];

let done = 0;

for (let i = 0; i < bloodGroups.length; i++) {
  bloodGroups[i].save((err, result) => {
    done++;
    if (done == bloodGroups.length) {
      exit();
      return;
    }
  });
}

const exit = () => {
  mongoose.disconnect();
}