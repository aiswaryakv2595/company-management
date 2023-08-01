const express = require("express");
const multer = require("../middleware/multer");
const {
  adminSignup,
  employeeDetails,
  addEmployees,
  departmentDetails,
  addDepartment,
  searchEmployee,
  employeeStatus,
  updateDepartment,
  addHoliday,
  allHoliday,
  dashboard,
  viewAllComplaints,
  addResponse,
  addSalary,
  getEmployeeSalary,
  findAdmin,
} = require("../controller/adminController");
const { jwtAuth } = require("../middleware/jwtAuth");
const {
  viewAllProject,
  addProject,
  editProject,
  updateProject,
} = require("../controller/projectController");

const adminRouter = express.Router();

adminRouter.post("/signup", adminSignup);
adminRouter.get("/admin-setup",findAdmin)
adminRouter.get("/department", departmentDetails);
adminRouter.post("/department", jwtAuth, addDepartment);
adminRouter.patch("/department", jwtAuth, updateDepartment);
adminRouter.get("/employees", jwtAuth, employeeDetails);
adminRouter.post("/addemployees", jwtAuth, addEmployees);
adminRouter.patch("/employee-status",jwtAuth,employeeStatus)
adminRouter.post("/search",jwtAuth,searchEmployee)

adminRouter.get("/project", jwtAuth, viewAllProject);
adminRouter.post(
  "/addproject",
  jwtAuth,
  multer.upload.single("attachment"),
  addProject
);
adminRouter.get(
  "/edit-project/:projectId",
  jwtAuth,
  multer.upload.single("attachment"),
  editProject
);
adminRouter.patch(
  "/edit-project/:projectId",
  jwtAuth,
  multer.upload.single("attachment"),
  updateProject
);
adminRouter.post('/add-holiday',jwtAuth,addHoliday)
adminRouter.get('/holiday',jwtAuth,allHoliday)
adminRouter.get('/dashboard',jwtAuth,dashboard)
adminRouter.get('/complaints',jwtAuth,viewAllComplaints)
adminRouter.patch('/add-response',jwtAuth,addResponse)

adminRouter.patch('/add-salary',jwtAuth,addSalary)
adminRouter.get('/salary',jwtAuth,getEmployeeSalary)
module.exports = adminRouter;
