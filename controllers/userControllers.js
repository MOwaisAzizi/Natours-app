const multer = require('multer')
const sharp = require('sharp')

const User = require('../models/userModel')
const AppError = require('../utiles/appError')
const catchAsync = require('../utiles/catchAsync')
const factory = require('./factoryController.js')

//1-first way
//controling of saving file
// const multerStorage = multer.diskStorage({
//     //cd:callback:like next
//     destination : (req,file,cb)=>{
//         cb(null,'public/img/users')
//     },

//     filename:function(req,file,cb){
//         //extention
//         const ext = file.mimetype.split('/')[1] //jpeg
//         cb(null, `user-${req.user.id}-${Date.now()}.${ext}`)
//     }
// })

//secodn way 
const multerStorage = multer.memoryStorage()

const multerFilter = (req, file, cb)=>{
    if(file.mimetype.startsWith('image')) cb(null, true)
        else cb(new AppError('The file should be an image! please select an image.',400),false)
}

//it shows the destination of saving the image by the form and we perform this my a middlware
const upload = multer({storage: multerStorage, fileFilter : multerFilter})
//middlware :phote is the name of field to store its link in data base
exports.uploadUserPhoto =  upload.single('photo')

//for squaring the image
 exports.resizeUserPhoto = (req,res,next)=>{
    if(!req.file) return next()

    req.file.filename = `user-${req.user.id}-${Date.now()}`
    //first store in buffer and after it comes to out disk
    sharp(req.file.buffer).resize(500,500).toFormat('jpeg').jpeg({quality:90})
    .toFile(`public/img/users/${req.file.filename}`)
    next()
 }

const fitlerObj = (obj,...allowedFields)=>{
    const newObj = {}
    Object.keys(obj).forEach(el=>{
        if(allowedFields.includes(el)){
        newObj[el] = obj[el]
        }
    })
    return newObj
}


    exports.updateMe = catchAsync(async(req,res,next)=>{
        //1-prevent user from updating password and confirmPassword
        if(req.body.password || req.body.passwordConfirm){
            next(new AppError('This route is not for password update. please use /updateMyPassword route',400))
        }

      //filter fields to update
      const filterBody = fitlerObj(req.body,'name','email')
      //for updating image
        if(req.file) filterBody.photo = req.file.filename
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

    exports.deleteMe = catchAsync(async(req,res,next)=>{
        //in deleteMe we just inactive the user to but its data is still in the database
         await User.findByIdAndUpdate(req.user.id,{active:false})

         res.status(204).json({
            status:'success',
            data:null
         })
        })

exports.createUser = ((req, res) => {
    res.status(500).json({
        message: 'Error',
        status: 'Can not create one. please sign up',
    })
})

exports.getMe = catchAsync(async(req,res,next)=>{
    req.params.id = req.user.id
    next()
})

//do not update password with this
exports.updateUser = factory.updateOne(User)
exports.deleteUser = factory.deleteOne(User)
exports.getUser = factory.getOne(User)
exports.getAllUsers = factory.getAll(User)