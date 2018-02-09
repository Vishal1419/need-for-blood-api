import Country from '../models/Country';
import BloodResponse from '../utils/bloodResponse';

export const getAllCountries = (req, res) => {
  const bloodResponse = new BloodResponse(res);

  Country.getAll((err, countries) => {
    if (err) {
      console.error(err);
      return bloodResponse.setStatusCode(BloodResponse.DATABASE_ERROR).send();
    }
    return bloodResponse.setStatusCode(BloodResponse.SUCCESS_CODE).setResponseBody({countries: countries}).send();
  });
}