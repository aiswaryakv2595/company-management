import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { salaryApi } from '../../../redux/api/employeeApi';
import { Box, Button, Typography, useTheme } from '@mui/material';
import Header from '../../../components/Header';
import { DataGrid } from '@mui/x-data-grid';

const EmployeePayload = () => {
    const isLoggedIn = useSelector((state) => state.employee.isLoggedIn);
    const role = useSelector((state) => state.employee.role);
    
    const [employee, setEmployee] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchSalaryDetails = async () => {
            try {
              const response = await salaryApi.getSalary()
              const data = response.salary;
              console.log("salary", data);
              setEmployee(data);
            } catch (error) {
              console.log("Error fetching user details:", error);
            }
          };  
    
        if (isLoggedIn) {
          fetchSalaryDetails();
          
        }
      }, [isLoggedIn]);
      const columns = [
        { field: "emp_id", headerName: "ID", width: 80 },
        {
          field: "full_name",
          headerName: "Full Name",
          width: 100,
          valueGetter: (params) => {
            return `${params.row.first_name} ${params.row.last_name}`;
          },
        },
        { field: "email", headerName: "Email", width: 200 },
        {
          field: "designation",
          headerName: "Designation",
          width: 170,
          valueGetter: (params) => params.row.department[0].designation,
        },
        {
          field: "joining_date",
          headerName: "Joining Date",
          width: 130,
          valueGetter: (params) => {
            const date = new Date(params.row.joining_date);
            if (isNaN(date)) {
              return ""; // Return an empty string if the date is invalid
            }
      
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const year = date.getFullYear();
      
            return `${day}-${month}-${year}`;
          },
        },
        {
          field: "total_salary",
          headerName: "Total Salary",
          width: 100,
          valueGetter: (params) => {
            if (params.row.salary && params.row.salary.length > 0) {
              return params.row.salary[0].total_salary;
            }
            return 0;
          },
        },
        {
          field: "actions",
          headerName: "Actions",
          width: 130,
          renderCell: (params) => (
            <Button
              variant="contained"
              onClick={() => handleGenerateSlip(params.row)}
            >
              Generate Slip
            </Button>
          ),
        },
      ];
      const theme = useTheme();
      const handleGenerateSlip = (rowData) => {
       if(role!=="teamlead")
        navigate("/slip", { state: { employeeData: rowData } });
        else
        navigate("/teamlead/slip", { state: { employeeData: rowData } });
      };
  return (
    <Box m="1.5rem 2.5rem">
        <Header title="Employees Salary" subtitle="Salary Details" />
        {employee&&employee.length > 0 ? (
        <Box mt="20px">
          <DataGrid
            rows={employee}
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
      ) : <Typography variant="h6" align="center" color="textSecondary">
      No matching records found
    </Typography>}
    </Box>
  )
}

export default EmployeePayload