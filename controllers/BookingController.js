// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const Tour = require("../models/tourModel")
const catchAsync = require("../utiles/catchAsync")

exports.getCheckoutSession = catchAsync( async(req,res,next)=>{
//Get the Currently booked tour
const tour = await Tour.findById(req.params.tourid)

//create checkout session
//npm i stripe
const session = stripe.checkout.sessions.create({
    //required options
    //information about the session
    //only method is card for now
    payment_method_types:['card'],
    success_url:`${req.protocol}://${req.get('host')}`,
    cancel_url:`${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email:req.user.email,
    client_reference_id:req.params.id,
    //information about purchased product
    line_items: [
        {
            name:`${tour.name} Tour`,
            description:tour.summary,
            images : [`https://www.natours.dev/img/tours/${tour.imageCover}`],
            amount: tour.price * 100,
            currency : 'usd',
            quantity: 1
        }
    ]
})

//create session as response(client)
 res.status(200).json({
    status:'success',
    session,
 })
})