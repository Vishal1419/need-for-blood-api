import BloodGroup from '../models/BloodGroup';
import BloodResponse from '../utils/bloodResponse';

export const getAllBloodGroups = (req, res) => {
  const bloodResponse = new BloodResponse(res);

  BloodGroup.getAll((err, bloodGroups) => {
    if (err) {
      console.error(err);
      return bloodResponse.setStatusCode(BloodResponse.DATABASE_ERROR).send();
    }
    return bloodResponse.setStatusCode(BloodResponse.SUCCESS_CODE).setResponseBody({ bloodGroups: bloodGroups }).send();
  });
}