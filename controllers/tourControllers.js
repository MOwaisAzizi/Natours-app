const Tour = require('../models/tourModel')

//validation of data middlware
exports.checkBody = ((req, res, next) => {
    const {name, price} = req.body    
    if (!name || !price) {
        return res.status(404).json({
            status: 'Failed',
            message: 'Not Found',
        })
    }
    next()
})

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
        // const Tour = new Tour({})
    // Tour.sava().then
   const newTour = await Tour.create(req.body)
   res.status(200).json({
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