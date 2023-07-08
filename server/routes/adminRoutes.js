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
adminRouter.get("/department", jwtAuth, departmentDetails);
adminRouter.post("/department", jwtAuth, addDepartment);

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

module.exports = adminRouter;
