const {promisify} = require('util')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const User = require('../models/userModel')
const catchAsycn = require('../utiles/catchAsync')
const AppError = require('../utiles/appError')
const sendEmail = require('../utiles/email')

const signToken = id =>{
   return jwt.sign({id:id}, process.env.JWT_SECRET,{
      expiresIn:process.env.JWT_EXPIRES_IN
  })}

exports.signup = catchAsycn (async (req,res,next)=>{
   const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm
    });

const token = signToken(newUser._id)

     res.status(201).json({
        status:'success',
        token,
        data:{
            user: newUser
        }
     })
})

exports.login = catchAsycn(async(req,res,next)=>{    
    //check if email or password exist
    const {email,password} = req.body

 if(!email || !password){
    return next(new AppError('please provide email and password!',400) )
 }

 //check if email and password correct
 //+passord to bring also the paword that we denide to bring it before , email:email=email
   const user = await User.findOne({email}).select('+password')   
   
   //correct password is a User Schema Method that we made
    if(!user || !await user.correctPassword(password,user.password)){
     return next(new AppError('incorrect email or password',401))
    }

 //if every thing is ok do this
 const token = signToken(user._id)
 res.status(200).json({
    status:'success',
    token,
 })
})

exports.protect = catchAsycn(async(req,res,next)=>{
   //Geting token and check if its there
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
      token = req.headers.authorization.split(' ')[1]
    }
     if(!token){
      return next(new AppError('You are not logged in! please login to access!',401))
     }
  // Verification token
  //becuse it return a promise we use build in promisify node funciton
  const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET)
  
   //Check if the user exists
   const currentUser = await User.findOne({_id:decoded.id})
   
   if(!currentUser){
      return next(new AppError('the user belong to this token does not exist anymore',401))
   }

   // Check if user changed password
   if(currentUser.changePasswordAfter(decoded.iat)){
      return next(new AppError('user recently changed password! please login!'))
   }

   //access to protected rout
   req.user = currentUser
   next()
})

//for passing inputs in middleware we use this trick:wrap it into a fucntion
exports.restrictTo = (...roles)=>{
   return (req,res,next)=>{
      //user created in protect middlware 
      if(!roles.includes(req.user.role)){
         return next(new AppError('You do not permision to delete a tour!',403))
      }
      next()
   }
}

exports.forgotPassword = catchAsycn(async(req,res,next)=>{
   //find user base on email
   const user = await User.findOne({email:req.body.email})
   if(!user){
      return next(new AppError('thare is no user with that email!',401))
   }
   
   //generate random token
   const resetToken = user.createPasswordResetToken()
   await user.save({validateBeforeSave:false})

   // 3) Send it to user's email
 const resetURL = `${req.protocol}://${req.get(
   'host'
 )}/api/v1/users/resetPassword/${resetToken}`;

 const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
 
 try {
   await sendEmail({
     email: user.email,
     subject: 'Your password reset token (valid for 10 min)',
     message
   });

   res.status(200).json({
     status: 'success',
     message: 'Token sent to email!',
     resetURL
   });

 } catch (err) {
   user.passwordResetToken = undefined;
   user.passwordResetExpires = undefined;
   await user.save({ validateBeforeSave: false });

   return next(
     new AppError('There was an error sending the email. Try again later!'),
     500
   );
}

})

exports.resetPassword = catchAsycn(async(req,res,next)=>{
   console.log('🔥🔥🔥');
   
   //1-get user base on the token
   //change token to cripto to comare it with token in database
   const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
   const user = await User.findOne({passwordResetToken:hashedToken,passwordResetExpires:{$gt:Date.now()}})
   console.log(req.body);
   
   //2-if token has not expired, and thare is user, set the new password
     if(!user){
      return next(new AppError('Token invalid or expired!',400))
     }
     user.password = req.body.password
     user.passwordConfirm = req.body.passwordConfirm
     user.passwordResetToken = undefined
     user.passwordResetExpires = undefined
     await user.save()
   //3-update changePasswordAt property for the user

   //4- log the user in, send jwt
   const token = signToken(user._id)
   res.status(200).json({
      status: 'success',
      message: 'your password changed!',
      token
    });
})
 