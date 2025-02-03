const {promisify} = require('util')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const catchAsycn = require('../utiles/catchAsync')
const AppError = require('../utiles/appError')

const sighToken = id =>{
   return jwt.sign({id:id}, process.env.JWT_SECRET,{
      expiresIn:process.env.JWT_EXPIRES_IN
  })}

exports.signup = catchAsycn (async (req,res,next)=>{
     const newUser = await User.create(req.body)
   //   const newUser = await User.create({
   //      name:'ali',
   //      email:'alihhhh@gamil.com',
   //      password:'fjfjfjfj',
   //      passwordConfirm:'fjfjfjfj',
   //   })

const token = sighToken(newUser._id)

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
 const token = sighToken(user._id)
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
  console.log(decoded);
  
   //Check if the user exists
   const fresher = await User.findOne({id:decoded.id})
   if(!fresher){
      return next(new AppError('the user belong to this token does not exist anymore',401))
   }

   // Check if user changed password
   next()
})