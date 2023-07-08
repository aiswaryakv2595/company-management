import {CssBaseline,ThemeProvider} from '@mui/material'
import {createTheme} from '@mui/material/styles'
import { themeSettings } from './theme';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Dashboard from './scenes/admin/dashboard';
import Layout from './scenes/admin/layout';
import LoginForm from './components/Login';
import AllEmployees from './scenes/admin/employees';
import AdminPrivateRoutes from './routes/AdminPrivateRoute';
import AdminPublicRoutes from './routes/AdminPublicRoutes';
import { ToastContainer } from 'react-toastify';
import EmployeeLayout from './scenes/employees/employeelayout/EmployeeLayout';
import EmpDashboard from './scenes/employees/dashboard/EmpDashboard';
import LeadDashboard from './scenes/teamlead/dashboard/LeadDashboard';
import LeadLayout from './scenes/teamlead/layout/LeadLayout';
import EmployeePrivate from './routes/EmployeePrivate';
import TlPrivateRoute from './routes/TlPrivateRoute';
import AllProjects from './scenes/admin/project/AllProjects';
import ViewProject from './scenes/teamlead/project/ViewProject';
import EditProject from './scenes/admin/project/EditProject';
import Department from './scenes/admin/department/Department';
import ProfileSettings from './scenes/profile/ProfileSettings';
import ForgotPassword from './scenes/password/ForgotPassword';
import OtpPage from './scenes/password/OtpPage';
import ResetPassword from './scenes/password/ResetPassword';
import AddTask from './scenes/teamlead/project/AddTask';



function App() {
  const mode = useSelector((state)=>state.global.mode)
  const theme = useMemo(()=>createTheme(themeSettings(mode)),[mode])
  return (
    <div className="app">
      <ToastContainer />
      <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <Routes>
        <Route element={<AdminPrivateRoutes/>}>
          <Route element = {<Layout/>}>
            <Route path='/admin/dashboard' element={<Dashboard/>}/>
            <Route path='/admin/department' element={<Department/>}/>
            <Route path='/admin/employees' element={<AllEmployees/>}/>
            <Route path='/admin/projects' element={<AllProjects/>}/>
            <Route path="/admin/edit-project/:projectId" element={<EditProject/>} />
            
          </Route>
          </Route>
          <Route element={<AdminPublicRoutes/>}>
          <Route path="/" element= {<LoginForm/>}/>
          <Route path="/forgot-password" element= {<ForgotPassword/>}/>
          <Route path="/reset-password/otp" element= {<OtpPage/>}/>
          <Route path='/reset-password' element = {<ResetPassword/>}/>
          </Route>
          <Route element={<EmployeePrivate/>}>
          <Route element = {<EmployeeLayout/>}>
          <Route path='/dashboard' element={<EmpDashboard/>}/>
          <Route path='/profile' element={<ProfileSettings/>}/>
          </Route>
          </Route>
          {/* teamlead routes */}
          <Route element={<TlPrivateRoute/>}>
          <Route element = {<LeadLayout/>}>
          <Route path='/teamlead/profile' element={<ProfileSettings/>}/>
          <Route path='/teamlead/dashboard' element={<LeadDashboard/>}/>
          <Route path='/teamlead/view-project' element={<ViewProject/>}/>
          <Route path='/teamlead/view-tasks' element={<AddTask/>}/>
          </Route>
          </Route>
        </Routes>
      </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
