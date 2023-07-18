const mongoose = require('mongoose');

const ondutySchema = new mongoose.Schema({
  employeeID: {
    type: mongoose.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  tl_id: {
    type: mongoose.Types.ObjectId,
    ref: 'Employee',
  },
  onduty_type: {
    type: String,
    default: 'Onduty',
  },
  from: String,
  to: String,
  leave_requested:String,
  status: {
    type: String,
    default: 'Absent',
  },
  working: String,
  leave_duration:String,
  leave_status:{
    type:String,
    default:"Pending"
  },
  reason: String,
  earnedLeave: {
    type: Number,
    default: 5,
    min: 0,
  },
  lop:Number,
  earnedLeaveReset: {
    type: Date,
    default: getFirstDayOfNextMonth,
  },
});

// Function to get the first day of the next month
function getFirstDayOfNextMonth() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const nextMonthDate = new Date(currentYear, currentMonth + 1, 1);
  return nextMonthDate;
}


ondutySchema.pre('save', function (next) {
  const currentDate = new Date();
  if (currentDate >= this.earnedLeaveReset) {
    this.earnedLeave = 5;
    this.earnedLeaveReset = getFirstDayOfNextMonth(); 
  }

//   if (this.status === 'Leave') {
//     const from = new Date(this.from);
//     const to = new Date(this.to);
//     const leaveDuration = Math.ceil((to - from) / (1000 * 60 * 60 * 24));

//     if (leaveDuration > this.earnedLeave) {
//       this.lop = leaveDuration - this.earnedLeave;
//       this.earnedLeave = 0;
//     } else {
//       this.earnedLeave -= leaveDuration;
//     }
//   }
  next(); 
});


module.exports = mongoose.model('Onduty', ondutySchema);
