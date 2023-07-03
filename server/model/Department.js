const mongoose = require('mongoose')
const departmentSchema = new mongoose.Schema({
    department:String,
    designation:String
})
module.exports = mongoose.model('Department', departmentSchema);