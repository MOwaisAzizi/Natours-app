const Tour = require('../models/tourModel')

exports.getAllTours = async(req, res) => {
try{
    const tours = await Tour.find()
    res.status(200).json({
        status: 'success',
        result: tours.lenght,
        time: req.requestTime,
        data: {
            tours
        }
    })
}catch(err){
    res.status(404).json({
        status:'failed',
        message:'invalid Data!'
    })
}
}

exports.createTour = async (req, res) => {
try{
    
    // const Tour = new Tour({})
    // Tour.sava().then
   const newTour = await Tour.create(req.body)
   res.status(201).json({
    status:'success',
    data : {
        newTour
    }
   })
}catch(err){
    res.status(400).json({
        status:'failed',
        message:'invalid Data!'
    })
}
}

exports.getTour = async(req, res) => {
    try{
        const tour = await Tour.findById(req.params.id)
        // const tour = await Tour.findOnd({_id:req.parmas.id})
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })
    }catch(err){
        res.status(404).json({
            status:'failed',
            message:'invalid Data!'
        })
    }
}

exports.updateTour = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            tour: 'update right here'
        }
    })
}

exports.deleteTour = (req, res) => {

    res.status(204).json({
        status: 'success',
        data: null
    })
}