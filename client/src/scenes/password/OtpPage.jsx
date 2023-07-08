// OtpPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../redux/api/api';
import { Button, Container, Paper, TextField, Typography } from '@material-ui/core';
import { useStyles } from '../../styles/useStyles';

const OtpPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send OTP to backend for verification
      const res = await api.post('/verify-otp', { otp });
      console.log('OTP', otp);
      console.log(res.data);
      // Redirect to password reset page if OTP is verified
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
    <div className={classes.root}>
      <Container className={classes.container}>
        <Paper elevation={3} className={classes.paper}>
          <Typography variant="h5" component="h1" gutterBottom>
            Enter OTP
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              className={classes.textField}
              label="OTP"
              variant="outlined"
              fullWidth
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <Button className={classes.loginButton} variant="contained" fullWidth type="submit">
              Enter OTP
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default OtpPage;
