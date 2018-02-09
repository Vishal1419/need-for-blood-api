import twilio from 'twilio';

const accountSid = 'AC07ebeeb9b9ed0e54941c53e84ffae39f';
const authToken = 'dc6e2fec890ee97391d542a13ea13784';

export default new twilio.Twilio(accountSid, authToken);