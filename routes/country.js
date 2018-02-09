import { getAllCountries } from '../controllers/country';

export default (server) => {

  server.get('/countries', getAllCountries);

}
