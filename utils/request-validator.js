import validator from 'isvalid';

import BloodResponse from './bloodResponse';

export const validateRequest = (schema, errorCallback) => {
  return (request, response, next) => {
    validator((request.body || request.params),
      schema,
      (err) => {
        if (!err) {
          next();
        } else {
          if (errorCallback !== undefined) {
            errorCallback(request, response);
          }

          const customResponse = new BloodResponse(response);
          customResponse.setStatusCode(err.message.errorCode)
            .setResponseBody({ error: err.message.message })
            .send();
        }
      }
    );
  };
};
