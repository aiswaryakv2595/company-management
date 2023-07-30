import { Box, Divider, Grid, Typography, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import FlexBetween from '../../components/FlexBetween'
import './attendance.css'
import { useSelector } from 'react-redux'
import { dutyApi } from '../../redux/api/employeeApi'
import { PersonOutlineOutlined } from '@mui/icons-material'
import { DataGrid } from '@mui/x-data-grid'

const AttendanceReport = () => {
  const [attendanceData, setAttendanceData] = useState({
    ondutyTypeCounts: [],
    lopBalance: 0,
    statusCounts: [],
    balanceLeave:0
  });
  const isLoggedIn = useSelector((state) => state.employee.isLoggedIn);
  const theme = useTheme();
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await dutyApi.attendance();
        const data = response;
        console.log(data)
        setAttendanceData(data);
      } catch (error) {}
    };
    if (isLoggedIn) {
      fetchReport();
      
    }
   
  }, [isLoggedIn])
  const dutyWithIndex = attendanceData.attendance?.map((row, index) => ({
    ...row,
    slNo: index + 1,
  }));
  const columns = [
    { field: "slNo", headerName: "Sl no", width: 200 },
    { field: "from", headerName: "From", width: 200 },
    { field: "to", headerName: "To", width: 200 },
    {
        field: "status",
        headerName: "Status",
        width: 200,
        renderCell: (params) => (
          <Grid container spacing={1} alignItems="center">
            <Grid item>
              {params.value === "Absent" ? (
                <PersonOutlineOutlined fontSize="large" sx={{ color: "#EF6262" }} />
              ) : params.value === "Present" ? (
                <PersonOutlineOutlined fontSize="large" sx={{ color: "#468B97" }} />
              )  : (
                <PersonOutlineOutlined fontSize="large" sx={{ color: "#F3AA60" }} />
              )}
            </Grid>
            <Grid item>{params.value}</Grid>
          </Grid>
        ),
        
      },
    
    { field: "reason", headerName: "Reason", width: 130 },
  ];
  
  return (
    <Box m="1.5rem 2.5rem">
        <Header title="Attendance" subtitle="Attendance Report"/>
        <FlexBetween sx={{marginTop:2}}>
        
            <Box sx={{borderTop:"2px solid #00126d"}}> Present 
            <Box>{attendanceData.statusCounts.find((item) => item._id === 'Present')?.count || 0}</Box>
            </Box>
            <Box sx={{borderTop:"2px solid #ecb2a1"}}>Absent
            <Box>{attendanceData.statusCounts.find((item) => item._id === 'Absent')?.count || 0}</Box>
            </Box>
            <Box sx={{borderTop:"2px solid #0cc2dd"}}>Leaves
            <Box>{attendanceData.statusCounts.find((item) => item._id === 'Leave')?.count || 0}</Box>
            </Box>
            <Box sx={{borderTop:"2px solid #0cc2dd"}}>Leave Balance
            <Box>{attendanceData.balanceLeave || 0}</Box>
            </Box>
            
            <Box sx={{borderTop:"2px solid #a1dbec"}}>Onduty
            <Box>{attendanceData.ondutyTypeCounts.find((item) => item._id === 'Onduty')?.count || 0}</Box>
            </Box>
            <Box sx={{borderTop:"2px solid #eca1db"}}>Loss of Pay
            <Box>
            {attendanceData.lopBalance?.count || 0}
            </Box>
            </Box>
           
        </FlexBetween>
        {attendanceData.attendance?.length > 0 ? (
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
       ) : <Typography>No data found</Typography>}
    </Box>
  )
}

export default AttendanceReport