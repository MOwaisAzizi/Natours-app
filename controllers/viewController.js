const Tour = require("../models/tourModel")
const catchAsync = require("../utiles/catchAsync")

exports.getOverview = catchAsync(async (req,res)=>{
    // const tours = await Tour.find()
    const tours = [1,2,3,4,5,6,7,8,9]
    //render for showing html (looking for base in views)
    res.status(200).render('overview',{
      //local vars in base file
         tours
    })
  })

  exports.getTour = (req,res)=>{
    res.status(200).render('tour',{
      title : 'tour'
    })
  }