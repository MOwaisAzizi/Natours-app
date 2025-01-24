const express = require('express')

const app = express()
const morgan = require('morgan')
const userRouter = require('./routes/userRouter')
const tourRouter = require('./routes/tourRouter')

//this is for just shoing the morgan(to show some states of requst like request or success.....) whin the app is runing
if(process.env.NODE_ENV === 'development') app.use(morgan('dev'))

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

module.exports = app

