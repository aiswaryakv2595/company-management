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
  // const updateProfile = async (req,res) => {
  //   try {
  //     const { phone, email, dob, gender, address } = req.body;
  //     const profilePic = req.file
  //     const id = req.employee._id;
  //     const profile = await Employee.findOneAndUpdate(
  //       { _id: id }, // Replace 'your-profile-id' with the actual ID
  //       {
  //         phone,
  //         email,
  //         dob,
  //         gender,
  //         address,
  //         profilePic: profilePic ? profilePic.filename : undefined,
  //       },
  //     );
  //     if (!profile) {
  //       return res.status(404).json({ message: 'Profile not found' });
  //     }
  
  //     res.status(200).json({ message: 'Profile updated successfully', profile });
      
  //   } catch (error) {
  //     console.error('Error updating profile:', error);
  //   res.status(500).json({ message: 'Internal server error' });
  //   }
  // }
  module.exports = {
    employeeLogin,
    // updateProfile
  }