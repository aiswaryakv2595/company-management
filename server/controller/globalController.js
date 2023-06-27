const Employee = require("../model/Employee");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const employee = await Employee.findOne({ email: email });
      if (!employee) {
        return res.status(404).json({ message: "Employee not found." });
      }
      const isPasswordValid = await bcrypt.compare(password, employee.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password." });
      }
      // Generate a JWT token
      const token = jwt.sign(
        { empId: employee._id, email: employee.email,role:employee.role },
        process.env.JWT_ADMIN,
        { expiresIn: "1h" } // Token expiration time
      );
      res.status(200).json({ token: token, role: employee.role });
    } catch (error) {
      console.error("Error logging in admin:", error);
      res
        .status(500)
        .json({ message: "An error occurred while logging in admin." });
    }
  };
  
  const authUser = async (req, res) => {
    const employee = req.employee;
    console.log("employee", employee);
    res.status(200).json({ employee: employee });
  };
  module.exports = {
    login,
    authUser
  }