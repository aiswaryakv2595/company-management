import { Button, Container, Paper, TextField, Typography } from '@material-ui/core';
import React, { useState } from 'react'
import { api } from '../../redux/api/api';
import { useNavigate } from 'react-router-dom';
import { useStyles } from '../../styles/useStyles';

const ForgotPassword = () => {
    const classes = useStyles();
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
    <div className={classes.root}>
        <Container className={classes.container}>
        <Paper elevation={3} className={classes.paper}>
        <Typography variant="h5" component="h1" gutterBottom>
            Forgot Password
          </Typography>
          <form onSubmit={handleSubmit}>
          <TextField
              className={classes.textField}
              label="Email"
              variant="outlined"
              fullWidth
              name="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />
            <Button
              className={classes.loginButton}
              variant="contained"
              fullWidth
              type="submit"
            >
              Submit
            </Button>
          </form>

        </Paper>

        </Container>
    </div>
  )
}

export default ForgotPassword