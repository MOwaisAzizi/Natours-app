const Tour = require('../models/tourModel')

exports.getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        result: tours.lenght,
        time: req.requestTime,
        // data: {
        //     tours
        // }
    })
}

exports.createTour = async (req, res) => {
try{
    console.log(req.body);
    
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

exports.getTour = (req, res) => {
    const id = req.params.id * 1
    // const tour = tours.find(el => el.id === id)
    res.status(200).json({
        status: 'success',
        // data: {
        //     tour
        // }
    })
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