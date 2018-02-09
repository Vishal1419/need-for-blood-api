import BloodResponse from './bloodResponse';
import * as constants from './constants';

export default {
  otpInfo: {
    type: Object,
    unknownKeys: 'allow',
    required: true,
    schema: {
      countryCode: {
        type: String,
        trim: true,
        required: true,
        match: /^.{1,}$/,
        errors: {
          type: {
            errorCode: BloodResponse.INVALID_DATA_TYPE,
            message: constants.COUNTRY_CODE_INVALID_DT
          },
          required: {
            errorCode: BloodResponse.REQUIRED_FIELD,
            message: constants.COUNTRY_CODE_REQUIRED
          },
          match: {
            errorCode: BloodResponse.REQUIRED_FIELD,
            message: constants.COUNTRY_CODE_REQUIRED
          },
          allowNull: {
            errorCode: BloodResponse.REQUIRED_FIELD,
            message: constants.COUNTRY_CODE_REQUIRED
          }
        }
      },
      mobileNo: {
        type: String,
        required: true,
        trim: true,
        match: /^\d{10}$/,
        errors: {
          type: {
            errorCode: BloodResponse.INVALID_DATA_TYPE,
            message: constants.MOBILE_NUMBER_INVALID_DT
          },
          required: {
            errorCode: BloodResponse.REQUIRED_FIELD,
            message: constants.MOBILE_NUMBER_REQUIRED
          },
          match: {
            errorCode: BloodResponse.PATTERN_NOT_MATCH,
            message: constants.MOBILE_NUMBER_PATTERN
          },
          allowNull: {
            errorCode: BloodResponse.REQUIRED_FIELD,
            message: constants.MOBILE_NUMBER_REQUIRED
          }
        }
      }
    },
    errors: {
      required: {
        errorCode: BloodResponse.REQUIRED_FIELD,
        message: constants.DETAILS_REQUIRED
      }
    }
  },
  otp: {
    type: Object,
    unknownKeys: 'allow',
    required: true,
    schema: {
      countryCode: {
        type: String,
        trim: true,
        required: true,
        match: /^.{1,}$/,
        errors: {
          type: {
            errorCode: BloodResponse.INVALID_DATA_TYPE,
            message: constants.COUNTRY_CODE_INVALID_DT
          },
          required: {
            errorCode: BloodResponse.REQUIRED_FIELD,
            message: constants.COUNTRY_CODE_REQUIRED
          },
          match: {
            errorCode: BloodResponse.REQUIRED_FIELD,
            message: constants.COUNTRY_CODE_REQUIRED
          },
          allowNull: {
            errorCode: BloodResponse.REQUIRED_FIELD,
            message: constants.COUNTRY_CODE_REQUIRED
          }
        }
      },
      mobileNo: {
        type: String,
        required: true,
        trim: true,
        match: /^\d{10}$/,
        errors: {
          type: {
            errorCode: BloodResponse.INVALID_DATA_TYPE,
            message: constants.MOBILE_NUMBER_INVALID_DT
          },
          required: {
            errorCode: BloodResponse.REQUIRED_FIELD,
            message: constants.MOBILE_NUMBER_REQUIRED
          },
          match: {
            errorCode: BloodResponse.PATTERN_NOT_MATCH,
            message: constants.MOBILE_NUMBER_PATTERN
          },
          allowNull: {
            errorCode: BloodResponse.REQUIRED_FIELD,
            message: constants.MOBILE_NUMBER_REQUIRED
          }
        }
      },
      otp: {
        type: String,
        trim: true,
        required: true,
        match: /^\d{6}$/,
        errors: {
          type: {
            errorCode: BloodResponse.INVALID_DATA_TYPE,
            message: constants.OTP_INVALID_DT
          },
          required: {
            errorCode: BloodResponse.REQUIRED_FIELD,
            message: constants.OTP_REQUIRED
          },
          match: {
            errorCode: BloodResponse.PATTERN_NOT_MATCH,
            message: constants.OTP_PATTERN
          },
          allowNull: {
            errorCode: BloodResponse.REQUIRED_FIELD,
            message: constants.OTP_REQUIRED
          }
        }
      }
    },
    errors: {
      required: {
        errorCode: BloodResponse.REQUIRED_FIELD,
        message: constants.DETAILS_REQUIRED
      }
    }
  },
  registerUser: {
    type: Object,
    unknownKeys: 'allow',
    required: true,
    schema: {
      name: {
        type: String,
        trim: true,
        required: true,
        match: /^.{1,}$/,
        errors: {
          type: {
            errorCode: BloodResponse.INVALID_DATA_TYPE,
            message: constants.NAME_INVALID_DT
          },
          required: {
            errorCode: BloodResponse.REQUIRED_FIELD,
            message: constants.NAME_REQUIRED
          },
          match: {
            errorCode: BloodResponse.REQUIRED_FIELD,
            message: constants.NAME_REQUIRED
          },
          allowNull: {
            errorCode: BloodResponse.REQUIRED_FIELD,
            message: constants.NAME_REQUIRED
          }
        }
      },
      address: {
        type: String,
        trim: true,
        required: true,
        match: /^.{1,}$/,
        errors: {
          type: {
            errorCode: BloodResponse.INVALID_DATA_TYPE,
            message: constants.ADDRESS_INVALID_DT
          },
          required: {
            errorCode: BloodResponse.REQUIRED_FIELD,
            message: constants.ADDRESS_REQUIRED
          },
          match: {
            errorCode: BloodResponse.REQUIRED_FIELD,
            message: constants.ADDRESS_REQUIRED
          },
          allowNull: {
            errorCode: BloodResponse.REQUIRED_FIELD,
            message: constants.ADDRESS_REQUIRED
          }
        }
      },
      bloodGroup: {
        type: String,
        trim: true,
        required: true,
        match: /^.{1,}$/,
        errors: {
          type: {
            errorCode: BloodResponse.INVALID_DATA_TYPE,
            message: constants.BLOOD_GROUP_INVALID_DT
          },
          required: {
            errorCode: BloodResponse.REQUIRED_FIELD,
            message: constants.BLOOD_GROUP_REQUIRED
          },
          match: {
            errorCode: BloodResponse.REQUIRED_FIELD,
            message: constants.BLOOD_GROUP_REQUIRED
          },
          allowNull: {
            errorCode: BloodResponse.REQUIRED_FIELD,
            message: constants.BLOOD_GROUP_REQUIRED
          }
        }
      },
      countryCode: {
        type: String,
        trim: true,
        required: true,
        match: /^.{1,}$/,
        errors: {
          type: {
            errorCode: BloodResponse.INVALID_DATA_TYPE,
            message: constants.COUNTRY_CODE_INVALID_DT
          },
          required: {
            errorCode: BloodResponse.REQUIRED_FIELD,
            message: constants.COUNTRY_CODE_REQUIRED
          },
          match: {
            errorCode: BloodResponse.REQUIRED_FIELD,
            message: constants.COUNTRY_CODE_REQUIRED
          },
          allowNull: {
            errorCode: BloodResponse.REQUIRED_FIELD,
            message: constants.COUNTRY_CODE_REQUIRED
          }
        }
      },
      mobileNo: {
        type: String,
        required: true,
        trim: true,
        match: /^\d{10}$/,
        errors: {
          type: {
            errorCode: BloodResponse.INVALID_DATA_TYPE,
            message: constants.MOBILE_NUMBER_INVALID_DT
          },
          required: {
            errorCode: BloodResponse.REQUIRED_FIELD,
            message: constants.MOBILE_NUMBER_REQUIRED
          },
          match: {
            errorCode: BloodResponse.PATTERN_NOT_MATCH,
            message: constants.MOBILE_NUMBER_PATTERN
          },
          allowNull: {
            errorCode: BloodResponse.REQUIRED_FIELD,
            message: constants.MOBILE_NUMBER_REQUIRED
          }
        }
      }
    },
    custom: (data, schema, cb) => {
      if (data.name === 'undefined') {
        return cb({ message: { errorCode: BloodResponse.REQUIRED_FIELD, message: constants.NAME_REQUIRED } });
      } else if (data.address === 'undefined') {
        return cb({ message: { errorCode: BloodResponse.REQUIRED_FIELD, message: constants.ADDRESS_REQUIRED } });
      } else if (data.bloodGroup === 'undefined') {
        return cb({ message: { errorCode: BloodResponse.REQUIRED_FIELD, message: constants.BLOOD_GROUP_REQUIRED } });
      } else if (data.countryCode === 'undefined') {
        return cb({ message: { errorCode: BloodResponse.REQUIRED_FIELD, message: constants.COUNTRY_CODE_REQUIRED } });
      } else if (data.mobileNo === 'undefined') {
        return cb({ message: { errorCode: BloodResponse.REQUIRED_FIELD, message: constants.MOBILE_NUMBER_REQUIRED } });
      }
      cb(null, data);
    },
    errors: {
      required: {
        errorCode: BloodResponse.REQUIRED_FIELD,
        message: constants.DETAILS_REQUIRED
      }
    }
  }
}
