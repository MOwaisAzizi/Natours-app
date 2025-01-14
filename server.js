const dotenv = require('dotenv')
dotenv.config({path:'./config.env'})
const app = require('./app')

//reading environment varibles
console.log(process.env.NODE_ENV);

//express environment
// console.log(app.get('env'));
//node uses many envirnment

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})