import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { dutyApi } from "../../redux/api/employeeApi";
import { Box, Button, Grid, TextField, useTheme } from "@mui/material";
import { PersonOutlineOutlined } from "@mui/icons-material";
import Header from "../../components/Header";
import { DataGrid } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OndutyApprove = () => {
  const [onduty, setOnduty] = useState([]);
  const theme = useTheme();
  const isLoggedIn = useSelector((state) => state.employee.isLoggedIn);
  const currentDate = new Date().toISOString().split("T")[0]; 
  const [fromdate, setFromdate] = useState(currentDate)
  const [todate, setTodate] = useState(currentDate)
  const fetchDutyDetails = async () => {
    try {
      
      const response = await dutyApi.allDuty(fromdate, todate );
      const data = response.onduty;
      console.log(data)
      setOnduty(data);
    } catch (error) {
      console.log("Error fetching details:", error);
    }
  };
  useEffect(() => {
   
    
    if (isLoggedIn) {
      fetchDutyDetails();
    }
  }, [isLoggedIn]);

  const dutyWithIndex = onduty.map((row, index) => ({
    ...row,
    slNo: index + 1,
  }));

  const columns = [
    { field: "slNo", headerName: "Sl no", width: 70 },
    {
      field: "employeeID",
      headerName: "Employee",
      width: 130,
      valueGetter: (params) => `${params.row.employeeID.first_name} ${params.row.employeeID.last_name}`,
    },
    { field: "onduty_date", headerName: "Onduty day", width: 130 },
    { field: "requested_date", headerName: "Request date", width: 130 },
    {
      field: "status",
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
    { field: "working", headerName: "Working", width: 90 },
    { field: "reason", headerName: "Reason", width: 130 },
    {
      field: "actions",
      headerName: "Actions",
      width: 130,
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          {params.row.status === "pending" || params.row.status === "rejected" ? (
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
          ) : (
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
          )}
        </Box>
      ),
    },
  ];

  const handleApprove = async (dutyId) => {
    try {
      const response = await dutyApi.approveDuty({ id: dutyId });
      const updatedResponse = response.onduty;
      if (updatedResponse.status === "Absent") {
        toast.success("Successfully updated");
      } else {
        toast.success("Rejected");
      }
      setOnduty((prev) => {
        const updatedOnduty = prev.map((duty) => {
          if (duty._id === updatedResponse._id) {
            return updatedResponse;
          }
          return duty;
        });
        return updatedOnduty;
      });
    } catch (error) {
      console.log("Error updating employee status:", error);
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
   
      <Header title="On-Duty Approval" subtitle={onduty.onduty_date} />
    
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
      onClick={fetchDutyDetails}
    >
      Search
    </Button>
  </Grid>
</Grid>

      
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
    </Box>
  );
};

export default OndutyApprove;
