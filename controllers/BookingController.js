const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const Booking = require('../models/bookingModel');
const Tour = require("../models/tourModel")
const catchAsync = require("../utiles/catchAsync")
const {getAll,getOne,createOne,deleteOne,updateOne} = require('./factoryController')
    
    //this function is for checkout functionality useing stripe library
//create checkout session
exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    // 1) Get the currently booked tour
    const tour = await Tour.findById(req.params.tourId);
  
    // 2) Create checkout session
    const session = await stripe.checkout.sessions.create({
      // required options
      payment_method_types: ['card'],
      success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
      cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
      customer_email: req.user.email,
      client_reference_id: req.params.tourId,
      mode: 'payment',
      
      // updated information about the purchased product
      line_items: [
        {
          price_data: {
            currency: 'usd', // currency for the price
            product_data: {
              name: `${tour.name} Tour`, // product name
              description: tour.summary, // product description
              images: [`https://www.natours.dev/img/tours/${tour.imageCover}`], // product image
            },
            unit_amount: tour.price * 100, 
          },
          quantity: 1, 
        },
      ],
    });
  
    // 3) Return the session ID to redirect to Stripe Checkout
    res.status(200).json({
      session: session,
    });
  });
  
  exports.createBookingCheckout = catchAsync(async(req, res, next)=>{
    //this is temeray : this not save at all to put tour and user... to url
    const {tour, user, price} = req.query
     if(!tour && !user && !price ) return next()

      await Booking.create({tour, user, price})

      //redirect us to the overview page without showing tour,price and user
      res.redirect(req.originalUrl.split('?')[0])
  })

  exports.getMyTour = catchAsync(async(req, res, next) =>{
  //find all Bokkings
  const bookings = await Booking.find({user:req.user.id})

  //find tours
  const tourIDs = bookings.map(el=>el.tour)
  const tours = await Tour.find({_id: {$in:tourIDs}})

  res.status(200).render('overview',{
    title:'My Tours',
    tours
  })

  })

  exports.getAllBookings = getAll(Booking)
  exports.createBooking = createOne(Booking)
  exports.getBooking = getOne(Booking)
  exports.updateBooking = updateOne(Booking)
  exports.deleteBooking = deleteOne(Booking)
  
