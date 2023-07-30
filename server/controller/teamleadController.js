const Project = require('../model/Project')
const Employee = require('../model/Employee')

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
  module.exports = {
    dashboard
  }