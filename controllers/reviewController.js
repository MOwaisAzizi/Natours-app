const Review = require('../models/reviewModel')

const getAllReview = async (req, res,next)=>{
    const reviews = await Review.find()
    res.status(200).json({
        status:'success',
        data:{
            reviews
        }
    })
}

const createReview = async (req,res,next)=>{
    const newReview = await Review.create(req.body)
    res.status(201).json({
        status:'success',
        data:{
            newReview
        }
    })
}