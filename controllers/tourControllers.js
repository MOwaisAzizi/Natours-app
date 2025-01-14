const fs = require('fs')

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))

exports.checkID = ((req, res, next, val) => {
    console.log('params middleware id : ' + val);
    if (req.params.id > tours.length * 1) {
        return res.status(404).json({
            status: 'Failed',
            message: 'Not Found',
        })
    }
    next()
})

//validation of data middlware
exports.checkBody = ((req, res, next) => {
    const {name, price} = req.body
    console.log(name, price);
    
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
        data: {
            tours
        }
    })
}

exports.createTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1
    const newTour = Object.assign({ id: newId }, req.body)
    tours.push(newTour)
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'success',
            data: {
                tours: newTour
            }
        })
    })
}

exports.getTour = (req, res) => {
    const id = req.params.id * 1
    const tour = tours.find(el => el.id === id)
    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
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