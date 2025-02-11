const Review = require('../models/reviewModel')
const catchAsync = require('../utiles/catchAsync')
const factory = require('./factoryController.js')

exports.getAllReview = catchAsync( async (req, res,next)=>{
    let filter = {}
    if(req.params.tourId) filter = {tour:req.params.tourId}

    const reviews = await Review.find(filter)

    res.status(200).json({
        status:'success',
        result:reviews.length,
        data:{
            reviews
        }
    })
})

exports.createReview = catchAsync( async (req,res,next)=>{
    //using our nested routes, user.id come from protect 
    if(!req.body.tour) req.body.tour = req.params.tourId
    if(!req.body.user) req.body.user = req.user.id
    const newReview = await Review.create(req.body)

    res.status(201).json({
        status:'success',
        data:{
            review:newReview
        }
    })
})

exports.deleteReview = factory.deleteOne(Review)