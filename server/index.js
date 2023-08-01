const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path')
const app = express();
const nodemailer = require('nodemailer');
const cron = require('node-cron');

app.use(morgan('dev'));
dotenv.config();
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./public")));


mongoose
  .connect(process.env.CMS)
  .then(() => {
  
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
    async function sendReminderEmails() {
      try {
        
        const currentDate = new Date();
        const projects = await Project.find({ $or: [{ deadline: { $lte: currentDate } }, { 'task.due_date': { $lte: currentDate } }] })
          .populate('assigned_to task.assigned_to')
          .exec();
    
        // Loop through each project and send reminder emails
        for (const project of projects) {
          // Check project deadline
          if (project.deadline && project.deadline <= currentDate) {
            const assignedToEmployee = project.assigned_to;
            const projectName = project.project_name;
            
            const transporter = nodemailer.createTransport({
              service: 'Gmail',
              auth: {
                user: process.env.MY_EMAIL,
                pass: process.env.MY_PASSWORD,
              },
            });
    
            const mailOptions = {
              from: process.env.MY_EMAIL,
              to: process.env.MY_EMAIL, // later change mail id
              subject: `Reminder: Project "${projectName}" deadline approaching`,
              text: `Dear ${assignedToEmployee.first_name},\n\nThis is a reminder that the deadline for the project "${projectName}" is approaching. Please complete the project tasks as soon as possible.\n\nRegards,\nYour Company`,
            };
    
            await transporter.sendMail(mailOptions);
            console.log(`Reminder email sent to ${assignedToEmployee.first_name} for project deadline`);
          }
    
          // Check task due dates
          for (const task of project.task) {
            if (task.due_date && task.due_date <= currentDate) {
              const assignedToEmployee = await Employee.findById(task.assigned_to);
              const taskTitle = task.title;
              // Send the email using the same transporter defined earlier
              const mailOptions = {
                from: process.env.MY_EMAIL,
                to: process.env.MY_EMAIL, // Assuming 'Employee' model has an 'email' field
                subject: `Reminder: Task "${taskTitle}" due date approaching`,
                text: `Dear ${assignedToEmployee.first_name},\n\nThis is a reminder that the due date for the task "${taskTitle}" is approaching. Please complete the task as soon as possible.\n\nRegards,\nYour Company`,
              };
    
              await transporter.sendMail(mailOptions);
              console.log(`Reminder email sent to ${assignedToEmployee.first_name} for task due date`);
            }
          }
        }
      } catch (err) {
        console.error('Error sending reminder emails:', err);
      }
    }
    
    // cron.schedule('0 9 * * *', sendReminderEmails);
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
const Project = require('./model/Project');

app.use('/api/admin', adminRouter);
app.use('/api/employee', employeeRouter);
app.use('/api/teamlead', teamleadRouter);
app.use('/api',commonRouter)