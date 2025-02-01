const User = require('../models/userModel')
const catchAsycn = require('../utiles/catchAsync')

exports.signup = catchAsycn (async(req,res,next)=>{
    //  const newUser = await User.create(req.body)
     const newUser = await User.create({
        name:'ali',
        email:'ali@gamil.com',
        password:'fjfjfjfj',
        passwordConfirm:'fjfjfjfj',
     })
     res.status(201).json({
        status:'success',
        data:{
            user: newUser
        }
     })
})