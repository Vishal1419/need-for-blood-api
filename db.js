import mongoose from 'mongoose';
import * as config from './app_config';

mongoose.connect(`mongodb://${config.ENV_CONFIG.db.host}:${config.ENV_CONFIG.db.port}/${config.ENV_CONFIG.db.name}`, (err, db) => {
  if (err) {
    return console.error(err);
  }

  return console.log("Connection to MongoDB was successful");
});

