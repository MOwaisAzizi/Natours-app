const User = require('../models/userModel')
const AppError = require('../utiles/appError')
const catchAsync = require('../utiles/catchAsync')

const fitlerObj = (obj,...allowedFields)=>{
    const newObj = {}
    Object.keys(obj).forEach(el=>{
        if(allowedFields.includes(el)){
        newObj[el] = obj[el]
        }
    })
    return newObj
}

exports.getAllUsers = catchAsync(async(req, res,next) => {
        const users = await User.find()
        
        res.status(200).json({
            status: 'success',
            result: users.length,
            data: {
                users
            }
        })
    })

    exports.updateMe = catchAsync( async(req,res,next)=>{
        //1-prevent user from updating password and confirmPassword
        if(req.body.password || req.body.passwordConfirm){
            next(new AppError('This route is not for password update. please use /updateMyPassword route',400))
        }
        
      //filter fields to update
      const filterBody = fitlerObj(req.body,'name','email')
        //update user data
        const updatedUser = await User.findByIdAndUpdate(req.user.id,filterBody,{
            runValidators:true,new:true
        })
        res.status(200).json({
            status:'success',
            data:{
                user:updatedUser
            }
        })
    })


exports.createUser = ((req, res) => {
    res.status(500).json({
        message: 'Error',
        status: 'Not created yet',
    })
})

exports.getUser = ((req, res) => {
    res.status(500).json({
        message: 'Error',
        status: 'Not created yet',
    })
})
exports.updateUser = ((req, res) => {
    res.status(500).json({
        message: 'Error',
        status: 'Not created yet',
    })
})
exports.deleteUser = ((req, res) => {
    res.status(500).json({
        message: 'Error',
        status: 'Not created yet',
    })
})