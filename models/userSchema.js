const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    name:{type:String},
    email:{type:String,require},
    password:{type:String,require}
})
module.exports = mongoose.model('user',userSchema)          