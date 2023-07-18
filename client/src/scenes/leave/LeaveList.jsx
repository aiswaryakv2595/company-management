import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, MenuItem, TextField, Typography, useMediaQuery, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import { adminApi, leaveApi } from '../../redux/api/employeeApi'
import { useSelector } from 'react-redux'
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DataGrid } from '@mui/x-data-grid'

const LeaveList = () => {
  const theme = useTheme()
  const [open, setOpen] = useState(false);
  const [leave, setLeave] = useState([])
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [employee, setEmployee] = useState([]);
  const [inputs, setInputs] = useState({
    employeeID: "",
    from: "",
    to: "",
    onduty_type:"",
    leave_duration: "",
    reason: "",
  });
  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const isLoggedIn = useSelector((state) => state.employee.isLoggedIn);
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await adminApi.userDetails();
        const data = response.employee;
        console.log("inside profile", data);
        setEmployee(data);
      } catch (error) {
        console.log("Error fetching user details:", error);
      }
    };
    const fetchDutyDetails = async () => {
      try {
        const response = await leaveApi.getLeave();
        const data = response.leave;
       console.log('leave=',data)
        setLeave(data);
      } catch (error) {
        console.log("Error fetching  details:", error);
      }
    };
    if(isLoggedIn){
      fetchUserDetails()
      fetchDutyDetails()
    }
  }, [isLoggedIn])
  
  const leaveIndex = leave.map((row, index) => ({
    ...row,
    slNo: index + 1,
  }));
  const columns = [
    { field: "slNo", headerName: "Sl no", width: 130 },
    { field: "from", headerName: "From", width: 130 },
    { field: "to", headerName: "To", width: 130 },
    {
        field: "leave_status",
        headerName: "Status",
        width: 130, 
      },
    {
      field: "leave_duration",
      headerName: "Duration",
      width: 90,
    },
    { field: "reason", headerName: "Reason", width: 130 },
  ];

  const handleSubmit = async () => {
    try {
      const updatedResponse = await leaveApi.addLeave(inputs);
      const newLeave = updatedResponse.leave;
      toast.success("leave added");
      console.log('leave-----',newLeave)
      setLeave((prev) => [...prev, newLeave]);
      setOpen(false);
    } catch (error) {
      toast.error("Duty already exists");
    }
  };
  return (
    <Box m="1.5rem 2.5rem">
        <Header title="Leave" subtitle="All leaves" />
        <Box display="flex" justifyContent="flex-end" mb="20px">
        <Button
          variant="contained"
          sx={{
            bgcolor: theme.palette.primary[50],
            color: theme.palette.secondary[1000],
          }}
          onClick={()=>setOpen(true)}
        >
          + ADD
        </Button>
      </Box>
      {leave.length > 0 ? (
      <Box mt="20px">
        <DataGrid
          rows={leaveIndex}
          getRowId={(row) => row._id}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
        />
      </Box>
       ) : null}
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{"Add On Duty"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Grid container spacing={2}>
              <Grid xs={6} md={6}>
                <Typography>Employee ID</Typography>
                <TextField
  id="outlined-basic"
  variant="outlined"
  fullWidth
  name="employeeID"
  value={employee ? employee.emp_id : ""}
  onLoad={handleChange}
  disabled
/>
              </Grid>
              <Grid xs={6} md={6}>
                <Typography>Type</Typography>
                <TextField
  id="outlined-basic"
  variant="outlined"
  value={inputs.onduty_type}
  name="onduty_type"
  fullWidth
  select
  onChange={handleChange}
>
  {leave.length === 0 ? (
    <MenuItem value="Earned Leave">Earned Leave</MenuItem>
  ) : (
    leave.map((item) => (
      <MenuItem
        key={item._id}
        value={item.earnedLeave > 0 ? "Earned Leave" : "Loss Of Pay"}
      >
        {item.earnedLeave > 0 ? "Earned Leave" : "Loss Of Pay"}
      </MenuItem>
    ))
  )}
</TextField>

              </Grid>
              <Grid xs={4} md={4}>
                <Typography>Date</Typography>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  value={inputs.from}
                  fullWidth
                  name="from"
                  type="date"
                  
                  onChange={handleChange}
                />
              </Grid>
              <Grid xs={4} md={4}>
                <Typography>Requested Date</Typography>
                <TextField
    id="outlined-basic"
    variant="outlined"
    name="to"
    type="date"
    value={inputs.to}
    min={inputs.from}
    max={inputs.from}
    fullWidth
    onChange={handleChange}
    disabled={inputs.from === ""}
  />
              </Grid>
              <Grid xs={4} md={4}>
                <Typography>Duration</Typography>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  name="leave_duration"
                  value={inputs.leave_duration}
                  fullWidth
                  select
                  onChange={handleChange}
                >
                  <MenuItem value='fullday'>Full Day</MenuItem>
                  <MenuItem value='forenoon'>Half Day(forenoon)</MenuItem>
                  <MenuItem value='afternoon'>Half Day(afternoon)</MenuItem>
                </TextField>
              </Grid>
              <Grid xs={12} md={12}>
                <Typography>Reason</Typography>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  name="reason"
                  value={inputs.reason}
                  fullWidth
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{
              bgcolor: theme.palette.primary[50],
              color: theme.palette.secondary[1000],
            }}
            onClick={handleSubmit}
            autoFocus
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default LeaveList