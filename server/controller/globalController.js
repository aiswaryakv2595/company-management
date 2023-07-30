const Employee = require("../model/Employee");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Onduty = require("../model/Onduty");
const Holiday = require("../model/Holiday");
const Timesheet = require("../model/Timesheet");
const Complaints = require("../model/Complaints");
const moment = require("moment");
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const employee = await Employee.findOne({ email: email, isActive: true });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }
    const isPasswordValid = await bcrypt.compare(password, employee.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password." });
    }

    const token = jwt.sign(
      { empId: employee._id, email: employee.email, role: employee.role },
      process.env.JWT_ADMIN,
      { expiresIn: "1d" }
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
 
  await employee.populate("designation");
  const designation = employee.designation;
 
  res.status(200).json({ employee: employee, designation: designation });
};
const updateProfile = async (req, res) => {
  try {
    const { phone, email, dob, gender, address } = req.body;
    const profilePic = req.file;
    const id = req.employee._id;
    const profile = await Employee.findOneAndUpdate(
      { _id: id },
      {
        phone,
        email,
        dob,
        gender,
        address,
        profilePic: profilePic ? profilePic.filename : undefined,
      }
    );
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({ message: "Profile updated successfully", profile });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
let otpCheck;
let forgotEmail;
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  forgotEmail = email;
  console.log("forgot ", forgotEmail);
  try {
    const existingEmployee = await Employee.findOne({ email });
    if (!existingEmployee) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a random OTP (6-digit code)
    otpCheck = Math.floor(100000 + Math.random() * 900000);

    await sendOtpEmail(email, otpCheck);

    return res
      .status(200)
      .json({ email: email, message: "OTP sent to your email" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "aiswaryakv2595@gmail.com",
    pass: "pedleujgdkakgblu",
  },
});
const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: "aiswaryakv2595@gmail.com",
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP for password reset is: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP email sent successfully");
  } catch (err) {
    console.error("Error sending OTP email:", err);
  }
};

const verifyOtp = async (req, res) => {
  const { otp } = req.body;
  try {
    if (otpCheck != otp) {
      return res.status(404).json({ verified: false });
    }
    return res.status(200).json({ verified: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const resetPassword = async (req, res) => {
  const { password } = req.body;

  try {
    console.log("one");
    const user = await Employee.findOne({ email: forgotEmail });
    console.log("reseet password", forgotEmail);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// on duty
const addOnduty = async (req, res) => {
  try {
    const { from, to, working, reason } = req.body;
    const employeeID = req.employee._id;

    const existingDuty = await Onduty.findOne({
      employeeID: employeeID,
      from: from,
    });
    if (existingDuty) {
      res.status(403).json({ message: "alredy added" });
    } else {
      const onduty = new Onduty({
        employeeID,
        tl_id: req.employee.tl_id,
        from,
        to,
        working,
        reason,
      });
      console.log(employeeID);
      await onduty.save();

      res.status(201).json({ onduty });
    }
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};
const ondutyListing = async (req, res) => {
  try {
    const employee_id = req.employee._id;
    const onduty = await Onduty.find({ employeeID: employee_id });
    if (onduty) res.status(200).json({ onduty });
    else res.status(404).json({ message: "NO Duties found" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
const ondutyListingAll = async (req, res) => {
  try {
    const employee_id = req.employee._id;
    const { from, to } = req.query;

    const onduty = await Onduty.find({
      tl_id: employee_id,
      from: {
        $gte: from,
        $lte: to,
      },
    }).populate("employeeID");

    if (onduty.length > 0) {
      res.status(200).json({ onduty });
    } else {
      res.status(404).json({ message: "No duties found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const ondutyApprove = async (req, res) => {
  try {
    const { id } = req.body;
    let dutyStatus;
    const existingDuty = await Onduty.findById(id);
    console.log("existing", existingDuty);
    if (existingDuty.status == "Absent") {
      dutyStatus = "Present";
    } else dutyStatus = "Absent";
    console.log(dutyStatus);
    const onduty = await Onduty.findByIdAndUpdate(
      id,
      {
        $set: {
          status: dutyStatus,
        },
      },
      { new: true }
    ).populate("employeeID");
    
    // Convert the from and to dates to strings in the desired format
    onduty.from = new Date(onduty.from).toDateString();
    onduty.to = new Date(onduty.to).toDateString();

    console.log(onduty);
    res.status(200).json({ onduty });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

const addLeave = async (req, res) => {
  const currentDate = new Date().toISOString().split("T")[0];
  try {
    const { from, to, leave_duration, onduty_type, reason } = req.body;
    const employeeID = req.employee._id;
    const existingLeave = await Onduty.findOne({
      employeeID: employeeID,
      from: from,
      status: "Leave",
    });
    if (existingLeave) {
      res.status(403).json({ message: "alredy added" });
    } else {
      const leave = new Onduty({
        employeeID,
        tl_id: req.employee.tl_id,
        leave_requested: currentDate,
        from,
        to,
        onduty_type,
        status: "Leave",
        leave_duration,
        reason,
      });
      await leave.save();
      res.status(200).json({ leave });
    }
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};
const leaveListing = async (req, res) => {
  try {
    const employee_id = req.employee._id;
    const leave = await Onduty.find({
      employeeID: employee_id,
      status: "Leave",
    });
    if (leave) res.status(200).json({ leave });
    else res.status(404).json({ message: "NO Leave found" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
const leaveListingAll = async (req, res) => {
  try {
    const employee_id = req.employee._id;
    const { from, to } = req.query;
    const currentDate = new Date().toISOString().split("T")[0];
    let leave;
    if (from != "") {
      leave = await Onduty.find({
        tl_id: employee_id,
        from: {
          $gte: from,
          $lte: to,
        },
        status: "Leave",
      }).populate("employeeID");
    } else {
      leave = await Onduty.find({
        tl_id: employee_id,
        leave_requested: currentDate,
        status: "Leave",
      }).populate("employeeID");
    }

    if (leave.length > 0) {
      res.status(200).json({ leave });
    } else {
      res.status(404).json({ message: "No duties found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const leaveApprove = async (req, res) => {
  try {
    const { id } = req.body;
    const existingLeave = await Onduty.findById({ _id: id, status: "Leave" });
    const leaveDuration = Math.ceil(
      (new Date(existingLeave.to) - new Date(existingLeave.from)) / (1000 * 60 * 60 * 24)
    );

    let leaveStatus;
    if (existingLeave.leave_status === "Pending" || existingLeave.leave_status === "Rejected") {
      leaveStatus = "Accepted";
      const leaveDates = getDatesArray(new Date(existingLeave.from), new Date(existingLeave.to));
      const holidays = await Holiday.find({ date: { $in: leaveDates } });
      const holidayDates = holidays.map(holiday => holiday.date);

      const validLeaveDates = leaveDates.filter(date => !holidayDates.includes(date));

      if (leaveDuration > existingLeave.earnedLeave) {
        existingLeave.lop = leaveDuration - existingLeave.earnedLeave;
        existingLeave.earnedLeave = 0;
      } else {
        existingLeave.earnedLeave -= leaveDuration;
      }

      // existingLeave.from = validLeaveDates[0];
      // existingLeave.to = validLeaveDates[validLeaveDates.length - 1];
    } else if (existingLeave.leave_status === "Accepted") {
      leaveStatus = "Rejected";
      existingLeave.earnedLeave += leaveDuration;
      existingLeave.lop = 0;
    } else {
      leaveStatus = existingLeave.leave_status; // Leave status remains unchanged
    }

    await existingLeave.save();

    const leave = await Onduty.findByIdAndUpdate(
      { _id: id, status: "Leave" },
      {
        $set: {
          leave_status: leaveStatus,
        },
      },
      { new: true }
    ).populate("employeeID");
    
    // Convert the from and to dates to the desired formats
    // leave.from = new Date(leave.from).toString().split(' ').slice(0, 5).join(' ');
    // leave.to = new Date(leave.to).toString().split(' ').slice(0, 5).join(' ');

    res.status(200).json({ leave });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};




// Helper function to get an array of dates between two dates
function getDatesArray(startDate, endDate) {
  const datesArray = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    datesArray.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return datesArray;
}

const getTimesheet = async (req, res) => {
  try {
    const timesheet = await Timesheet.find({ employeeID: req.employee._id }).populate('project_id');

    console.log('timesheets', timesheet);

    if (timesheet.length > 0) {
      res.status(200).json({ timesheet });
    } else {
      res.status(404).json({ message: "No timesheets found" });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

 const addTimesheet = async (req,res) => {
 try {
  const {date,project_id,task,time} = req.body
  const employeeID = req.employee._id
  const existingTimesheet = await Timesheet.findOne({date:date,employeeID:employeeID})
  if(existingTimesheet)
  res.status(409).json({message:"timesheet exist"})
  else{
    const timesheet = new Timesheet({
      employeeID:employeeID,
      date:date,
      project_id:project_id,
      task:task,
      time:time
    })

    await timesheet.save()
    res.status(201).json({timesheet})
  }
 } catch (error) {
  res.status(500).json({message:error})
 }
 }
 const attendanceReport = async (req, res) => {
  try {
    const employeeID = req.employee._id;
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const firstDayOfMonthString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`;

    // Get the last day of the current month
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const lastDayOfMonthISO = lastDayOfMonth.toISOString();
    const attendanceData = await Onduty.aggregate([{
      $match: {
        employeeID,
        from: { $gte: firstDayOfMonthString },
        to: { $lte: lastDayOfMonthISO },
      },
    }])
    const statusCounts = await Onduty.aggregate([
      {
        $match: {
          employeeID,
          from: { $gte: firstDayOfMonthString },
          to: { $lte: lastDayOfMonthISO },
        },
      },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const holidayCounts = await Holiday.aggregate([
      {
        $match: {
         
          date: { $gte: firstDayOfMonthString },
          date: { $lte: lastDayOfMonthISO },
        },
      },
      { $group: { _id: '$date', count: { $sum: 1 } } },
    ]);

    const ondutyTypeCounts = await Onduty.aggregate([
      {
        $match: {
          employeeID,
          from: { $gte: firstDayOfMonthString },
          to: { $lte: lastDayOfMonthISO },
        },
      },
      { $group: { _id: '$onduty_type', count: { $sum: 1 } } },
    ]);
   
   
    const finalEntry = attendanceData[attendanceData.length - 1];

    
    const totalEarnedLeave = finalEntry ? finalEntry.earnedLeave : 0;
  
     console.log('totalEarnedLeave',totalEarnedLeave)
    const lopBalances = await Onduty.aggregate([
      {
        $match: {
          employeeID,
          status: 'Leave',
          from: { $gte: firstDayOfMonthString },
          to: { $lte: lastDayOfMonthISO },
        },
      },
      { $group: { _id: null, totalLOP: { $sum: '$lop' } } },
    ]);

    res.status(200).json({
      ondutyTypeCounts: ondutyTypeCounts,
      lopBalance: lopBalances.length ? lopBalances[0].totalLOP : 0,
      statusCounts: statusCounts,
      holidayCounts:holidayCounts,
      attendance:attendanceData,
      balanceLeave: totalEarnedLeave,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const addComplaints = async (req,res) => {
try {
  console.log('stay')
  const {subject,description} = req.body
  console.log('body',req.body)
  const complaints = new Complaints({
    employeeID:req.employee._id,
    subject:subject,
    description:description
  })
  await complaints.save()
  res.status(201).json({complaints})
} catch (error) {
  res.status(500).json({ error: 'Internal server error' });
}
}

const viewComplaints = async (req,res) => {
  try {
    const complaints = await Complaints.find({employeeID:req.employee._id})
    if(complaints)
    res.status(200).json({complaints})
    else
    res.status(404).json({message:"no data found"})
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

const getSalary = async (req, res) => {
  try {
    const today = moment();
    const startOfMonth = today.startOf("month").toDate();
    console.log(startOfMonth)
    const endOfMonth = today.endOf("month").toDate();
console.log('start')
    console.log(req.employee._id)
    let aggregationPipeline = [
      {
        $match: {
          _id: req.employee._id,
          // Filter employees whose joining_date falls within the current month
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
    console.log(salary)

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
  login,
  authUser,
  updateProfile,
  forgotPassword,
  resetPassword,
  verifyOtp,
  ondutyListing,
  ondutyListingAll,
  addOnduty,
  ondutyApprove,
  addLeave,
  leaveListing,
  leaveListingAll,
  leaveApprove,
  getTimesheet,
  addTimesheet,
  attendanceReport,
  addComplaints,
  viewComplaints,
  getSalary
};
