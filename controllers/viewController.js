const Tour = require("../models/tourModel")
const AppError = require("../utiles/appError")
const catchAsync = require("../utiles/catchAsync")


exports.getOverview = catchAsync(async (req, res) => {
  const tours = await Tour.find()
  
  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  })
})

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({ path: 'reviews', fields: 'review user rating' })
  if (!tour) {
    return next(new AppError('Thare is no tour with that error', 404))
  }

  res.status(200).render('tour', {
    title: `${tour.name} tour`,
    tour
  })
})


exports.getLoginForm = catchAsync(async (req, res, next) => {
  res.status(200).render('login', {
    title: 'Login to Your Account'
  })
})

exports.getAccount = catchAsync(async (req, res) => {
  res.status(200).render('account', {
    title: 'Your Account'
  })
})
