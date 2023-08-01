const Employee = require("../model/Employee");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Department = require("../model/Department");
const mongoose = require("mongoose");
const Holiday = require("../model/Holiday");
const Onduty = require("../model/Onduty");
const Project = require("../model/Project");
const Complaints = require("../model/Complaints");
const moment = require("moment");


const adminSignup = async (req, res) => {
  try {
    const { first_name, last_name, designation, email, password } = req.body;
    //if user already exist
    const existingAdmin = await Employee.findOne({
      email: email,
      role: "admin",
    });
    if (existingAdmin) {
      return res
        .status(409)
        .json({ message: "Admin already exists with the provided email." });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create the admin document
    const admin = new Employee({
      first_name: first_name,
      last_name: last_name,
      designation: designation,
      email: email,
      password: hashedPassword,
      role: "admin",
    });

    // Save the admin document to the database
    await admin.save();

    // Return success response
    res.status(201).json({ message: "Admin signup successful." });
  } catch (error) {
    console.error("Error signing up admin:", error);
    res
      .status(500)
      .json({ message: "An error occurred while signing up admin." });
  }
};
const findAdmin = async (req, res) => {
  try {
    const isAdmin = await Employee.findOne({ role: 'admin' });

    if (isAdmin) {
    
      res.status(200).json({ message: 'success', exists: true });
    } else {
      res.status(200).json({ message: 'success', exists: false });
    }
  } catch (error) {
    console.error('Error finding admin:', error);
    res.status(500).json({ message: 'An error occurred while finding admin.' });
  }
};

const departmentDetails = async (req, res) => {
  try {
    const department = await Department.find();
    if (department) {
      res.status(200).json({ department });
    } else {
      res.status(404).json({ message: "Something went wrong" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

const addDepartment = async (req, res) => {
  try {
    const { department, designation } = req.body;
    const existingDepartment = await Department.findOne({
      designation: designation,
    });
    if (existingDepartment) {
      res.json({ message: "Department already exist" });
    } else {
      const departmentData = new Department({
        department: department,
        designation: designation,
      });
      await departmentData.save();
      res.status(201).json({ message: "Department added successfully" });
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Unable to add department" });
  }
};
const updateDepartment = async (req, res) => {
  try {
    const id = req.query.id;
    const { department, designation } = req.body;
    const updatedData = await Department.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          department,
          designation,
        },
      }
    );
    if (updatedData) res.status(201).json({ message: "Successfully added" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
const employeeDetails = async (req, res) => {
  try {
    const { role } = req.query;

    let aggregationPipeline = [
      
      {
        $lookup: {
          from: "departments",
          localField: "designation",
          foreignField: "_id",
          as: "department",
        },
      },
    ];

    if (role) {
      aggregationPipeline = [
        ...aggregationPipeline,
        {
          $match: { role },
        },
      ];
    }

    const employees = await Employee.aggregate(aggregationPipeline);
    console.log(employees);

    if (employees.length > 0) {
      return res.status(200).json({ employees });
    } else {
      return res.status(404).json({ message: "No employees found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// add employees
const addEmployees = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      joining_date,
      phone,
      dob,
      age,
      designation,
      gender,
      role,
      tl_id,
    } = req.body;
    const existingEmployee = await Employee.findOne({
      email: email,
      role: "employee",
    });
    if (existingEmployee) {
      return res
        .status(409)
        .json({ message: "Employee already exists with the provided email." });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const employee = new Employee({
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: hashedPassword,
      designation: designation,
      gender: gender,
      joining_date: joining_date,
      phone: phone,
      dob: dob,
      age: age,
      role: role,
      tl_id: tl_id,
    });
    await employee.save();
    res.status(201).json({ message: "Employee added successfully" });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Unable to register employee" });
  }
};
//employee status
const employeeStatus = async (req, res) => {
  try {
    const { id } = req.body;
    console.log(req.body);
    const employee = await Employee.findById({ _id: id });
    let updateStatus;
    if (employee.isActive) {
      updateStatus = false;
    } else {
      updateStatus = true;
    }
    await Employee.findByIdAndUpdate(
      { _id: id },
      {
        $set: { isActive: updateStatus },
      }
    );
    res.status(200).json({ employee });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
//search
const searchEmployee = async (req, res) => {
  try {
    const { emp_id, employeeName, designation } = req.body;

    let aggregationPipeline = [];
    aggregationPipeline.push({
      $lookup: {
        from: "departments",
        localField: "designation",
        foreignField: "_id",
        as: "department",
      },
    });

    if (emp_id) {
      aggregationPipeline.push({
        $match: { emp_id: { $regex: `^${emp_id}`, $options: "i" } },
      });
    }

    if (employeeName) {
      const regex = new RegExp(employeeName, "i");
      aggregationPipeline.push({
        $match: {
          $or: [{ first_name: regex }, { last_name: regex }],
        },
      });
    }

    if (designation) {
      const designationId = new mongoose.Types.ObjectId(designation);
      aggregationPipeline.push({
        $match: { designation: designationId },
      });
    }

    const search = await Employee.aggregate(aggregationPipeline);
    console.log(aggregationPipeline);
    console.log("search");

    if (Array.isArray(search) && search.length > 0) {
      res.status(200).json({ search, found: true });
    } else {
      res.status(200).json({ search: [], found: false });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const addHoliday = async (req, res) => {
  try {
    const { date, title } = req.body;
    console.log(req.body);
    const existingHoliday = await Holiday.findOne({ date: date });
    console.log(existingHoliday);
    if (existingHoliday) {
      res.status(404).json({ message: "No data available" });
    } else {
      const holiday = new Holiday({
        date: date,
        title: title,
      });
      await holiday.save();
      res.status(201).json({ holiday });
    }
  } catch (error) {
    console.log(error);
  }
};
const allHoliday = async (req, res) => {
  try {
    const holiday = await Holiday.find();
    if (holiday) res.status(200).json({ holiday });
  } catch (error) {
    res.status(404).json({ message: "page not found" });
  }
};
const dashboard = async (req, res) => {
  try {
    console.log("start");

    const projectCount = await Project.aggregate([
      { $group: { _id: null, projectCount: { $sum: 1 } } },
    ]);

    console.log("projectCount", projectCount);
    const taskCount = await Project.aggregate([
      { $unwind: "$task" },
      { $group: { _id: null, taskCount: { $sum: 1 } } },
    ]);
    const employeeCount = await Employee.aggregate([
      { $group: { _id: null, employeeCount: { $sum: 1 } } },
    ]);
    const ProjectStatusCounts = await Project.aggregate([
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
    const formattedDate = currentDate.toISOString().split("T")[0];

    const DutyStatusCounts = await Onduty.aggregate([
      { $match: { from: { $gte: formattedDate } } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
    console.log("DutyStatusCounts", DutyStatusCounts);
    //from: { $gte: formattedDate }, to add
    const LeaveData = await Onduty.aggregate([
      { $match: { from: { $gte: formattedDate }, status: "Leave" } },
      {
        $lookup: {
          from: "employees",
          localField: "employeeID",
          foreignField: "_id",
          as: "employeeData",
        },
      },
    ]);
    console.log("LeaveData", LeaveData);
    const pendingTasks = await Project.aggregate([
      { $unwind: "$task" },
      {
        $match: {
          $or: [
            // Tasks due in the next one week
            { "task.due_date": { $lte: oneWeekLater } },
            // Overdue tasks (due date is less than the current date)
            { "task.due_date": { $lt: formattedDate } },
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
    // Count of status 'todo', 'ongoing', and 'complete' in tasks
    const statusCountsTask = await Project.aggregate([
      { $unwind: "$task" },
      {
        $group: {
          _id: "$task.status",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      taskCount: taskCount.length ? taskCount[0].taskCount : 0,
      projectCount: projectCount.length ? projectCount[0].projectCount : 0,
      employeeCount: employeeCount.length ? employeeCount[0].employeeCount : 0,
      ProjectStatusCounts: ProjectStatusCounts.reduce(
        (acc, { _id, count }) => ({ ...acc, [_id]: count }),
        {}
      ),
      DutyStatusCounts: DutyStatusCounts.reduce(
        (acc, { _id, count }) => ({ ...acc, [_id]: count }),
        {}
      ),
      statusCountsTask: statusCountsTask.reduce(
        (acc, { _id, count }) => ({ ...acc, [_id]: count }),
        {}
      ),
      pendingTasks,
      LeaveData,
    });
  } catch (error) {
    console.error("Error in dashboard:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const viewAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaints.find().populate("employeeID");
    if (complaints) res.status(200).json({ complaints });
    else res.status(404).json({ message: "Complaints not found" });
  } catch (error) {}
};
const addResponse = async (req, res) => {
  try {
    const id = req.query.id;
    const response = req.body.response;
    console.log(req.body);
    const complaints = await Complaints.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          response: response,
          status: "Resolved",
        },
      },
      { new: true }
    );
    res.status(200).json({ complaints });
  } catch (error) {}
};
const addSalary = async (req, res) => {
  try {
    const {
      employeeID,
      base_salary,
      rent_allowance,
      pf,
      lop_deduction,
      from,
      to,
    } = req.body;
    const existingSalary = await Employee.findOne({
      _id: employeeID,
      $or: [
        { $and: [{ 'salary.from': { $lte: from } }, { 'salary.to': { $gte: from } }] },
        { $and: [{ 'salary.from': { $lte: to } }, { 'salary.to': { $gte: to } }] },
        { $and: [{ 'salary.from': { $gte: from } }, { 'salary.to': { $lte: to } }] },
      ],
    });
    if (existingSalary) {
      return res.status(400).json({ error: 'Salary entry already exists for the given dates.' });
    }
    const ondutyEntry = await Onduty.findOne({ employeeID });
    const lopCount = ondutyEntry?.lop || 0;
    const net_salary = Number(base_salary)+Number(rent_allowance)
    const total_deduction = Number(pf)+Number((lopCount*lop_deduction))
   const total_salary = net_salary-total_deduction
   console.log(total_salary)
    
    const newSalary = {
      base_salary,
      rent_allowance,
      pf,
      lop_deduction:lopCount?lop_deduction:0,
      net_salary,
      total_salary,
      total_deduction,
      from,
      to,
    };
    // Find the employee by ID and push the new salary entry to the 'salary' array
    await Employee.findByIdAndUpdate(
      employeeID,
      { $push: { salary: newSalary } },
      { new: true } 
    );
    res.status(200).json({ message: 'Salary entry added successfully.' });
  } catch (error) {
    console.error('Error adding salary:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
const getEmployeeSalary = async (req, res) => {
  try {
    const today = moment();
    const startOfMonth = today.startOf("month").toDate();
    console.log(startOfMonth)
    const endOfMonth = today.endOf("month").toDate();

    let aggregationPipeline = [
      {
        $match: {
          role: { $ne: "admin" },
          "salary.from":{ $gte: startOfMonth},
          "salary.to":{$lte: endOfMonth}
        },
      },
      {
        $lookup: {
          from: "departments",
          localField: "designation",
          foreignField: "_id",
          as: "department",
        },
      },
    ];
    
    const salary = await Employee.aggregate(aggregationPipeline);

    if (salary) {
      res.status(200).json({ salary });
    } else {
      res.status(404).json({ message: "No salary details found for the current month." });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching salary details.", error });
  }
};

module.exports = {
  findAdmin,
  dashboard,
  adminSignup,
  departmentDetails,
  addDepartment,
  updateDepartment,
  employeeDetails,
  addEmployees,
  searchEmployee,
  employeeStatus,
  addHoliday,
  allHoliday,
  viewAllComplaints,
  addResponse,
  addSalary,
  getEmployeeSalary
};
