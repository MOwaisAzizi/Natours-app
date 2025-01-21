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
        const queryOBJ = {...this.queryObject}
        const excludedField = ['sort', 'page', 'fields', 'limit']
        excludedField.forEach(el => delete this.queryOBJ[el])
         let queryStr = JSON.stringify(this.queryOBJ)
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
    }

    limitFields(){
        if (this.queryObject.fields) {
            const fields = req.query.fields.split(',').join(' ')
            this.query = this.query.select(fields)
        }
    }

    paginate(){
        
    }
}

exports.getAllTours = async (req, res) => {
    try {
 
        
        const features = new APIFeatures(Tour.find(),req.query).filter().sort().limitFields().paginate()
        const tours = features.query
        
        // const excludedField = ['sort', 'page', 'fields', 'limit']
        // excludedField.forEach(el => delete queryOBJ[el])
        //  let queryStr = JSON.stringify(queryOBJ)
        // //to add a doller sighn to our query in order to use it in mongoose
        // queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, match => `$${match}`)
        // let query = Tour.find(JSON.parse(queryStr))

        //3-sorting
        // if (req.query.sort) {
        //     const sortBy = req.query.sort.split(',').join(' ')
        //     query = query.sort(sortBy)
        // } else {
        //     query = query.sort('-createdAt')
        // }

        //4-fields
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ')
            query = query.select(fields)
        }

        //5-page pagination
        const page = (req.query.page * 1) || 1;
        const limit = (req.query.limit * 1) || 100;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);

        if (req.query.page) {
            const numTours = await Tour.countDocuments();
            if (skip >= numTours) throw new Error('This page does not exist');
        }

        const tours = await query

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