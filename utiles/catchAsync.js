//for handling catch err and send it to global err controler
module.exports = fn => {
    //this return is for preventing calling the function in the begganing but call it whin routing
    return (req,res,next) =>{
    fn(req,res,next).catch(next)//err=>next(err)
}}