import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { dutyApi } from '../../redux/api/employeeApi';
import { Box, Grid } from '@mui/material';
import { PersonOutlineOutlined } from '@mui/icons-material';
import Header from '../../components/Header';
import { DataGrid } from '@mui/x-data-grid';

const OndutyApprove = () => {
    const [onduty, setOnduty] = useState([])
    const isLoggedIn = useSelector((state) => state.employee.isLoggedIn);
    useEffect(() => {
        const fetchDutyDetails = async () => {
            try {
              const response = await dutyApi.allDuty();
              const data = response.onduty;
             console.log('duty=',data)
              setOnduty(data);
            } catch (error) {
              console.log("Error fetching  details:", error);
            }
          };
          if (isLoggedIn) {
            fetchDutyDetails()
          }
     
    }, [isLoggedIn])
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
      
  return (
    <Box m="1.5rem 2.5rem">
        <Header title="On-Duty" subtitle="On duty Approval" />
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
  )
}

export default OndutyApprove