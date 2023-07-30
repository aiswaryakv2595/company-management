import { Button, Chip, Container, Paper, TextField, Typography } from '@mui/material';
import React, { useState } from 'react'
import { api } from '../../redux/api/api';
import { useNavigate } from 'react-router-dom';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import '../../styles/style.css'

const ForgotPassword = () => {
    
    const [email, setEmail] = useState("")
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const res = await api.post('/forgot-password', { email });
          console.log(res.data);
          // Redirect to OTP input page
          navigate(`/reset-password/otp`);
        } catch (error) {
          console.error(error);
        }
      };
      
  return (
   
    <div className='root'>
    <Paper elevation={3} className='paper'>
    <div className='container'>
      <Chip icon={<LockOpenIcon/>} label='Forgot Password' color="info" variant="filled"/>
      </div> 
      <form onSubmit={handleSubmit}>
      <p>
      <TextField
              className='textField'
              label="Email"
              variant="outlined"
              fullWidth
              name="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />
      </p>
      <Button
              color='info'
              variant="contained"
              fullWidth
              type="submit"
            >
              Submit
            </Button>
      </form>
     
    </Paper>
    </div>
   
  )
}

export default ForgotPassword