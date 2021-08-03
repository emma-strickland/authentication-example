const dotenv = require('dotenv');
const sendGrid = require('@sendgrid/mail')

dotenv.config();
sendGrid.setApiKey(process.env.SENDGRID_API_KEY)

function sendVerificationEmail(recipient, verificationCode, callback) {
  sendGrid
    .send({
      to: 'emlstrick@gmail.com', // TODO: change to recipient
      from: 'emlstrick@gmail.com', // TODO: change to your verified sender
      templateId: 'd-6525b0ff0d2d4533bcaf1281f71c695a',
      dynamic_template_data: {
        verifyLink: `https://localhost:4000/authentication/verify/${verificationCode}`
      },
    })
    .then((_) => {
      callback();
    })
    .catch((error) => {
      callback(error);
    })
}

module.exports = { sendVerificationEmail };