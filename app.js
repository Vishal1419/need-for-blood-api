import express from 'express';
import bodyParser from 'body-parser';

import * as config from './app_config';
import './db';

import countryRoute from './routes/country';
import bloodGroupRoute from './routes/bloodGroup';
import otpRoute from './routes/otp';
import userRoute from './routes/user';


const app = express();

// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

countryRoute(app);
bloodGroupRoute(app);
otpRoute(app);
userRoute(app);

app.listen(config.ENV_CONFIG.server.port, config.ENV_CONFIG.server.host, function (err) {
  console.log(`Server is running at : ${config.ENV_CONFIG.server.host}:${config.ENV_CONFIG.server.port}`);
});