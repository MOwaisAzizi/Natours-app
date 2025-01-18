const mongoose = require('mongoose')

const tourSchema = new mongoose.Schema({
    name:{
        type:String,
        require: [true,'A tour must have a name'],
        unique:true
    },
    rating:{
        type: Number,
        default: 4.5
    },
    price:{
        type:Number,
        require:[true,'A tour must have a price'],
    }
})

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour