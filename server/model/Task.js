const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    title:String,
    project_id:{
        type:mongoose.Types.ObjectId,
        ref:'Project',
        required:true
    },
    description:String,
    starting_date:String,
    due_date:String,
    assigned_to:{
        type:mongoose.Types.ObjectId,
        ref:'Employee',
        required:true
    },
    status:{
        type:String,
        default:'todo'
    },
    priority:String
  
})
module.exports = mongoose.model('Task', taskSchema);