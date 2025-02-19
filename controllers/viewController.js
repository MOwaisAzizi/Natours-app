const Tour = require("../models/tourModel")
const catchAsync = require("../utiles/catchAsync")

exports.getOverview = catchAsync(async (req,res)=>{
  //1 get data from collection
    // const tours = await Tour.find()
    const tours = [1,2,3,4,5,6,7,8,9]
    //render for showing html (looking for base in views)
  //2-build templet
  //3-render the templet
    res.status(200).render('overview',{
      //local vars in base file
         tours
    })
  })

  exports.getTour = catchAsync(async(req,res)=>{
    //get data from requested tour including(guides and reveiws)
    // const tour = await Tour.findOne({slug:req.params.slug}).populate({path:'reviews',fields:'review user rating'})
    const tour = [{name:'tour'}]
    //2-build templete

    //2-render ti
    res.status(200).render('tour',{
      title : 'tour',
      tour
    })
  })