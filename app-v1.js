const fs = require('fs')
const express = require('express')
// HTTP request logger middleware for node.js
const morgan = require('morgan')
const app = express()

// //get is http method for request and the data is the respose from server
// app.get('/',(req,res)=>{
// //    res.status(200).send('Hello from Server!')
//    res.status(200).json({message:'Hello from server(get)',app:'natrouse'})
// })

// app.post('/',(req,res)=>{
//        res.status(200).send('you can post here(post)')
//     })



//1-middleWare

//middle ware for posting to change the the json post to object(from req.body)
app.use(express.json())

//according to docs it return a function and the arguments are req,res and next
app.use(morgan('dev'))

app.use((req,res,next)=>{
    console.log('Hello rom Middlewarfe');
    next()
})

app.use((req,res,next)=>{
    req.requestTime = new Date();
    next();
  });

  //2-handle request functions
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))

const getAllTours = (req, res) => {
    console.log(req.requestTime);
    
    res.status(200).json({
        status: 'success',
        result: tours.lenght,
        time: req.requestTime,
        data: {
            tours
        }
    })
}

const createTour = (req, res) => {
    console.log(req.body);
    const newId = tours[tours.length - 1].id + 1
    const newTour = Object.assign({ id: newId }, req.body)
    tours.push(newTour)
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        // to send a message to client that this object is posted successfully
        res.status(201).json({
            status: 'success',
            data: {
                tours: newTour
            }
        })
    })
}

const getTour = (req, res) => {
    //to change id to number, params(/id)
    const id = req.params.id * 1
    const tour = tours.find(el => el.id === id)
    // if(id > tours.length){
    if (!tour) {
        return res.status(404).json({
            status: 'Failed',
            message: 'Not Found',
        })
    }
    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    })
}

const updateTour = (req, res) => {
    if (req.params.id > tours.length * 1) {
        return res.status(404).json({
            status: 'Failed',
            message: 'Not Found',
        })
    }
    res.status(200).json({
        status: 'success',
        data: {
            tour: 'update right here'
        }
    })
}

const deleteTour = (req, res) => {
    if (req.params.id > tours.length * 1) {
        return res.status(404).json({
            status: 'Failed',
            message: 'Not Found',
        })
    }
    res.status(204).json({
        status: 'success',
        data: null
    })
}

// User Methods section
const getAllUsers = ((req, res)=>{
    res.status(500).json({
        message:'Error',
        status:'Not created yet',
    })
})
const createUser = ((req, res)=>{
    res.status(500).json({
        message:'Error',
        status:'Not created yet',
    })
})
const getUser = ((req, res)=>{
    res.status(500).json({
        message:'Error',
        status:'Not created yet',
    })
})
const updateUser = ((req, res)=>{
    res.status(500).json({
        message:'Error',
        status:'Not created yet',
    })
})
const deleteUser = ((req, res)=>{
    res.status(500).json({
        message:'Error',
        status:'Not created yet',
    })
})

// requsts
// app.get('/api/v1/tours',getAllTours)
// app.post('/api/v1/tours', createTour)
// app.get('/api/v1/tours/:id',getTour)
// app.patch('/api/v1/tours/:id',updateTour)
// app.delete('/api/v1/tours/:id', deleteTour)

////OR
//routs back the response and no middleware perfoms after them
// app.route('/api/v1/tours').get(getAllTours).post(createTour)
// app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour)

// app.route('/api/v1/users').get(getAllUsers).post(createUser)
// app.route('/api/v1/users/:id').get(getUser).patch(updateUser).delete(deleteUser)

//mounting routers
//to create a new router for each resources
const tourRouter = express.Router()
const userRouter = express.Router()

tourRouter.route('/').get(getAllTours).post(createTour)
tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour)

userRouter.route('').get(getAllUsers).post(createUser)
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)

//this is a middleware, for each req all above middleware run but for these tow in every req the selected midlware run
app.use('/api/v1/tours',tourRouter)
app.use('/api/v1/users',userRouter)

//start server
const port = 3000
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})