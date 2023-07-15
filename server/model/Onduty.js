const mongoose = require('mongoose')
const ondutySchema = new mongoose.Schema({
    employeeID:{
        type:mongoose.Types.ObjectId,
        ref:'Employee',
        required:true
    },
    onduty_type:{
        type:String,
        default:'Onduty'
    },
    onduty_date:String,
    requested_date:String,
    status:{
        type:String,
        default:'Absent'
    },
    working:String,
    reason:String
    
})
module.exports = mongoose.model('Onduty', ondutySchema);