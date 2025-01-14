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

app.use((req, res, next) => {
    req.requestTime = new Date();
0    next(); 
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

const postTour = (req, res) => {
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
    //to change id to number
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

// requsts
// app.get('/api/v1/tours',getAllTours)
// app.post('/api/v1/tours', postTour)
// app.get('/api/v1/tours/:id',getTour)
// app.patch('/api/v1/tours/:id',updateTour)
// app.delete('/api/v1/tours/:id', deleteTour)

////OR
//routs back the response and no middleware perfoms after them
app.route('/api/v1/tours').get(getAllTours).post(postTour)
app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour)

//start server
const port = 3000
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})