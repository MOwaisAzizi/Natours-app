const nodemailer = require('nodemailer');
const pug = require('pug')

//new Emial(user,url).wellcome
module.exports = class Email {
  constructor(user, url) {
    this.url = url
    this.to = user.email
    this.firstName = this.user.name.split(' ')[0]
    this.from = `Owas Azizi ${process.env.EMAIL_FROM}`
  }

  newTransporter() {
    if (process.env.NODE_ENV === 'production') {
      return 1
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  //send actual email
  async send(templete, subject) {
    //1) render HTML base on a pug Templet
    //take a file and change it an html
    const html = pug.renderFile(`${__dirname}veiws/email/${templete}.pug`, {
      firstname: this.firstName,
      url: this.url,
      subject
    })

    //2) create options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      // a way of converting html into a text=>user html-to-text pakage
      text: htmlToText.stringFrom(html)
    };

    //3) create a transporter and send it
    await this.newTransporter().sendMail(mailOptions);
  }

  async wellcome() {
    await this.send('wellcome', 'Wellcome to Natours family!')
  }
}

//was for development
// const sendEmail = async options => {
// try{
// 1) Create a transporter
// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: process.env.EMAIL_PORT,
//   auth: {
//     user: process.env.EMAIL_USERNAME,
//     pass: process.env.EMAIL_PASSWORD
//   }
// });

// 2) Define the email options
// const mailOptions = {
//   from: 'owais azizi <hello@jonas.io>',
//   to: options.email,
//   subject: options.subject,
//   text: options.message
// };

// 3) Actually send the email
//   await transporter.sendMail(mailOptions);
// }catch(err){
//  console.log(err);

// }
// };
