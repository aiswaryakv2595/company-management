// OtpPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../redux/api/api';

import '../../styles/style.css'
import PasswordIcon from '@mui/icons-material/Password';
import {

  Paper,

  TextField,
  Button,
  Chip,
} from "@mui/material";

const OtpPage = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      const res = await api.post('/verify-otp', { otp });
      console.log('OTP', otp);
      console.log(res.data);
     
      if (res.data.verified) {
        navigate(`/reset-password`);
      } else {
        console.log('OTP not verified');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>

    <div className='root'>
    <Paper elevation={3} className='paper'>
    <div className='container'>
      <Chip icon={<PasswordIcon/>} label='OTP' color="info" variant="filled"/>
      </div> 
      <form onSubmit={handleSubmit}>
        <p>
        <TextField
              className='textField'
              label="OTP"
              variant="outlined"
              fullWidth
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
        </p>
        <Button color='info' variant="contained" fullWidth type="submit">
              Enter OTP
            </Button>
      </form>
      </Paper>
      </div>
    </>
  );
};

export default OtpPage;
