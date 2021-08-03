const dotenv = require('dotenv');
const sendGrid = require('@sendgrid/mail')
const url = require('url');

dotenv.config();
sendGrid.setApiKey(process.env.SENDGRID_API_KEY)

const TEMPLATE_ID = 'd-6525b0ff0d2d4533bcaf1281f71c695a'

function sendVerificationEmail(recipient, verificationCode, protocol, host) {
  const baseUrl = url.format({
    protocol: protocol,
    host: host,
  });
  const message = {
    to: 'emlstrick@gmail.com', // TODO: change to recipient
    from: 'emlstrick@gmail.com', // TODO: change to your verified sender
    templateId: TEMPLATE_ID,
    dynamic_template_data: {
      verifyLink: `${baseUrl}/authentication/verify?code=${verificationCode}`
    },
  };
  console.log('Sending verification email with data: ', message);
  return sendGrid.send(message)
}

module.exports = { sendVerificationEmail };