const Tour = require('../models/tourModel')

exports.aliesTopTours = (req, res, next) => {
    req.query.limit = '5'
    req.query.sort = '-ratingAverage,price'
    req.query.fields = 'price,name,difficulty,ratingAverage,summary'
    next()
}

class APIFeatures {
    constructor(query,queryObject){
        this.query = query
        this.queryObject = queryObject
    }

    //we return this from it becouse of chaining of object(without return it is not return any thing)
    filter(){
        const queryObj = {...this.queryObject}
        const excludedField = ['sort', 'page', 'fields', 'limit']
        excludedField.forEach(el => delete this.queryObj[el])
         let queryStr = JSON.stringify(this.queryObj)
        //to add a doller sighn to our query in order to use it in mongoose
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, match => `$${match}`)
        this.query = this.query.find(JSON.parse(queryStr))
        return this
    }

    sort(){
        if (this.queryObject.sort) {
            const sortBy = this.queryObject.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        } else {
            this.query = this.query.sort('-createdAt')
        }
        return this
    }

    limitFields(){
        if (this.queryObject.fields) {
            const fields =this.queryObject.fields.split(',').join(' ')
            this.query = this.query.select(fields)
        }
        return this
    }

    paginate(){
        const page = (this.queryObject.page * 1) || 1;
        const limit = (this.queryObject.limit * 1) || 100;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
       return this
    }
}

exports.getAllTours = async (req, res) => {
    try {
        const Feature = new APIFeatures(Tour.find(),req.query).filter().sort().limitFields().paginate()
        console.log(Feature);
        const tours = Feature.query

        //SEND RESPOSE
        res.status(200).json({
            status: 'success',
            result: tours.lenght,
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
            message: 'invalid Data!'
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
            message: 'invalid Data!'
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
            message: 'Invalid Data!'
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