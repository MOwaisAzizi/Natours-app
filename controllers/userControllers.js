const User = require('../models/userModel')
const catchAsync = require('../utiles/catchAsync')

exports.getAllUsers = catchAsync(async((req, res,next) => {
        const users = await User.find()
        res.status(200).json({
            status: 'success',
            // result:Tour.countDocuments(),
            result: users.length,
            data: {
                users
            }
        })
    })
)

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