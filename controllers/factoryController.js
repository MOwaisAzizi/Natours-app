const APIFeatures = require("../utiles/apiFeatures");
const AppError = require("../utiles/appError");
const catchAsync = require("../utiles/catchAsync");

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
        return next(new AppError('could not found document in that id', 404))
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
})

exports.updateOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!doc) {
        return next(new AppError('could not found document in that id', 404))
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        }
    });
})

exports.createOne = Model => catchAsync(async (req, res) => {
    const doc = await Model.create(req.body)

    res.status(201).json({
        status: 'success',
        data: {
            data: doc
        }
    })
})

exports.getOne = (Model, populateOptions) => catchAsync(async (req, res, next) => {
    //populate came from tour getTour
    let query = Model.findById(req.params.id)
    if (populateOptions) query = query.populate(populateOptions)
    const doc = await query

    if (!doc) {
        return next(new AppError('could not found document in that id', 404))
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        }
    })
})

exports.getAll = Model => catchAsync(async (req, res, next) => {

    //to allow nested get review on tour
    let filter = {}
    if (req.params.tourId) filter = { tour: req.params.tourId }

    const Feature = new APIFeatures(Model.find(filter), req.query).filter().sort().limitFields().paginate()
    const docs = await Feature.query

    res.status(200).json({
        status: 'success',
        result: docs.length,
        data: {
            data: docs
        }
    })
})
