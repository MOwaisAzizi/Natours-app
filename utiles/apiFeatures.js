class APIFeatures {
    constructor(query,queryObject){
        this.query = query
        this.queryObject = queryObject
    }

    filter(){
        const queryObj = {...this.queryObject}
        const excludedField = ['sort', 'page', 'fields', 'limit']
        excludedField.forEach(el => delete queryObj[el])
        let queryStr = JSON.stringify(queryObj)
        //to add a doller sighn to our query in order to use it in mongoose
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, match => `$${match}`)
        this.query = this.query.find(JSON.parse(queryStr))
        //we return this from it becouse of chaining of object(without return it is not return any thing)
        //this return intire object
        return this
    }

    sort(){
        if (this.queryObject.sort) {
            const sortBy = this.queryObject.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        } else {
            this.query = this.query.sort('-createdAt')
        }
        return this
    }

    limitFields(){
        if (this.queryObject.fields) {
            const fields =this.queryObject.fields.split(',').join(' ')
            this.query = this.query.select(fields)
        }
        return this
    }

    paginate(){
        const page = (this.queryObject.page * 1) || 1;
        const limit = (this.queryObject.limit * 1) || 100;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
       return this
    }
}
module.exports = APIFeatures