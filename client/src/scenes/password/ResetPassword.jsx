import React, { useState } from 'react'

import { Button, Chip, Container, Paper, TextField, Typography } from '@mui/material';
import { api } from '../../redux/api/api';
import { useLocation, useNavigate } from 'react-router-dom';
import LockResetIcon from '@mui/icons-material/LockReset';
import '../../styles/style.css'

const ResetPassword = () => {
    
    const location = useLocation();
    const navigate = useNavigate()
    const [inputs, setInputs] = useState({
        password:"",
        confirm_password:""
      })
      const handleChange = (e) => {
        setInputs(prev => ({
          ...prev,
          [e.target.name]: e.target.value
        }));
      };
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        
         
    
          const res = await api.post(`/reset-password`, { password:inputs.password });
          console.log(res.data);
          navigate('/');
          
        } catch (error) {
          console.error(error);
          
        }
      };
  return (
    <>
  
  <div className='root'>
    <Paper elevation={3} className='paper'>
    <div className='container'>
      <Chip icon={<LockResetIcon/>} label='Reset Password' color="info" variant="filled"/>
      </div> 
      <div>
      <form onSubmit={handleSubmit}>
        <p>
        <TextField
            className='textField'
            label="Password"
            variant="outlined"
            fullWidth
            name="password"
            onChange={handleChange}
            value={inputs.password}
          />
        </p>
        <p>
        <TextField
            className='textField'
            label="Confirm Password"
            variant="outlined"
            type="password"
            name="confirm_password"
            fullWidth
            onChange={handleChange}
            value={inputs.confirm_password}
          />
        </p>
        <Button
            className='loginButton'
            variant="contained"
            fullWidth
            type="submit"
          >
            Reset
          </Button>
      </form>
      </div>
      </Paper>
      </div>
  </>
  )
}

export default ResetPassword