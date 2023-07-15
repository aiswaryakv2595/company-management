const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path')
const app = express();

app.use(morgan('dev'));
dotenv.config();
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./public")));
dotenv.config();

mongoose
  .connect('mongodb://127.0.0.1:27017/CMS')
  .then(() => {
    // Initialize the "Admin" department and "HR" designation
    const Department = require('./model/Department');
    const initDepartment = async () => {
      try {
        const existingDepartment = await Department.findOne({
          department: 'Admin',
          designation: 'HR'
        });

        if (!existingDepartment) {
          const adminDepartment = new Department({
            department: 'Admin',
            designation: 'HR'
          });

          await adminDepartment.save();
          console.log('Initial department and designation added successfully.');
        } else {
          console.log('Initial department and designation already exist.');
        }
      } catch (error) {
        console.error('Failed to add/validate initial department and designation:', error);
      }
    };

    initDepartment();

    // Start the server
    app.listen(5000, () => {
      console.log('Server is running on port 5000');
    });
  })
  .catch((err) => console.log(err));

// Admin routes
const adminRouter = require('./routes/adminRoutes');
const employeeRouter = require('./routes/employeeRoute');
const teamleadRouter = require('./routes/teamleadRoutes');

const commonRouter = require('./routes/commonRoutes');

app.use('/api/admin', adminRouter);
app.use('/api/employee', employeeRouter);
app.use('/api/teamlead', teamleadRouter);
app.use('/api',commonRouter)

