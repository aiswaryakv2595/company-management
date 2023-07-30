const mongoose = require('mongoose');

const complaintsSchema = new mongoose.Schema({
    employeeID: {
        type: mongoose.Types.ObjectId,
        ref: 'Employee',
        required: true,
      },
      complaintID:String,
  subject: {
    type: String,
    required: true,
  },
  response:String,
  status:{
    type:String,
    default:'Pending'
  },
  description:String,
  
},{
  timestamps:true
});
// Pre-save middleware to generate emp_id
complaintsSchema.pre('save', async function (next) {
  if (this.isNew) {
    const Complaints = mongoose.model('Complaints');
    const lastComplaints = await Complaints.findOne({}, { complaintID: 1 }, { sort: { complaintID: -1 } });
    const lastCmpId = lastComplaints ? parseInt(lastComplaints.complaintID.slice(3), 10) : 1001;
    this.complaintID = 'CL' + (lastCmpId + 1);
  }
  next();
});
module.exports = mongoose.model('Complaints', complaintsSchema);
