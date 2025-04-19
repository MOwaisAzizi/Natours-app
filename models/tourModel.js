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
        max: [5, 'Rating must be below 5.0'],
        //run for each seting this value(rounding value)
        set: val=> Math.round(val*10)/10
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
        //GeoJSON(type and Coordinates) describing a certain point in the earth
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
  
      locations:[
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

      //child referencing way of referencing to users
       guides:[
         {
          type:mongoose.Schema.ObjectId,
          ref:'User'
         }
       ],
    },
    //whin ever we have a filds got from another fields show them in result but not store in database
    {
      toJSON: { virtuals: true },
      toObject: { virtuals: true }
    }
  );

  //difining idnexes for performance(not search all document to find our query like price=1000)
   tourSchema.index({price:1, ratingsAverage:-1})   
   tourSchema.index({slug:1})   
   // whin using real place we store them by the name of 2dsphere
   tourSchema.index({startLocation: '2dsphere'})   
  
  tourSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7;
  });

  //DOCUMENT middeware: run before or after sava() and create() methods
tourSchema.pre('save', function (next) {
  // this,'Point to current working document
  this.slug = slugify(this.name,{lower:true})
  next()
})
  
  //for virtual population and referencing the review(for magage to access the childs like review that took information of spacific tour)
  tourSchema.virtual('reviews',{
   ref:'Review',
   foreignField:'tour',
   localField:'_id'
  })

  //for the way of embeding users in tour
  // tourSchema.pre('save',async function(next){
    // const guidePromise = this.guides.map(async id=> User.findById(id))
    // this.guides = await Promise.all(guidePromise)
  //   next()
  // })

  //fill the references ids to actual data in that tour(get one)
  tourSchema.pre(/^find/,function(){
    //populate(bring the data of data) the the users in the quides of tours
    this.populate({
      path:'guides',
      select:'-_v -changePasswordAt'
    })
  })

// tourSchema.pre('aggregate', function (next) {
//     this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//     this.start = Date.now();
//     next()
// });

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour
