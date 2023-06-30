const Employee = require("../model/Employee");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

const employeeDetails = async (req, res) => {
  try {
    const { role } = req.query;
    const employee = await Employee.find();
    const teamLeaders = employee.filter((employee) => employee.role === role);
    if(role){
      return res.json({ employee: teamLeaders });
    }
    else if (employee) {
      return res.status(200).json({ employee });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {}
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
      role
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
      joining_date:joining_date,
      phone:phone,
      dob:dob,
      age:age,
      role: role,
    });
    await employee.save();
    res.status(201).json({ message: "Employee added successfully" });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Unable to register employee" });
  }
};
module.exports = {
  adminSignup,
  // adminLogin,
  // adminDetails,
  employeeDetails,
  addEmployees,
};
