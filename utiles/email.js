// const nodemailer = require('nodemailer')

// const sendEmail = async options=>{
//   //create transporter
//   const transporter = nodemailer.createTransport({
//     host:process.env.EMAIL_HOST,
//     port:process.env.EMAIL_PORT,
//     auth:{
//         user:process.env.EMAIL_USERNAME,
//         pass:process.env.EMAIL_PASSWORD,
//     }
//   })
//   //define email options
//   const mailOptions = {
//     from:'Owais Azizi <hello@woais.io>',
//     to:options.email,
//     subject:options.subject,
//     text:options.message,
//   }
//   //send email
//   await transporter.sendMail(mailOptions)
// }
// module.exports = sendEmail

//pakage to send email bu node.js
const nodemailer = require('nodemailer');

const sendEmail = async options => {
  // 1) Create a transporter
  console.log('😍👋💰💰');
  
  console.log(process.env.EMAIL_HOST, process.env.EMAIL_PORT,process.env.EMAIL_USERNAME,typeof process.env.EMAIL_PASSWORD);
  
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // 2) Define the email options
  const mailOptions = {
    from: 'owais azizi <hello@jonas.io>',
    to: options.email,
    subject: options.subject,
    text: options.message
    // html:
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
