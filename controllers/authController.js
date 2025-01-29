const User = require('../models/userModel')
const catchAsycn = require('../utiles/catchAsync')

exports.signup = catchAsycn (async(req,res,next)=>{
     const newUser = await User.create(req.body)
     res.status(201).json({
        status:'success',
        data:{
            user: newUser
        }
     })
})