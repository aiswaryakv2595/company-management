const mongoose = require('mongoose');

const timesheetSchema = new mongoose.Schema({
    employeeID:{
        type:mongoose.Types.ObjectId,
        ref:'Employee',
        required:true
    },
  date: {
    type: Date,
    required: true,
  },
  project_id: {
    type: mongoose.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  task: {
    type: mongoose.Types.ObjectId,
    ref: 'Project.task',
  },
  time: String,
});

module.exports = mongoose.model('Timesheet', timesheetSchema);
