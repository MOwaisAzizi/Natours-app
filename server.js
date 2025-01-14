const app = require('./app')

//express environment
console.log(app.get('env'));
//node uses many envirnment
console.log(process.env);

const port = 3000
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})