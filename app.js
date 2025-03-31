const express = require('express')
const path = require('path')
const morgan = require('morgan')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const mongoSantization = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const compression = require('compression')
const cookieParser = require('cookie-parser')
const userRouter = require('./routes/userRouter')
const tourRouter = require('./routes/tourRouter')
const reviewRouter = require('./routes/reviewRouter')
const viewRouter = require('./routes/viewRouter')
const bookingRouter = require('./routes/bookingRouter')
const AppError = require('./utiles/appError')
const globalErrorHandler = require('./controllers/errorController')

const app = express()

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

// Global Middlwares

app.use(express.static(path.join(__dirname, 'public')))

//SECURITY MIDDLWARES

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"], // Default to 'self' for most resources
        scriptSrc: ["'self'", "cdnjs.cloudflare.com", "https://js.stripe.com", "https://unpkg.com", "https://api.mapbox.com"], // Allow scripts from these sources
        workerSrc: ["'self'", "blob:"], // Allow Web Workers from Blob URLs
        frameSrc: ["'self'", "https://js.stripe.com"], // Allow frames from 'self' and Stripe
        connectSrc: [
          "'self'",
          "https://api.mapbox.com", // Allow Mapbox API
          "https://events.mapbox.com", // Allow Mapbox events
          "ws://127.0.0.1:51844", 
          "ws://127.0.0.1:59378" // Allow WebSocket connections to these local addresses
        ], 
      },
    },
  })
);

// app.use(compression)

//development logging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

const limitRater = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'To many request of this IP. please try agin in an hour!'
})

app.use('/api', limitRater)

app.use(express.json({ limit: '10kb' }))

app.use(express.urlencoded({ extended: true, limit: '10kb' }))

app.use(cookieParser())

app.use(mongoSantization())

app.use(xss())

app.use(hpp({
  whitelist: ['duration', 'difficulty', 'maxGroupSize', 'ratingsAverage', 'ratingsQuantity']
}))

//Routes
app.use('/', viewRouter)
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/reviews', reviewRouter)
app.use('/api/v1/bookings', bookingRouter)

app.all('*', (req, res, next) => {
  next(new AppError(`not fount ${req.originalUrl} path in this sever!`, 404))
})

app.use(globalErrorHandler)

module.exports = app

