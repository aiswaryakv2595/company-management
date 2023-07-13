const Employee = require("../model/Employee");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Project = require("../model/Project");

const employeeLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      const employee = await Employee.findOne({ email: email, role: "employee",isActive:true });
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
 const employeeProject = async (req,res) => {
  try {
    const employee = req.employee;
    const project = await Project.find({ "task.assigned_to": employee._id }).populate(
      "assigned_to task.assigned_to"
    );
    if (project) {
      res.status(200).json({ project });
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
 }
 const employeeTask = async (req,res) => {
  try {
    const id = req.query.id;
    const project = await Project.findById(id).populate('assigned_to task.assigned_to');
    
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const task = project.task;
    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
 }
  module.exports = {
    employeeLogin,
    employeeProject,
    employeeTask
  }