// SMS provider abstraction
export const sendSMS = async (phoneNumber, message) => {
    const provider = process.env.SMS_PROVIDER || 'africas_talking';

    if (provider === 'africas_talking') {
        return sendSMSAfricastalking(phoneNumber, message);
    } else if (provider === 'twilio') {
        return sendSMSTwilio(phoneNumber, message);
    }

    throw new Error(`Unknown SMS provider: ${provider}`);
};

const sendSMSAfricastalking = async (phoneNumber, message) => {
    // Implementation for Africa's Talking
    // This is a placeholder - integrate with actual API
    console.log(`[SMS - Africa's Talking] To: ${phoneNumber}, Message: ${message}`);

    try {
        // const axios = require('axios');
        // const response = await axios.post('https://api.sandbox.africastalking.com/version1/messaging', {
        //   username: process.env.AFRICAS_TALKING_USERNAME,
        //   APIkey: process.env.AFRICAS_TALKING_API_KEY,
        //   recipients: [phoneNumber],
        //   message,
        // });
        // return { success: true, response };

        return { success: true, provider: 'africas_talking' };
    } catch (error) {
        console.error('SMS send error:', error);
        return { success: false, error: error.message };
    }
};

const sendSMSTwilio = async (phoneNumber, message) => {
    // Implementation for Twilio
    console.log(`[SMS - Twilio] To: ${phoneNumber}, Message: ${message}`);

    try {
        // const twilio = require('twilio');
        // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        // const result = await client.messages.create({
        //   body: message,
        //   from: process.env.TWILIO_FROM_NUMBER,
        //   to: phoneNumber,
        // });
        // return { success: true, result };

        return { success: true, provider: 'twilio' };
    } catch (error) {
        console.error('SMS send error:', error);
        return { success: false, error: error.message };
    }
};

export default { sendSMS };
