const User = require('../models/userModel')
const AppError = require('../utiles/appError')
const catchAsync = require('../utiles/catchAsync')

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

    exports.updateMe = (req,res,next)=>{
        //1-prevent user from updating password and confirmPassword
        if(req.body.password || req.body.passwordConfirm){
            next(new AppError('This route is not for password update. please use /updateMyPassword route',400))
        }

        //update user data
        res.status(200).json({
            status:'success',
        })
    }


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