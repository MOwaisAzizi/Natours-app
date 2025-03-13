const Review = require('../models/reviewModel')
const factory = require('./factoryController.js')

//middleware that run befor createReview
exports.setTourUserIds = (req,res,next) =>{
    //using our nested routes, user.id come from protect 
    if(!req.body.tour) req.body.tour = req.params.tourId
    if(!req.body.user) req.body.user = req.user.id
    next()
}

exports.getAllReview = factory.getAll(Review)
exports.deleteReview = factory.deleteOne(Review)
exports.updateReview = factory.updateOne(Review)
exports.createReview = factory.createOne(Review)
exports.getReview = factory.getOne(Review)