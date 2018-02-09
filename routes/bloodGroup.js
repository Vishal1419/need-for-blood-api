import { getAllBloodGroups } from '../controllers/bloodGroup';

export default (server) => {

  server.get('/bloodGroups', getAllBloodGroups);

}
