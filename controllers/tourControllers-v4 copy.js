const Tour = require('../models/tourModel')
const AppError = require('../utiles/appError')
const APIFeatures = require('./../utiles/apiFeatures')
const catchAsync = require('./../utiles/catchAsync')
const factory = require('./factoryController.js')

exports.aliesTopTours = (req, res, next) => {
    req.query.limit = '5'
    req.query.sort = '-ratingAverage,price'
    req.query.fields = 'price,name,difficulty,ratingAverage,summary'
    next()
}

exports.getAllTours = catchAsync (async(req, res,next) => {
        const Feature = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate()
        const tours = await Feature.query

        //SEND RESPOSE
        res.status(200).json({
            status: 'success',
            // result:Tour.countDocuments(),
            result: tours.length,
            data: {
                tours
            }
        })
})


exports.getTour = catchAsync (async (req, res,next) => {
    // reviews:for vitual property in tour modal to bring of formation 
        const tour = await Tour.findById(req.params.id).populate('reviews')
        // const tour = await Tour.findOne({_id:req.parmas.id})
         
        //this is an extra error from catch in catchAsycn that we write the controlble error handling
        //when next has argument it goes to error handlng middlware
        if(!tour){
            return next(new AppError('could not found data in that id',404))
        }

        //tour.save 
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })
})


exports.createTour =  catchAsync (async(req, res, next) => {
        const newTour = await Tour.create(req.body)
        
        res.status(201).json({
            status: 'success',
            data: {
                tour:newTour
            }
        })
})

exports.updateTour =  catchAsync (async  (req, res,next) => {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if(!tour){
            return next(new AppError('could not found data in that id',404))
        }

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });

})


exports.deleteTour = catchAsync (async (req, res, next) => {
        const tour = await Tour.findByIdAndDelete(req.params.id);

        if(!tour){
            return next(new AppError('could not found data in that id',404))
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
})


exports.getTourStats = catchAsync (async (req, res) => {
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4 } }
            },
            {
                $group: {
                    //group all in one
                    // _id: null,
                    //for grouping the documents documents one ore more
                    _id: '$difficulty',
                    numTour: { $sum: 1 },
                    numRatings: { $sum: '$ratingsQuantity' },
                    aveRating: { $avg: '$ratingsAverage' },
                    avePrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }
                }
            },
            {
                //assending sort
                $sort: { avePrice: 1 }
            },
        ]);
        res.status(200).json({
            status: 'success',
            data: {
                stats
            }
        })

})

exports.getMonthlyPlan = catchAsync (async (req, res) => {
        const year = req.params.year * 1
        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-1`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group: {
                    //for grouping with the same id and add operation to them
                    _id: { $month: '$startDates' },
                    //sum of those collected collections are how much, ++
                    numTourStart: { $sum: 1 },
                    tour: { $push: '$name' }
                }
            },
            {
                $addFields: { month: '$_id' }
            },
            {
                //for deleting field
                $project: {
                    _id: 0
                }
            }, {
                $sort: { numTourStart: -1 }
            }

        ])
        res.status(200).json({
            status: 'success',
            data: {
                plan
            }
        });
})