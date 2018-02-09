import { validateRequest } from '../utils/request-validator';
import { registerUser } from '../controllers/user';
import validationSchema from '../utils/validationSchema';

export default (server) => {

  server.post('/user/register', validateRequest(validationSchema.registerUser), registerUser);

}
