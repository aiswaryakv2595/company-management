import { Box, Button, Grid, TextField, useTheme } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import Header from '../../components/Header'
import { useSelector } from 'react-redux';
import { leaveApi } from '../../redux/api/employeeApi';
import { PersonOutlineOutlined } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const LeaveApproval = () => {
   const [leave, setLeave] = useState([]) 
  const theme = useTheme();
  const isLoggedIn = useSelector((state) => state.employee.isLoggedIn);
   
    const [fromdate, setFromdate] = useState("")
  const [todate, setTodate] = useState("")

  const fetchLeaveDetails = useCallback(async () => {
    try {
      const response = await leaveApi.employeeLeaveList(fromdate, todate);
      const data = response.leave;
      console.log(data);
      setLeave(data);
    } catch (error) {
      console.log("Error fetching details:", error);
    }
  }, [fromdate, todate]);
  useEffect(() => {
    if (isLoggedIn) {
      fetchLeaveDetails();
    }
  }, [isLoggedIn, fetchLeaveDetails]);
  const leaveWithIndex = leave.map((row, index) => ({
    ...row,
    slNo: index + 1,
  }));
  const handleApprove = async (leaveId) => {
    try {
      const response = await leaveApi.approveLeave({ id: leaveId });
      const updatedResponse = response.leave;
      if (updatedResponse.leave_status === "Accepted") {
        toast.success("Successfully updated");
      } else {
        toast.success("Rejected");
      }
      setLeave((prev) => {
        const updatedLeave = prev.map((leave) => {
          if (leave._id === updatedResponse._id) {
            return updatedResponse;
          }
          return leave;
        });
        return updatedLeave;
      });
    } catch (error) {
      console.log("Error updating employee status:", error);
    }
  };
  const columns = [
    { field: "slNo", headerName: "Sl no", width: 70 },
    {
      field: "employeeID",
      headerName: "Employee",
      width: 130,
      valueGetter: (params) => `${params.row.employeeID.first_name} ${params.row.employeeID.last_name}`,
    },
    { field: "from", headerName: "From", width: 130 },
    { field: "to", headerName: "To", width: 130 },
    {
      field: "leave_status",
      headerName: "Status",
      width: 130,
      renderCell: (params) => (
        <Grid container spacing={1} alignItems="center">
          <Grid item>
            <PersonOutlineOutlined />
          </Grid>
          <Grid item>{params.value}</Grid>
        </Grid>
      ),
    },
    { field: "leave_duration", headerName: "Leave Duration", width: 90 },
    { field: "reason", headerName: "Reason", width: 130 },
    {
      field: "actions",
      headerName: "Actions",
      width: 130,
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          {params.row.leave_status === "Pending" || params.row.leave_status === "Rejected" ? (
            <Button
              variant="contained"
              sx={{
                bgcolor: theme.palette.primary[50],
                color: theme.palette.secondary[1000],
              }}
              onClick={() => handleApprove(params.row._id)}
            >
              Approve
            </Button>
          ) : 
            <Button
              variant="contained"
              sx={{
                bgcolor: theme.palette.primary[50],
                color: theme.palette.secondary[1000],
              }}
              onClick={() => handleApprove(params.row._id)}
            >
              Reject
            </Button>
          }
        </Box>
      ),
      
      
    },
  ];
  return (
    <Box m="1.5rem 2.5rem">
        <Header title="Leave Approval" />
        <Grid container spacing={2} sx={{ mt: 2 }}>
  <Grid item xs={12} sm={6} md={4}>
    <TextField
      id="outlined-basic"
      label="From"
      variant="outlined"
      type="date"
      value={fromdate}
      onChange={(e)=>setFromdate(e.target.value)}
      fullWidth
      InputLabelProps={{
        style: { color: 'black' },
        shrink:true
      }}
    />
  </Grid>
  <Grid item xs={12} sm={6} md={4}>
    <TextField
      id="outlined-basic"
      label="To"
      variant="outlined"
      type="date"
      value={todate}
      onChange={(e)=>setTodate(e.target.value)}
      fullWidth
      InputLabelProps={{
        style: { color: 'black' },
        shrink:true
      }}
    />
  </Grid>
  <Grid item xs={12} sm={6} md={4}>
    <Button
      variant="contained"
      color="success"
      sx={{
        padding: "15px",
        minWidth: 200,
        backgroundColor: "#f27457",
      }}
      fullWidth
    //   onClick={fetchDutyDetails}
    >
      Search
    </Button>
  </Grid>
</Grid>
{leave.length > 0 ? (
        <Box mt="20px">
          <DataGrid
            rows={leaveWithIndex}
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
    </Box>
  )
}

export default LeaveApproval