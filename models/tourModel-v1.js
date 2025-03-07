const mongoose = require('mongoose')
const { default: slugify } = require('slugify')
const User = require('./userModel')

const tourSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true,
        maxlength: [40, 'A tour name must have less or equal then 40 characters'],
        minlength: [10, 'A tour name must have more or equal then 10 characters']
      },
      slug: String,
      duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
      },
      maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
      },
      difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum: {
          values: ['easy', 'medium', 'difficult'],
          message: 'Difficulty is either: easy, medium, difficult'
        }
      },
      ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0']
      },
      ratingsQuantity: {
        type: Number,
        default: 0
      },
      price: {
        type: Number,
        required: [true, 'A tour must have a price']
      },
      priceDiscount: {
        type: Number,
        //custom validat
        validate: {
          validator: function(val) {
            // this only points to current doc on NEW document creation
            return val < this.price;
          },
          message: 'Discount price ({VALUE}) should be below regular price'
        }
      },
      summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a description']
      },
      description: {
        type: String,
        trim: true
      },
      imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
      },
      images: [String],
      createdAt: {
        type: Date,
        default: Date.now(),
        select: false
      },
      startDates: [Date],
      secretTour: {
        type: Boolean,
        default: false
      },
      //embeded object(not a document):this object is not a reguler objec schema options but an object to recognize as GoeSpicia object
       startLocation:{
        //GeoJSON(type and Coordinates) describing a certain poits in earth
        //sub or nested schema type options
        type:{
          type : String,
          default:'Point',
          enum:['Point']
        },
        coordinates:[Number],
        address:String,
        description:String
      },
 //in order to create documents and embed them into another document we need an array
      Locations:[
        {
          type:{
            type : String,
            default:'Point',
            enum:['Point']
          },
          coordinates:[Number],
          address:String,
          description:String,
          day:Number
        }
      ],

    },

    {
      toJSON: { virtuals: true },
      toObject: { virtuals: true }
    }
  );
  
  tourSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7;
  });

//DOCUMENT middeware: run before or after sava() and create() methods
tourSchema.pre('save', function (next) {
    //this,'Point to current working document
    // this.slug = slugify(this.name,{lower:true})
    next()
})

//after save and create
// tourSchema.post('save',function(doc,next){
//    console.log('this will run after save');
//    console.log(doc);
//    next()
// })


//Query middleware:run before queries like find and this points to query object and access to query methods
///^find:means that every query that starts with find(we do this becuse of applying to single find tour too),pre:before,post:after/
//we can use tourSchema.pre('findOne') for single find
// tourSchema.pre(/^find/, function(next) {
//     //bring all in the find method in controller but process this query after finding your result
//     this.find({ secretTour: { $ne: true } });
//     this.start = Date.now()
//     next();
// });

// tourSchema.post(/^find/, function() {
//     console.log(`The operation took ${Date.now() - this.start} milliseconds`);
// });

//3-Agregate middleware: becuse when filtering the secret tour in find method the aggregate request alse filter it we use this
tourSchema.pre('aggregate', function (next) {
    // console.log('This is aggregate');
    // Add a $match stage to filter out secret tours
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
    this.start = Date.now();
    next()
});

// tourSchema.post('aggregate', function () {
//     console.log('This is finish');
//     console.log(`The time took ${Date.now() - this._start} ms`);
// });

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour
