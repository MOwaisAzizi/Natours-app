const express = require('express')
const {getAllTours, createTour, getTour, updateTour, deleteTour} = require('../controllers/tourControllers')

  const router = express.Router()

//   spacial kind of parmas
  router.param('id',(req,res,next,val)=>{
    console.log('id Params is :'+val);
    next()
  })
  
  router.route('/').get(getAllTours).post(createTour)
  router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour)
  
  module.exports = router