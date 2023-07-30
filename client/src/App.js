import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Dashboard from "./scenes/admin/dashboard";
import Layout from "./scenes/admin/layout";
import LoginForm from "./components/Login";
import AllEmployees from "./scenes/admin/employees";
import AdminPrivateRoutes from "./routes/AdminPrivateRoute";
import AdminPublicRoutes from "./routes/AdminPublicRoutes";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EmployeeLayout from "./scenes/employees/employeelayout/EmployeeLayout";
import EmpDashboard from "./scenes/employees/dashboard/EmpDashboard";
import LeadDashboard from "./scenes/teamlead/dashboard/LeadDashboard";
import LeadLayout from "./scenes/teamlead/layout/LeadLayout";
import EmployeePrivate from "./routes/EmployeePrivate";
import TlPrivateRoute from "./routes/TlPrivateRoute";
import AllProjects from "./scenes/admin/project/AllProjects";
import ViewProject from "./scenes/teamlead/project/ViewProject";
import EditProject from "./scenes/admin/project/EditProject";
import Department from "./scenes/admin/department/Department";
import ProfileSettings from "./scenes/profile/ProfileSettings";
import ForgotPassword from "./scenes/password/ForgotPassword";
import OtpPage from "./scenes/password/OtpPage";
import ResetPassword from "./scenes/password/ResetPassword";
import AddTask from "./scenes/teamlead/project/AddTask";
import UserProject from "./scenes/employees/project/UserProject";
import UserTask from "./scenes/employees/project/UserTask";
import OndutyList from "./scenes/onduty/OndutyList";
import OndutyApprove from "./scenes/onduty/OndutyApprove";
import LeaveList from "./scenes/leave/LeaveList";
import LeaveApproval from "./scenes/leave/LeaveApproval";
import Holiday from "./scenes/admin/holiday/Holiday";

import TeamleadTimesheet from "./scenes/teamlead/timesheet/TeamleadTimesheet";
import EmployeeTimesheet from "./scenes/employees/timesheet/EmployeeTimesheet";
import AttendanceReport from "./scenes/attendance/AttendanceReport";
import Complaints from "./scenes/complaints/Complaints";
import ApproveComplaints from "./scenes/complaints/ApproveComplaints";
import VideoCallPage from "./scenes/meet/VideoCallPage";
import Payroll from "./scenes/admin/payroll/Payroll";
import SlipGenerator from "./scenes/admin/payroll/SlipGenerator";
import EmployeePayload from "./scenes/admin/payroll/EmployeePayload";
import VideoPlayer from "./scenes/meet/VideoPlayer";
import Options from "./scenes/meet/Options";
import { adminApi } from "./redux/api/employeeApi";
import { logout,setAdminExists } from "./redux/slices/authSlice";
import AdminSetup from "./components/Admin/AdminSetup";

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
   
    const checkAdminExistence = async () => {
      try {
       
        const response = await adminApi.findAdmin()
        const { exists } = response; 
        dispatch(setAdminExists(exists));
      } catch (error) {
        console.error('Error checking admin existence:', error);
      }
    };

    checkAdminExistence();
  }, [dispatch]);
  return (
    <div className="app">
      <ToastContainer />

      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route element={<AdminPrivateRoutes />}>
            <Route element={<Layout />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/department" element={<Department />} />
              <Route path="/admin/employees" element={<AllEmployees />} />
              <Route path="/admin/projects" element={<AllProjects />} />
              <Route
                path="/admin/edit-project/:projectId"
                element={<EditProject />}
              />
              <Route
                path="/admin/onduty-approval"
                element={<OndutyApprove />}
              />
              <Route path="/admin/leave-approval" element={<LeaveApproval />} />
              <Route path="/admin/holiday" element={<Holiday />} />
              <Route path="/admin/requests" element={<ApproveComplaints />} />
              <Route path="admin/payroll" element={<Payroll />} />
              <Route path="/admin/slip" element={<SlipGenerator />} />
            </Route>
          </Route>
          <Route element={<AdminPublicRoutes />}>
         
          <Route path="/" element={<LoginForm />} />
       
          <Route path="/admin-setup" element={<AdminSetup />} />
      
          
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/otp" element={<OtpPage />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>
          <Route element={<EmployeePrivate />}>
            <Route element={<EmployeeLayout />}>
              <Route path="/dashboard" element={<EmpDashboard />} />
              <Route path="/profile" element={<ProfileSettings />} />
              <Route path="/view-project" element={<UserProject />} />
              <Route path="/view-task" element={<UserTask />} />
              <Route path="/onduty" element={<OndutyList />} />
              <Route path="/leaves" element={<LeaveList />} />
              <Route path="/timesheet" element={<EmployeeTimesheet />} />
              <Route path="/attendance" element={<AttendanceReport />} />
              <Route path="/request" element={<Complaints />} />
              <Route path="/payroll" element={<EmployeePayload />} />
              <Route path="/slip" element={<SlipGenerator />} />
              <Route path="/meet" element={<Options />} />
              <Route path="/room/:roomId" element={<VideoPlayer />} />
            </Route>
          </Route>
          {/* teamlead routes */}
          <Route element={<TlPrivateRoute />}>
            <Route element={<LeadLayout />}>
              <Route path="/teamlead/profile" element={<ProfileSettings />} />
              <Route path="/teamlead/dashboard" element={<LeadDashboard />} />
              <Route path="/teamlead/view-project" element={<ViewProject />} />
              <Route path="/teamlead/view-task" element={<AddTask />} />
              <Route path="/teamlead/onduty" element={<OndutyList />} />
              <Route
                path="/teamlead/onduty-approval"
                element={<OndutyApprove />}
              />
              <Route path="/teamlead/leaves" element={<LeaveList />} />
              <Route
                path="/teamlead/leave-approval"
                element={<LeaveApproval />}
              />
              <Route
                path="/teamlead/timesheet"
                element={<TeamleadTimesheet />}
              />
              <Route
                path="/teamlead/attendance"
                element={<AttendanceReport />}
              />
              <Route path="/teamlead/request" element={<Complaints />} />
              <Route path="/teamlead/payroll" element={<EmployeePayload />} />
              <Route path="/teamlead/slip" element={<SlipGenerator />} />
              <Route path="/teamlead/meet" element={<VideoCallPage />} />
              <Route path="/teamlead/room/:roomId" element={<VideoPlayer />} />
            </Route>
          </Route>
        </Routes>
      </ThemeProvider>
    </div>
  );
}

export default App;
