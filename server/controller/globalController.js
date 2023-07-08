const Employee = require("../model/Employee");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
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
        { expiresIn: "1d" } // Token expiration time
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
    await employee.populate('designation');
    const designation = employee.designation;
    res.status(200).json({ employee: employee, designation: designation });
  };
  const updateProfile = async (req,res) => {
    try {
      const { phone, email, dob, gender, address } = req.body;
      const profilePic = req.file
      const id = req.employee._id;
      const profile = await Employee.findOneAndUpdate(
        { _id: id }, // Replace 'your-profile-id' with the actual ID
        {
          phone,
          email,
          dob,
          gender,
          address,
          profilePic: profilePic ? profilePic.filename : undefined,
        },
      );
      if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
  
      res.status(200).json({ message: 'Profile updated successfully', profile });
      
    } catch (error) {
      console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Internal server error' });
    }
  }
  let otpCheck
  let forgotEmail
  const forgotPassword = async (req, res) => {
    const { email } = req.body;
    forgotEmail = email
    console.log('forgot ',forgotEmail)
    try {
      const existingEmployee = await Employee.findOne({ email });
      if (!existingEmployee) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Generate a random OTP (6-digit code)
      otpCheck = Math.floor(100000 + Math.random() * 900000);
  
      await sendOtpEmail(email, otpCheck);
  
      return res.status(200).json({ email:email,message: 'OTP sent to your email' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'aiswaryakv2595@gmail.com',
      pass: 'pedleujgdkakgblu',
    },
  });
  const sendOtpEmail = async (email, otp) => {
    const mailOptions = {
      from: 'aiswaryakv2595@gmail.com',
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}`,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log('OTP email sent successfully');
    } catch (err) {
      console.error('Error sending OTP email:', err);
    }
  };
  
  const verifyOtp = async (req,res) => {
    const { otp } = req.body;
    try {
      if(otpCheck != otp){
        
        return res.status(404).json({ verified: false });
      }
      return res.status(200).json({ verified: true });
    } catch (error) {
      console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
    }
  }
  const resetPassword = async (req, res) => {
    const { password } = req.body;
   
    try {
    console.log('one')
      const user = await Employee.findOne({ email:forgotEmail });
      console.log("reseet password",forgotEmail)
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update the user's password
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      await user.save();
  
      return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  module.exports = {
    login,
    authUser,
    updateProfile,
    forgotPassword,
    resetPassword,
    verifyOtp
  }