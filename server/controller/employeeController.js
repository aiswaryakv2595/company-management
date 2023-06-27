const Employee = require("../model/Employee");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const employeeLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      const employee = await Employee.findOne({ email: email, role: "employee" });
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
  
  module.exports = {
    employeeLogin
  }