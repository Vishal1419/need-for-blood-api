import { validateRequest } from '../utils/request-validator';
import { registerUser, donateBlood, seekBlood, checkIfDonorInSameGroup, checkIfSeekerInSameGroup } from '../controllers/user';
import validationSchema from '../utils/validationSchema';

export default (server) => {

  server.post('/user/register', validateRequest(validationSchema.registerUser), registerUser);
  server.post('/user/checkIfDonorInSameGroup', validateRequest(validationSchema.donorOrSeekerInSameGroup), checkIfDonorInSameGroup);
  server.post('/user/checkIfSeekerInSameGroup', validateRequest(validationSchema.donorOrSeekerInSameGroup), checkIfSeekerInSameGroup);
  server.post('/user/donate', validateRequest(validationSchema.donateOrSeekBlood), donateBlood);
  server.post('/user/seek', validateRequest(validationSchema.donateOrSeekBlood), seekBlood);

}
