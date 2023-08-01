import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LockIcon from '@mui/icons-material/Lock';
import '../../styles/style.css'
import {

  Paper,

  TextField,
  Button,
  Chip,
  Grid,
  MenuItem,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { adminApi } from "../../redux/api/employeeApi";
import { setAdminExists } from "../../redux/slices/authSlice";


const AdminSetup = () => {
    const navigate = useNavigate()
    const adminExists = useSelector((state) => state.employee.adminExists);
    
    const [inputs, setInputs] = useState({
        first_name:"",
        last_name:"",
        designation:"",
        email: "",
        password: "",
      });
      const [department, setDepartment] = useState([]);
      const handleChange = (e) => {
        setInputs((prev) => ({
          ...prev,
          [e.target.name]: e.target.value,
        }));
      };
      useEffect(() => {
        const fetchDepartment = async () => {
          try {
            const response = await adminApi.getDepartment();
            const data = response.department;
            console.log(data)
            setDepartment(data);
          } catch (error) {}
        };
        const checkAdminExistence = async () => {
          try {
            const response = await adminApi.findAdmin();
            const { exists } = response;
            setAdminExists(exists);
          } catch (error) {
            console.error('Error checking admin existence:', error);
          }
        };
        
        
          fetchDepartment();
          checkAdminExistence();
      }, []);
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await adminApi.adminSetUp(inputs)
            if(res)
            navigate('/')
            
        } catch (error) {
            console.log(error)
        }
      };
      if (adminExists) {
        // Redirect to login page if admin exists
        return <Navigate to="/" replace />;
      }
  return (
    <div className='root'>
    <Paper elevation={3} className='paper'>
      <div className='container'>
      <Chip icon={<LockIcon/>} label='Admin Setup' color="info" variant="filled"/>
      </div>  
      <div>
      <form onSubmit={handleSubmit}>
      <Grid container spacing={2} mt={0.5}>
        <Grid item xs={12} md={6}>
        <TextField label="First Name"
              variant="outlined"
              fullWidth
              name="first_name"
              onChange={handleChange}
              value={inputs.first_name}
              className='textField' />
            </Grid>
            <Grid item xs={12} md={6}>
            <TextField label="Last Name"
              variant="outlined"
              fullWidth
              name="last_name"
              onChange={handleChange}
              value={inputs.last_name}
              className='textField' />
            </Grid>
            </Grid>
     
     
      <p>
      <TextField
  label="Designation"
  name="designation"
  select
  value={inputs.designation}
  fullWidth
  onChange={handleChange}
  required
>
  {department
    .filter((dept) => dept.designation === "HR")
    .map((dept) => (
      <MenuItem key={dept._id} value={dept._id}>
        {dept.designation}
      </MenuItem>
    ))}
</TextField>

      </p>
      <p>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
        <TextField label="Email"
              variant="outlined"
              fullWidth
              name="email"
              onChange={handleChange}
              value={inputs.email}
              className='textField' />
            </Grid>
            <Grid item xs={12} md={6}>
            <TextField label="Password"
              variant="outlined"
              type="password"
              fullWidth
              name="password"
              onChange={handleChange}
              value={inputs.password}
              className='textField' />
            </Grid>
            </Grid>
      </p>
     
            <Button
            color="info"
              variant="contained"
              fullWidth
              type="submit"
            >
              SetUp
            </Button>
      </form>
      </div>
    </Paper>
    </div>
  )
}

export default AdminSetup