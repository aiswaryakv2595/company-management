import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
} from '@material-ui/core';
import { api } from '../redux/api/api';
import { useDispatch } from 'react-redux';
import { login } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paper: {
    padding: theme.spacing(4),
    maxWidth: 400,
    width: '100%',
  },
  textField: {
    marginBottom: theme.spacing(2),
  },
  loginButton: {
    backgroundImage: 'linear-gradient(to right, #000428, #004E92)',
    color: theme.palette.common.white,
    '&:hover': {
      background: '#004E92',
    },
  },
  forgotPassword: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing(2),
    textDecoration: 'none',
    color: theme.palette.text.secondary,
  },
}));

const LoginForm = () => {
  const classes = useStyles();
  const [inputs, setInputs] = useState({
    email:"",
    password:""
  })

 const dispatch = useDispatch()
 const navigate = useNavigate();

 const sendRequest = async () => {
  try {
    const res = await api.post('/', {
      email: inputs.email,
      password: inputs.password,
    });
    const data = res.data;
    dispatch(login({ email: inputs.email, password: inputs.password,role: data.role }));
    const token = res.data.token;

    // Store the token in localStorage
    localStorage.setItem('token', token);
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};


 const handleSubmit = async (e) => {
  e.preventDefault();
  sendRequest()
      .then((data) => {
        console.log('data---',data)
        if (data.role === 'admin') {
          navigate('/admin/dashboard');
        } else if(data.role === 'employee'){
          // Handle other roles or redirect to a default dashboard
          navigate('/dashboard');
        }
        else{
          navigate('/teamlead/dashboard')
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || err.message);
      });
};

  const handleChange = (e) => {
    setInputs(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  return (
    <div className={classes.root}>
      <Container className={classes.container}>
        <Paper elevation={3} className={classes.paper}>
          <Typography variant="h5" component="h1" gutterBottom>
            Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              className={classes.textField}
              label="Email"
              variant="outlined"
              fullWidth
              name="email"
              onChange={handleChange}
              value={inputs.email}
            />
            <TextField
              className={classes.textField}
              label="Password"
              variant="outlined"
              type="password"
              name="password"
              fullWidth
              onChange={handleChange}
              value={inputs.password}
            />
            <a href="#" className={classes.forgotPassword}>
              Forgot Password
            </a>
            <Button
              className={classes.loginButton}
              variant="contained"
              fullWidth
              type="submit"
            >
              Login
            </Button>
          </form>
        </Paper>
      </Container>
      
    </div>
  );
};

export default LoginForm;
