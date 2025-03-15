const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/bookingModel');
const Tour = require("../models/tourModel")
const catchAsync = require("../utiles/catchAsync")
const { getAll, getOne, createOne, deleteOne, updateOne } = require('./factoryController')


exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/my-tours/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
          },
          unit_amount: tour.price * 100, // amount in cents
        },
        quantity: 1
      }
    ],
    mode: 'payment',
  });

  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    session
  });
});


//this two function are routed in veiwRouter
exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  const { tour, user, price } = req.query;
   
  if (!tour && !user && !price) return next();
  await Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split('?')[0]);
})

exports.getMyTour = catchAsync(async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id })

  const tourIDs = bookings.map(el => el.tour)
  const tours = await Tour.find({ _id: { $in: tourIDs } })

  res.status(200).render('overview', {
    title: 'My Tours',
    tours
  })
})

exports.getAllBookings = getAll(Booking)
exports.createBooking = createOne(Booking)
exports.getBooking = getOne(Booking)
exports.updateBooking = updateOne(Booking)
exports.deleteBooking = deleteOne(Booking)







