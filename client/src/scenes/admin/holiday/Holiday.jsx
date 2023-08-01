import { Box, Button, Divider, Modal, TableCell, TextField, Typography, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Header from '../../../components/Header'
import { useSelector } from 'react-redux';
import { adminApi } from '../../../redux/api/employeeApi';
import { DataGrid } from '@mui/x-data-grid';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from 'moment';


const Holiday = () => {
    const theme = useTheme();
    const [holiday, setHoliday] = useState([]);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [inputs, setInputs] = useState({
        date: "",
        title: "",
      });
      const handleChange = (e) => {
        setInputs((prev) => ({
          ...prev,
          [e.target.name]: e.target.value,
        }));
      };
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
      const handleAddHoliday = async () => {
        try {
          const updatedResponse = await adminApi.addHoliday(inputs);
    
        //   const response = await adminApi.getDepartment();
    
          const newHoliday = updatedResponse.holiday;
          setHoliday((prev) => [...prev, newHoliday]);
    
        //   setHoliday(newDepartment);
          setOpenAddModal(false);
          toast.success("Holiday added sucessfully");
        } catch (error) {
          toast.error(error?.response?.data?.message || error.message);
        }
      };
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
        {
          field: "actions",
          headerName: "Actions",
          width: 200,
          renderCell: (params) => (
            <TableCell>
              <Button
                variant="contained"
                sx={{
                  bgcolor: theme.palette.primary[50],
                  color: theme.palette.secondary[1000],
                }}
                // startIcon={<EditIcon />}
                // onClick={() => handleEdit(params.row._id)}
              >
                Edit
              </Button>
            </TableCell>
          ),
        },
      ];
    
  return (
    <Box m="1.5rem 2.5rem">
        <Header title="Holiday" subtitle="List of Holidays" />
        <Box display="flex" justifyContent="flex-end" mb="20px">
        <Button
          variant="contained"
          sx={{
            bgcolor: theme.palette.primary[50],
            color: theme.palette.secondary[1000],
          }}
          onClick={() => setOpenAddModal(true)}
        >
          + Add Holiday
        </Button>
      </Box>
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
      <Modal open={openAddModal} onClose={() => setOpenAddModal(false)}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "30%",
            transform: "translate(-50%, -50%)",
            background: "#ffffff",
            padding: "20px",
            outline: "none",
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Add Holiday
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <Divider sx={{ border: 1 }} />
            <TextField
              label="Date"
              name="date"
              type='date'
              value={inputs.date}
              onChange={handleChange}
              fullWidth
              className={
                inputs.date.length > 100 ? "department-input" : ""
              }
              data-full={inputs.date}
            />
            <TextField
              label="Title"
              name="title"
              value={inputs.title}
              onChange={handleChange}
              className={
                inputs.title.length > 100 ? "department-input" : ""
              }
              data-full={inputs.designation}
              fullWidth
            />
            <Button
              variant="contained"
              sx={{
                bgcolor: theme.palette.primary[50],
                color: theme.palette.secondary[1000],
              }}
              onClick={handleAddHoliday}
            >
              Submit
            </Button>
          </Box>
        </div>
      </Modal>
    </Box>
  )
}

export default Holiday