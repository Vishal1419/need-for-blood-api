import { validateRequest } from '../utils/request-validator';
import { saveOTPInfo, verifyOTP } from '../controllers/otp';
import validationSchema from '../utils/validationSchema';

export default (server) => {

  server.post('/otpInfo/save', validateRequest(validationSchema.otpInfo), saveOTPInfo);
  server.post('/otp/verify', validateRequest(validationSchema.otp), verifyOTP);

}
