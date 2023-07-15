import {
  Box,
  useTheme,
  Button,
  Modal,
  useMediaQuery,
  DialogActions,
  DialogContentText,
  DialogContent,
  DialogTitle,
  Dialog,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";
import { PersonOutlineOutlined } from "@mui/icons-material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { DataGrid } from "@mui/x-data-grid";
import Grid from "@mui/material/Unstable_Grid2";
import { useSelector } from "react-redux";
import { adminApi, dutyApi } from "../../redux/api/employeeApi";

const OndutyList = () => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(false);
  const [employee, setEmployee] = useState([]);
  const [onduty, setOnduty] = useState([])
  const [inputs, setInputs] = useState({
    employeeID: "",
    onduty_date: "",
    requested_date: "",
    working: "",
    reason: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "onduty_date") {
      const currentDate = new Date().toISOString().split("T")[0];
  
      if (value != currentDate) {
        return; 
      }
  
      setInputs((prev) => ({
        ...prev,
        onduty_date: value,
        requested_date: value,
      }));
    } else {
      setInputs((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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
          const response = await dutyApi.getDuty();
          const data = response.onduty;
         console.log('duty=',data)
          setOnduty(data);
        } catch (error) {
          console.log("Error fetching  details:", error);
        }
      };
    
    if (isLoggedIn) {
      fetchUserDetails();
      fetchDutyDetails()
    }
  }, [isLoggedIn]);
  const dutyWithIndex = onduty.map((row, index) => ({
    ...row,
    slNo: index + 1,
  }));
  const columns = [
    { field: "slNo", headerName: "Sl no", width: 130 },
    { field: "onduty_date", headerName: "Onduty day", width: 130 },
    { field: "requested_date", headerName: "Request date", width: 130 },
    {
        field: "status",
        headerName: "Status",
        width: 130,
        renderCell: (params) => (
            <Grid container spacing={1} alignItems="center">
              <Grid item>
                 <PersonOutlineOutlined/>
              </Grid>
              <Grid item>{params.value}</Grid>
            </Grid>
          ),
      },
    {
      field: "working",
      headerName: "Working",
      width: 90,
    },
    { field: "reason", headerName: "Reason", width: 130 },
  ];
  
  const handleSubmit = async () => {
    try {
      const updatedResponse = await dutyApi.addDuty(inputs);
      const newDuty = updatedResponse.onduty;
      toast.success("Duty added");
      setOnduty((prevDuty) => [...prevDuty, newDuty]);
      setOpen(false);
    } catch (error) {
      toast.error("Duty already exists");
    }
  };
  
  return (
    <Box m="1.5rem 2.5rem">
      <Header title="On-Duty" subtitle="On duty listing" />
      <Box display="flex" justifyContent="flex-end" mb="20px">
        <Button
          variant="contained"
          sx={{
            bgcolor: theme.palette.primary[50],
            color: theme.palette.secondary[1000],
          }}
          onClick={() => setOpen(true)}
        >
          + ADD
        </Button>
      </Box>
      {onduty.length > 0 ? (
      <Box mt="20px">
        <DataGrid
          rows={dutyWithIndex}
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
                  value="On duty"
                  fullWidth
                  onChange={handleChange}
                />
              </Grid>
              <Grid xs={4} md={4}>
                <Typography>Date</Typography>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  value={inputs.onduty_date}
                  fullWidth
                  name="onduty_date"
                  type="date"
                  
                  onChange={handleChange}
                />
              </Grid>
              <Grid xs={4} md={4}>
                <Typography>Requested Date</Typography>
                <TextField
    id="outlined-basic"
    variant="outlined"
    name="requested_date"
    type="date"
    value={inputs.requested_date}
    min={inputs.onduty_date}
    max={inputs.onduty_date}
    fullWidth
    onChange={handleChange}
    disabled={inputs.onduty_date === ""}
  />
              </Grid>
              <Grid xs={4} md={4}>
                <Typography>Working</Typography>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  name="working"
                  value={inputs.working}
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
  );
};

export default OndutyList;
