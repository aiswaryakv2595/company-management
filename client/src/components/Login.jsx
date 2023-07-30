import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LockIcon from '@mui/icons-material/Lock';
import '../styles/style.css'
import {

  Paper,

  TextField,
  Button,
  Chip,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { login } from "../redux/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";

import authApi from "../redux/api/authApi";

const LoginForm = () => {

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const sendRequest = async () => {
    try {
      const res = await authApi.login({
        email: inputs.email,
        password: inputs.password,
      });

      dispatch(
        login({
          email: inputs.email,
          password: inputs.password,
          role: res.role,
        })
      );

      localStorage.setItem("token", res.token);
      return res;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    sendRequest()
      .then((data) => {
        console.log("data---", data);
        if (data.role === "admin") {
          navigate("/admin/dashboard");
        } else if (data.role === "employee") {
          // Handle other roles or redirect to a default dashboard
          navigate("/dashboard");
        } else {
          navigate("/teamlead/dashboard");
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || err.message);
      });
  };

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  return (
    <div className='root'>
    <Paper elevation={3} className='paper'>
      <div className='container'>
      <Chip icon={<LockIcon/>} label='Login' color="info" variant="filled"/>
      </div>  
      <div>
      <form onSubmit={handleSubmit}>
        <p>
      <TextField label="Email"
              variant="outlined"
              fullWidth
              name="email"
              onChange={handleChange}
              value={inputs.email}
              className='textField' />
      </p>
      <p>
      <TextField  label="Password"
              variant="outlined"
              type="password"
              name="password"
              fullWidth
              onChange={handleChange}
              value={inputs.password}
              className='textField' />
      </p>
      <p>
      <Link to="/forgot-password" className='forgotPassword'>
              Forgot Password
            </Link>
            </p>
            <Button
            color="info"
              variant="contained"
              fullWidth
              type="submit"
            >
              Login
            </Button>
      </form>
      </div>
    </Paper>
    </div>
  );
};

export default LoginForm;