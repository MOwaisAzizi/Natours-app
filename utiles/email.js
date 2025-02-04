const sendEmail = options=>{
  //create transporter
  const transporter = nodemailer.createTransporter({
    services:'Gmail',
    auth:{
        user:process.env.EMAIL_USERNAME,
        pass:process.env.EMAIL_PASSWORD,
    }
    //activate in gamil(less secure app)
  })
  //define email options

  //send email
}