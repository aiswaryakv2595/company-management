import { Box, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import { useSelector } from 'react-redux';
import { adminApi } from '../../redux/api/employeeApi';
import moment from 'moment';
import { DataGrid } from '@mui/x-data-grid';

const ViewHoliday = () => {
    const theme = useTheme();
    const [holiday, setHoliday] = useState([]);
    const isLoggedIn = useSelector((state) => state.employee.isLoggedIn);
    useEffect(() => {
        const fetchHolidays = async () => {
          try {
            const response = await adminApi.allHoliday();
            console.log("Response:", response);
            const data = response.holiday;
            
            setHoliday(data);
          } catch (error) {
            console.log(error);
          }
        };
    
        if (isLoggedIn) {
            fetchHolidays();
        }
      }, [isLoggedIn]);
      const holidayWithIndex = holiday.map((row, index) => ({
        ...row,
        slNo: index + 1,
      }));
    
      const columns = [
        { field: "slNo", headerName: "SL No", width: 200 },
        { field: "date", headerName: "Date", width: 200,
        valueGetter: (params) => {
          const formattedDate = moment(params.value).format("DD-MM-YYYY");
          return formattedDate;
        },
      },
        { field: "title", headerName: "Title", width: 250 },
    
      ];
    
  return (
    <Box m="1.5rem 2.5rem">
        <Header title="Holiday" subtitle="List of Holidays" />
        <Box mt="20px">
        <DataGrid
          rows={holidayWithIndex}
          columns={columns}
          getRowId={(row) => row._id}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          autoHeight
          checkboxSelection={false}
          disableSelectionOnClick
        />
      </Box>
    </Box>
  )
}

export default ViewHoliday