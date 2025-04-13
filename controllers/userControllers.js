const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/userModel')
const AppError = require('../utiles/appError')
const catchAsync = require('../utiles/catchAsync')
const factory = require('./factoryController.js')

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};


const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo');

//for squaring the image by sharp pakage
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {

  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
}
)

const fitlerObj = (obj, ...allowedFields) => {
  const newObj = {}
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el]
    }
  })
  return newObj
}


exports.updateMe = catchAsync(async (req, res, next) => {
  //prevent user from updating password and confirmPassword in this route
  if (req.body.password || req.body.passwordConfirm) {
    next(new AppError('This route is not for password update. please use /updateMyPassword route', 400))
  }

  const filterBody = fitlerObj(req.body, 'name', 'email')

  if (req.file) filterBody.photo = req.file.filename

  //update user data
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    runValidators: true, new: true
  })

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  })
})

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false })

  res.status(204).json({
    status: 'success',
    data: null
  })
})

exports.createUser = ((req, res) => {
  res.status(500).json({
    message: 'Error',
    status: 'Can not create one. please sign up',
  })
})

exports.getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id
  next()
})

exports.updateUser = factory.updateOne(User)
exports.deleteUser = factory.deleteOne(User)
exports.getUser = factory.getOne(User)
exports.getAllUsers = factory.getAll(User)