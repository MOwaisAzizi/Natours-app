const fs = require('fs')

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))
exports.getAllTours = (req, res) => {      
    res.status(200).json({
        status: 'success',
        result: tours.lenght,
        time: req.requestTime,
        data: {
            tours
        }
    })
}

exports.createTour = (req, res) => {
    console.log(req.body);
    const newId = tours[tours.length - 1].id + 1
    const newTour = Object.assign({ id: newId }, req.body)
    tours.push(newTour)
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        // to send a message to client that this object is posted successfully
        res.status(201).json({
            status: 'success',
            data: {
                tours: newTour
            }
        })
    })
}

exports.getTour = (req, res) => {
    //to change id to number, params(/id)
    const id = req.params.id * 1
    const tour = tours.find(el => el.id === id)
    // if(id > tours.length){
    if (!tour) {
        return res.status(404).json({
            status: 'Failed',
            message: 'Not Found',
        })
    }
    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    })
}

exports.updateTour = (req, res) => {
    if (req.params.id > tours.length * 1) {
        return res.status(404).json({
            status: 'Failed',
            message: 'Not Found',
        })
    }
    res.status(200).json({
        status: 'success',
        data: {
            tour: 'update right here'
        }
    })
}

exports.deleteTour = (req, res) => {
    if (req.params.id > tours.length * 1) {
        return res.status(404).json({
            status: 'Failed',
            message: 'Not Found',
        })
    }
    res.status(204).json({
        status: 'success',
        data: null
    })
}