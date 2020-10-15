import nodeMailer from 'nodemailer';

const adminEmail = 'toannv.soict@gmail.com';
const adminPassword = 'zcfydnzbtlmadnyi';
const mailHost = 'smtp.google.com';
const mailPort = 587;

const sendMail = (receiver, subject, htmlContent) => {
  const transporter = nodeMailer.createTransport({
    service: 'gmail',
    host: mailHost,
    port: mailPort,
    secure: false,
    auth: {
      user: adminEmail,
      pass: adminPassword,
    },
  });

  const options = {
    from: adminEmail,
    to: receiver,
    subject,
    html: htmlContent,
  };

  return transporter.sendMail(options);
};

export default sendMail;
