const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const catchAsycn = require('../utiles/catchAsync')
const AppError = require('../utiles/appError')


exports.signup = catchAsycn (async (req,res,next)=>{
    //  const newUser = await User.create(req.body)
     const newUser = await User.create({
        name:'ali',
        email:'alihhhh@gamil.com',
        password:'fjfjfjfj',
        passwordConfirm:'fjfjfjfj',
     })

const token = jwt.sign({id:newUser._id}, process.env.JWT_SECRET,{
    expiresIn:process.env.JWT_EXPIRES_IN
})
     res.status(201).json({
        status:'success',
        token,
        data:{
            user: newUser
        }
     })
})

exports.login = catchAsycn(async(req,res,next)=>{
    console.log('performing login');
    
    //check if email or password exist
    const {email,password} = req.body
 if(!email || !password){
    return next(new AppError('please provide email and password!',400) )
 }

 //check if email and password correct
 //+passord to bring also the paword that we denide to bring it before
   const user = await User.findOne({email}).select('+password')   
    const correct = User.passwordCorrect(password,user.password)

    if(!user && correct){
     next(new AppError('incorrect email or password',401))
    }

 //if every thing is ok do this
 const token = ''
 res.status(200).json({
    status:'success',
    token,
 })
})