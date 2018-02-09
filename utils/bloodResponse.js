class BloodResponse {
  constructor(response) {
    this.statusCode = 1001;
    this.body = [];
    this.response = response;
  }

  setStatusCode(statusCode) {
    this.statusCode = statusCode;
    return this;
  }

  setResponseBody(responseBody) {
    this.body = responseBody;
    return this;
  }

  send() {
    const responseBody = {
      statusCode: this.statusCode
    };

    for (const key in this.body) {
      responseBody[key] = this.body[key];
    }

    this.response.send(responseBody);
  }
}

BloodResponse.SUCCESS_CODE = 1000;
BloodResponse.UNKNOWN_ERROR = 1001;
BloodResponse.DATABASE_ERROR = 1002;
BloodResponse.INVALID_DATA_TYPE = 1004;
BloodResponse.REQUIRED_FIELD = 1005;
BloodResponse.PATTERN_NOT_MATCH = 1006;

export default BloodResponse;