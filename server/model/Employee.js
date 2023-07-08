const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  emp_id: String,
  tl_id: String,
  first_name: String,
  last_name: String,
  email: String,
  password: String,
  designation: {
    type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    validate: {
      validator: async function (_id) {
        const Department = mongoose.model('Department');
        const departmentCount = await Department.countDocuments({ _id });
        return departmentCount > 0;
      },
      message: 'Invalid designation.',
    },
  },
  phone: String,
  gender: String,
  age: Number,
  dob: Date,
  joining_date: Date,
  end_date: Date,
  address: String,
  profilePic: String,
  role: String,
  isActive:{
    type:Boolean,
    default:true
  }
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
