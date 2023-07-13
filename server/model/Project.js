const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
    assigned_to:{
        type:mongoose.Types.ObjectId,
        ref:'Employee',
        required:true
    },
    project_name:String,
    effort:String,
    time:String,
    starting_time:Date,
    ending_time:Date,
    deadline:Date,
    priority:String,
    attachment:String,
    description:String,
    status:{
        type:String,
        default:'progress'
    },
    task:[
        {
        title:String,
        description:String,
        starting_date:String,
        due_date:String,
        assigned_to:{
            type:mongoose.Types.ObjectId,
            ref:'Employee',
            
        },
        status:{
            type:String
        },
        priority:String
    }
],
})
module.exports = mongoose.model('Project', projectSchema);