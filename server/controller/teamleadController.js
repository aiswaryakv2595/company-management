const Project = require('../model/Project')
const Employee = require('../model/Employee')
const nodemailer = require("nodemailer");

const dashboard = async (req, res) => {
  try {
    const employeeID = req.employee._id;
    
    console.log(employeeID);
    const projectCount = await Project.aggregate([
      { $match: { assigned_to: employeeID } }, 
      { $group: { _id: null, projectCount: { $sum: 1 } } }, 
    ]);
   
    // Count of status 'todo', 'ongoing', and 'complete' in tasks
    const statusCounts = await Project.aggregate([
      { $match: { assigned_to: employeeID } },

      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
 
    const oneWeekLater = new Date();
    oneWeekLater.setDate(oneWeekLater.getDate() + 7);
    const currentDate = new Date();
    const pendingTasks = await Project.aggregate([
      { $unwind: "$task" },
      {
        
        $match: {
          assigned_to: employeeID,
          
          $or: [
            // Tasks due in the next one week
            { "task.due_date": { $lte: oneWeekLater.toISOString() } },
            // Overdue tasks (due date is less than the current date)
            { "task.due_date": { $lt: currentDate.toISOString() } },
          ],
        },
      },
     
      {
        $match: {
          $or: [
            // Tasks due in the next one week
            { "task.due_date": { $lte: oneWeekLater.toISOString() } },
            // Overdue tasks (due date is less than the current date)
            { "task.due_date": { $lt: currentDate.toISOString() } },
          ],
        },
      },
      {
        $project: {
          _id: 0,
          title: "$task.title",
          description: "$task.description",
          due_date: "$task.due_date",
        },
      },
    ]);
    
  
    res.status(200).json({
      projectCount: projectCount.length ? projectCount[0].projectCount : 0,
      statusCounts: statusCounts.reduce(
        (acc, { _id, count }) => ({ ...acc, [_id]: count }),
        {}
      ),
      pendingTasks,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MY_EMAIL,
    pass: process.env.MY_PASSWORD,
  },
});
const sendMeetingLink = async (req,res) => {
  const { from,meetingID, emailAddresses } = req.body;
  const mailOptions = {
    from: process.env.MY_EMAIL, //change to from later
    to: emailAddresses.join(', '), 
    subject: 'Meeting ID Invitation',
    text: `You are invited to join a meeting with the ID: ${meetingID}.`,
  };
   // Send the email
   transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Failed to send email:', error);
      res.status(500).json({ error: 'Failed to send email' });
    } else {
      console.log('Email sent successfully:', info.response);
      res.json({ success: true });
    }
  });
}
const teamMembers = async (req,res) => {
  try {
    const team = await Employee.find({tl_id:req.employee._id})
    if(team)
    res.status(200).json({team})
    else
    res.status(404).json({message:"no result found"})
  } catch (error) {
    res.status(500).json({error})
  }
}
  module.exports = {
    dashboard,
    teamMembers,
    sendMeetingLink
  }