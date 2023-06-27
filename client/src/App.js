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
            <Route path='/admin/employees' element={<AllEmployees/>}/>
            
          </Route>
          </Route>
          <Route element={<AdminPublicRoutes/>}>
          <Route path="/" element= {<LoginForm/>}>
          </Route>
          </Route>
          <Route element={<EmployeePrivate/>}>
          <Route element = {<EmployeeLayout/>}>
          <Route path='/dashboard' element={<EmpDashboard/>}/>
          </Route>
          </Route>
          {/* teamlead routes */}
          <Route element={<TlPrivateRoute/>}>
          <Route element = {<LeadLayout/>}>
          <Route path='/teamlead/dashboard' element={<LeadDashboard/>}/>
          </Route>
          </Route>
        </Routes>
      </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
