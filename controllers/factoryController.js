const AppError = require("../utiles/appError");
const catchAsync = require("../utiles/catchAsync");

exports.deleteOne = Model =>catchAsync (async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if(!doc){
        return next(new AppError('could not found document in that id',404))
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
})

exports.updateOne = Model => catchAsync (async  (req, res,next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if(!doc){
        return next(new AppError('could not found document in that id',404))
    }

    res.status(200).json({
        status: 'success',
        data: {
            data:doc
        }
    });

})