import React, { useEffect, useState } from 'react';
import { api } from '../../../redux/api/api';
import { useSelector } from 'react-redux';
import { Box, Button, Divider, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, useTheme } from '@mui/material';
import Header from '../../../components/Header';
import EditIcon from '@mui/icons-material/Edit';



const Department = () => {
  const [department, setDepartment] = useState([]);
  const theme = useTheme();
  const [openModal, setOpenModal] = useState(false);
  const [inputs, setInputs] = useState({
    department: "",
    designation: "",
   
  });
  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const isLoggedIn = useSelector((state) => state.employee.isLoggedIn);
 
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.log('Token is null or undefined');
      return;
    }

    const fetchDepartment = async () => {
      try {
        const response = await api.get('/admin/department', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data.department;
        console.log('department------', data);
        setDepartment(data);
      } catch (error) {
        // Handle error here
      }
    };

    if (isLoggedIn) {
      fetchDepartment();
    }
  }, [isLoggedIn]);

  const handleAddDepartment = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("Token is null or undefined");
        return;
      }

      const response = await api.post("/admin/department", inputs, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const newDepartment = response.data.department;
      console.log("new Department:", newDepartment);

      // Fetch the updated employee list
      const updatedResponse = await api.get("/admin/department", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedData = updatedResponse.data.department;
      console.log("Updated Employee List:", updatedData);

      setDepartment(updatedData);
      setOpenModal(false);
    } catch (error) {
      console.log("Error adding department:", error);
    }
  };

  const headers = ['Department', 'Designation'];
 
  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Department" subtitle="List of Department" />
      <Box display="flex" justifyContent="flex-end" mb="20px">
        <Button
          variant="contained"
          sx={{
            bgcolor: theme.palette.primary[50],
            color: theme.palette.secondary[1000],
          }}
          onClick={() => setOpenModal(true)}
        >
          + Add Department
        </Button>
      </Box>
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHead>
            <TableRow>
              <TableCell>Sl No </TableCell>
              {headers.map((header) => (
                <TableCell align="center">
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {department.map((dept,index) =>(
               <TableRow
               key={dept.department}
               sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
             >
              <TableCell component="th" scope="dept">
                  {index+1}
                </TableCell>
                <TableCell align="center">{dept.department}</TableCell>
                <TableCell align="center">
                  {dept.designation}
                </TableCell>
                <TableCell align="center">
                <EditIcon/>
                </TableCell>
               
                
             </TableRow>
            ))}
          </TableBody>
      </Table>
      </TableContainer>
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
      <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width:"30%",
            transform: "translate(-50%, -50%)",
            background: "#ffffff",
            padding: "20px",
            outline: "none",
          }}
        >
      <Typography variant="h6" component="h2" gutterBottom>
            Add Department
          </Typography>
         
          <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Divider sx={{border:1}} />
          <TextField
                  label="Department"
                  name="department"
                  value={inputs.department}
                  onChange={handleChange}
                  fullWidth
                />
                 <TextField
                  label="Designation"
                  name="designation"
                  value={inputs.designation}
                  onChange={handleChange}
                  fullWidth
                />
                 <Button variant="contained" onClick={handleAddDepartment}>
                  Submit
                 </Button>
          </Box>
          </div>
        </Modal>
     
    </Box>
    
  );
};

export default Department;
