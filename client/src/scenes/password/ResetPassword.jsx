import React, { useState } from 'react'
import { useStyles } from '../../styles/useStyles';
import { Button, Container, Paper, TextField, Typography } from '@material-ui/core';
import { api } from '../../redux/api/api';
import { useLocation, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const classes = useStyles();
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
    <div className={classes.root}>
    <Container className={classes.container}>
      <Paper elevation={3} className={classes.paper}>
        <Typography variant="h5" component="h1" gutterBottom>
          Reset Password
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            className={classes.textField}
            label="Password"
            variant="outlined"
            fullWidth
            name="password"
            onChange={handleChange}
            value={inputs.password}
          />
          <TextField
            className={classes.textField}
            label="Confirm Password"
            variant="outlined"
            type="password"
            name="confirm_password"
            fullWidth
            onChange={handleChange}
            value={inputs.confirm_password}
          />
        
          <Button
            className={classes.loginButton}
            variant="contained"
            fullWidth
            type="submit"
          >
            Reset
          </Button>
        </form>
      </Paper>
    </Container>
    
  </div>
  )
}

export default ResetPassword