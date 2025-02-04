const nodemailer = require('nodemailer')

const sendEmail = async options=>{
  //create transporter
  const transporter = nodemailer.createTransport({
    host:process.env.EMAIL_HOST,
    port:process.env.EMAIL_PORT,
    auth:{
        user:process.env.EMAIL_USERNAME,
        pass:process.env.EMAIL_PASSWORD,
    }
  })
  //define email options
  const mailOptions = {
    from:'Owais Azizi <hello@woais.io>',
    to:options.email,
    subject:options.subject,
    text:options.message,
  }
  //send email
  await transporter.sendEmail(mailOptions)
}
module.exports = sendEmail