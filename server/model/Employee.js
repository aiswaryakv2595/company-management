const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  emp_id: String,
  tl_id: String,
  first_name: String,
  last_name: String,
  email: String,
  password: String,
  designation: String,
  phone: String,
  gender: String,
  age: Number,
  dob: Date,
  joining_date:Date,
  end_date:Date,
  address: String,
  profilePic:String,
  role: String
});

// Pre-save middleware to generate emp_id
employeeSchema.pre('save', async function (next) {
  if (this.isNew) {
    const Employee = mongoose.model('Employee');
    const lastEmployee = await Employee.findOne({}, { emp_id: 1 }, { sort: { emp_id: -1 } });
    const lastEmpId = lastEmployee ? parseInt(lastEmployee.emp_id.slice(3), 10) : 200;
    this.emp_id = 'CMS' + (lastEmpId + 1);
  }
  next();
});


module.exports = mongoose.model('Employee', employeeSchema);
