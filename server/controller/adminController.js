const Employee = require("../model/Employee");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Department = require("../model/Department");
const mongoose = require('mongoose');

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
const employeeDetails = async (req, res) => {
  try {
    const { role } = req.query;

    let aggregationPipeline = [
      {
        $lookup: {
          from: "departments", // Name of the Department collection
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
    });
    await employee.save();
    res.status(201).json({ message: "Employee added successfully" });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Unable to register employee" });
  }
};
//employee status
const employeeStatus = async (req,res) => {
  try {
    const {id} = req.body
    console.log(req.body)
    const employee = await Employee.findById({_id:id})
    let updateStatus
    if(employee.isActive){
      updateStatus = false
    }
    else{
      updateStatus = true
    }
    await Employee.findByIdAndUpdate({_id:id},{
      $set:{isActive:updateStatus}
    })
   res.status(200).json({employee})
  } catch (error) {
    res.status(500).json({message:"Something went wrong"})
  }
}
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
    console.log(aggregationPipeline)
    console.log('search');

    if (Array.isArray(search) && search.length > 0) {
      res.status(200).json({ search });
    } else if (Array.isArray(search) && search.length === 0) {
      res.status(404).json({ message: "No matching records found" });
    } else {
      res.status(200).json({ search: [] });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  adminSignup,
  departmentDetails,
  addDepartment,
  employeeDetails,
  addEmployees,
  searchEmployee,
  employeeStatus
};
