const Tour = require('../models/tourModel')
const AppError = require('../utiles/appError.js')
const catchAsync = require('./../utiles/catchAsync')
const factory = require('./factoryController.js')

exports.aliesTopTours = (req, res, next) => {
    req.query.limit = '5'
    req.query.sort = '-ratingAverage,price'
    req.query.fields = 'price,name,difficulty,ratingAverage,summary'
    next()
}

// for populateing send to factory
exports.getTour = factory.getOne(Tour,{path:'reviews'})
exports.getAllTours = factory.getAll(Tour)
exports.updateTour = factory.updateOne(Tour)
exports.deleteTour = factory.deleteOne(Tour)
exports.createTour = factory.createOne(Tour)

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
                //for deleting 0 bringing 1
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

exports.getToursWithin = catchAsync(async (req,res,next)=>{
        //tour-within/:distance/center/:lat,lng/unit/:unit
        // ///tours-within/:distance/center/:latlng/:unit/:unit
        //tour-within/234/center/34,45/unit/mi
        const {distance, latlng, unit} = req.params
        const[lat,lng] = latlng.split(',')
        
      //we should change the unit to radience
       const radius = unit === 'mi' ? distance/3963.2 : distance/6378.1
    
        if(!lat || !lng) return next(new AppError('please provide latitute and longitude in the format lat,lng'),404)
    
        //geoWithin : in the geography place. centerSphere:define a circle
        const tours = await Tour.find({startLocation:{$geoWithin:{$centerSphere: [[lng,lat],radius] }}} )
    
        res.status(200).json({
            result:tours.length,
            status:'sucess',
            data:{
                tours
            }
        })
        }  
)

    exports.getDistances = catchAsync(async(req,res,next)=>{
        const{latlng,unit} = req.params
        const [lat,lng] = latlng.split(',')

         //to change the meter determination to km and miles
    const multiplier = unit === 'mi' ? 0.000621 : 0.001

    if(!lat || !lng) return next(new AppError('please provide latitute and longitude in the format lat,lng'),404)

        const distances = await Tour.aggregate([
            {
                //should be the first element of popeLine and expected and indexs field
                $geoNear:{
                    near:{
                        type:'Point',
                         coordinates:[lng * 1,lat * 1]
                    },
                    //mongoose filds for Geo
                    distanceField:'distance',
                    distanceMultiplier:multiplier,
                }
            },
                 //to bring just these fields
            {    
                 $project:{
                    distance:1,
                    name:1
                }
            }
        ])

        res.status(200).json({
            status:'sucess',
            data:{
                distances
            }
        })
    })