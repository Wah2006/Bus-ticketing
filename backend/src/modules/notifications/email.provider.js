// Email provider abstraction
export const sendEmail = async (to, subject, htmlContent) => {
    const provider = process.env.EMAIL_PROVIDER || 'sendgrid';

    if (provider === 'sendgrid') {
        return sendEmailSendgrid(to, subject, htmlContent);
    } else if (provider === 'mailgun') {
        return sendEmailMailgun(to, subject, htmlContent);
    }

    throw new Error(`Unknown email provider: ${provider}`);
};

const sendEmailSendgrid = async (to, subject, htmlContent) => {
    // Implementation for SendGrid
    console.log(`[Email - SendGrid] To: ${to}, Subject: ${subject}`);

    try {
        // const sgMail = require('@sendgrid/mail');
        // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        // const msg = {
        //   to,
        //   from: process.env.SENDGRID_FROM_EMAIL,
        //   subject,
        //   html: htmlContent,
        // };
        // await sgMail.send(msg);

        return { success: true, provider: 'sendgrid' };
    } catch (error) {
        console.error('Email send error:', error);
        return { success: false, error: error.message };
    }
};

const sendEmailMailgun = async (to, subject, htmlContent) => {
    // Implementation for Mailgun
    console.log(`[Email - Mailgun] To: ${to}, Subject: ${subject}`);

    try {
        // const mailgun = require('mailgun.js');
        // const FormData = require('form-data');
        // const mg = mailgun.client({ key: process.env.MAILGUN_API_KEY });
        // await mg.messages.create(process.env.MAILGUN_DOMAIN, {
        //   from: `VibeCoding <noreply@${process.env.MAILGUN_DOMAIN}>`,
        //   to,
        //   subject,
        //   html: htmlContent,
        // });

        return { success: true, provider: 'mailgun' };
    } catch (error) {
        console.error('Email send error:', error);
        return { success: false, error: error.message };
    }
};

export default { sendEmail };
