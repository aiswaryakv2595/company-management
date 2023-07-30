import { Box, Button, Grid, MenuItem, Modal, TextField, Typography, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Header from '../../../components/Header'
import { useSelector } from 'react-redux';
import { adminApi, salaryApi } from '../../../redux/api/employeeApi';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from "react-router-dom";
const Payroll = () => {
    const isLoggedIn = useSelector((state) => state.employee.isLoggedIn);
    const [employee, setEmployee] = useState([]);
    const [employeeName, setEmployeeName] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({
      employeeID:"",
      base_salary:"",
      rent_allowance:"",
      pf:"",
      lop_deduction:"",
      from:"",
      to:""
     
    });
    const handleChange = (e) => {
      const { name, value } = e.target;
      setInputs((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }))
    };
      const fetchSalaryDetails = async () => {
        try {
          const response = await salaryApi.getEmployeeSalary()
          const data = response.salary;
          console.log("salary", data);
          setEmployee(data);
        } catch (error) {
          console.log("Error fetching user details:", error);
        }
      };
      useEffect(() => {
        const fetchEmployeeDetails = async () => {
          try {
            const response = await adminApi.allEmployees()
            const data = response.employees;
            console.log("employee", data);
            setEmployeeName(data);
          } catch (error) {
            console.log("Error fetching user details:", error);
          }
        };   
    
        if (isLoggedIn) {
          fetchSalaryDetails();
          fetchEmployeeDetails();
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
      const handleGenerateSlip = (rowData) => {
        // Assuming you have a route named "/slip" for the slip generation component
        navigate("/admin/slip", { state: { employeeData: rowData } });
      };
      const handleSubmit = async() => {
        try {
          const response = await salaryApi.addSalary(inputs)
          fetchSalaryDetails()
          setOpenModal(false)
        } catch (error) {
          
        }
      }
  const theme = useTheme();
  return (
    <Box m="1.5rem 2.5rem">
        <Header title="Employees Salary" subtitle="Salary Details" />
        <Grid container spacing={2} justifyContent="flex-end" marginBottom={1}>
      <Grid item xs={6} md={3}>
        <Button
          variant="contained"
          sx={{
            bgcolor: theme.palette.primary[50],
            color: theme.palette.secondary[1000],
            width: "100%",
          }}
          onClick={() => setOpenModal(true)}
        >
          + Add Salary
        </Button>
        </Grid>
        </Grid>
     
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
    <Modal open={openModal} onClose={() => setOpenModal(false)}>
    <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "#ffffff",
            padding: "20px",
            outline: "none",
            width:"50%"
          }}
        >
            <Typography variant="h6" gutterBottom>
            Add Salary
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <TextField
                  label="First Name"
                  name="employeeID"
                  value={inputs.employeeID}
                  onChange={handleChange}
                 select
                >
                    {employeeName
                .map((emp) => (
                  <MenuItem key={emp._id} value={emp._id}>
                    {emp.first_name}
                  </MenuItem>
                ))}
                </TextField>
          <Grid container spacing={2}>
          <Grid item xs={6}>
          <TextField
                  label="From"
                  name="from"
                  type='date'
                  value={inputs.from}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
          </Grid>
          <Grid item xs={6}>
          <TextField
                  label="To"
                  name="to"
                  type='date'
                  value={inputs.to}
                 fullWidth
                 InputLabelProps={{
                  shrink: true,
                }}
                onChange={handleChange}
                />
          </Grid>
          </Grid>
          <Grid container spacing={2}>
          <Grid item xs={6}>
          <TextField
                  label="Base Salary"
                  name="base_salary"
                  value={inputs.base_salary}
                  onChange={handleChange}
                  fullWidth
                />
          </Grid>
          <Grid item xs={6}>
          <TextField
                  label="PF"
                  name="pf"
                  value={inputs.pf}
                  onChange={handleChange}
                 fullWidth
                />
          </Grid>
          </Grid>
          {/* level 2 */}
          <Grid container spacing={2}>
          <Grid item xs={6}>
          <TextField
                  label="House rent allowance"
                  name="rent_allowance"
                  value={inputs.rent_allowance}
                  onChange={handleChange}
                  fullWidth
                />
          </Grid>
          <Grid item xs={6}>
          <TextField
                  label="LOP Deduction"
                  name="lop_deduction"
                  value={inputs.lop_deduction}
                  onChange={handleChange}
                 fullWidth
                />
          </Grid>
          </Grid>
          
        
          <Button variant="contained"
          onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
        </div>
    </Modal>
    </Box>
  )
}

export default Payroll