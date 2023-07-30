const Employee = require("../model/Employee");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Project = require("../model/Project");

const employeeLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const employee = await Employee.findOne({
      email: email,
      role: "employee",
      isActive: true,
    });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }
    const isPasswordValid = await bcrypt.compare(password, employee.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password." });
    }
    // Generate a JWT token
    const token = jwt.sign(
      { empId: employee._id, email: employee.email },
      process.env.JWT_EMPLOYEE,
      { expiresIn: "1h" } // Token expiration time
    );
    res.status(200).json({ token: token });
  } catch (error) {
    console.error("Error logging in employee:", error);
    res
      .status(500)
      .json({ message: "An error occurred while logging in admin." });
  }
};
const employeeProject = async (req, res) => {
  try {
    const employee = req.employee;
    const project = await Project.find({
      "task.assigned_to": employee._id,
    }).populate("assigned_to task.assigned_to");
    if (project) {
      res.status(200).json({ project });
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};
const employeeTask = async (req, res) => {
  try {
    const id = req.query.id;
    const employeeID = req.employee
    const project = await Project.findById(id).populate(
      "assigned_to task.assigned_to"
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const tasks = project.task.filter((task) => {
  
  return task.assigned_to.toString() === employeeID.toString();
});
    res.status(200).json({ task:tasks });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
const dashboard = async (req, res) => {
  try {
    const employeeID = req.employee._id;
    

    console.log("Before taskCount aggregation");
    console.log(employeeID);
    const taskCount = await Project.aggregate([
      { $unwind: "$task" }, 
      { $match: { "task.assigned_to": employeeID } }, 
      { $group: { _id: null, taskCount: { $sum: 1 } } }, 
    ]);
   
    // Count of status 'todo', 'ongoing', and 'complete' in tasks
    const statusCounts = await Project.aggregate([
      { $unwind: "$task" },
      { $match: { "task.assigned_to": employeeID } },

      {
        $group: {
          _id: "$task.status",
          count: { $sum: 1 },
        },
      },
    ]);
 
    // Pending tasks where due_date is close to one week after the current date
    const oneWeekLater = new Date();
    oneWeekLater.setDate(oneWeekLater.getDate() + 7);
    const currentDate = new Date();
    const pendingTasks = await Project.aggregate([
      { $unwind: "$task" },
      {
        $match: {
          "task.assigned_to": employeeID,
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
    
    console.log('pendingTasks',pendingTasks)
    res.status(200).json({
      taskCount: taskCount.length ? taskCount[0].taskCount : 0,
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
  employeeLogin,
  employeeProject,
  employeeTask,
  dashboard,
};
