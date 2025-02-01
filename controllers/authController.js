const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const catchAsycn = require('../utiles/catchAsync')
const appError = require('../utiles/appError')


exports.signup = catchAsycn (async(req,res,next)=>{
    //  const newUser = await User.create(req.body)
     const newUser = await User.create({
        name:'ali',
        email:'ali@gamil.com',
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

exports.login = function(req,res,next){
    //check if email or password exist
 if(!email || password){
    return next(appError('please provide email and password!') )
 }

 //check if email and password correct
   
 //if every thing is ok do this
 const token = ''
 res.status(200).json({
    status:'success',
    token,
 })
}