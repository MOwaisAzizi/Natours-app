const Tour = require('../models/tourModel')
const APIFeatures = require('./../utiles/apiFeatures')

exports.aliesTopTours = (req, res, next) => {
    req.query.limit = '5'
    req.query.sort = '-ratingAverage,price'
    req.query.fields = 'price,name,difficulty,ratingAverage,summary'
    next()
}

exports.getAllTours = async (req, res) => {
    try {
        const Feature = new APIFeatures(Tour.find(),req.query).filter().sort().limitFields().paginate()
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
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            message: err
        })
    }
}


exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id)
        // const tour = await Tour.findOne({_id:req.parmas.id})
        //tour.save 
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            message: err
        })
    }
}

exports.createTour = async (req, res) => {
    try {
        // const Tour = new Tour({})
        // Tour.sava()     save is the prototye object of the dindone class
        const tour = await Tour.create(req.body)
        res.status(201).json({
            status: 'success',
            data: {
                tour
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err
        })
    }
}

exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            message: err
        });
    }
};


exports.deleteTour = async (req, res) => {
    try {

        //commonlly we do not return someting
        await Tour.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            message: err
        });
    }
}

exports.getTourStats = async (req,res) => {
    try {
        const stats = await Tour.aggregate([
            { 
                $match: { ratingsAverage: { $gte: 4 } } 
            },
            { 
                $group: { 
                    // _id: null,
                    //for grouping the aggregates
                    _id: '$difficulty',
                    numTour: {$sum:1},
                    numRatings: { $sum: '$ratingsQuantity' },
                    aveRating: { $avg: '$ratingsAverage' },
                    avePrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }
                }
            },
            {
                //assending sort
               $sort:{avePrice:1}
            },
            // {
            //    $match:{
            //     _id:{$ne:'easy'}
            //    }
            // }
        ]);
        res.status(200).json({
            status: 'success',
            data: {
                stats
            }
        });
    } catch (err) {
        res.status(500).json({ 
            status: 'failed',
            message: err 
        });
    }
    
}

exports.getMonthlyPlan = async (req,res) => {
    try{
      const year = req.params.year * 1
    //   "2021-06-19T05:30:00.000Z",
    //   "2021-07-20T05:30:00.000Z",
    //   "2021-08-18T05:30:00.000Z"
    // "2021-04-25T05:30:00.000Z",
    // "2021-07-20T05:30:00.000Z",
    // "2021-10-05T05:30:00.000Z"
    // "2021-03-11T05:30:00.000Z",
    // "2021-05-02T05:30:00.000Z",
    // "2021-06-09T05:30:00.000Z"
      const plan = await Tour.aggregate([
        {
         $unwind:'$startDates'   
        },
        {$match:{
            startDates:{
                $gte:new Date(`${year}-01-1`),
                $lte:new Date(`${year}-12-31`)
            }
        }
        },
        {
         $group:{
            //for grouping with the same id
            _id:{$month:'$startDates'},
            numTourStart: {$sum:1},
            tour:{$push:'$name'}
         }
        }
      ])
      res.status(200).json({
        status: 'success',
        data: {
            plan
        }
    });
    }
    catch(err){
        res.status(500).json({ 
            status: 'failed',
            message: err 
        });
    }
}