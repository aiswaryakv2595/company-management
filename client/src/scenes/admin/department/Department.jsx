import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../../../index.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Button,
  Divider,
  Modal,
  TableCell,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import Header from "../../../components/Header";
import EditIcon from "@mui/icons-material/Edit";
import { adminApi } from "../../../redux/api/employeeApi";
import { DataGrid } from "@mui/x-data-grid";

const Department = () => {
  const [department, setDepartment] = useState([]);
  const theme = useTheme();
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);

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
    const fetchDepartment = async () => {
      try {
        const response = await adminApi.getDepartment();
        console.log("Response:", response);
        const data = response.department;
        console.log("Department data:", data);
        setDepartment(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (isLoggedIn) {
      fetchDepartment();
    }
  }, [isLoggedIn]);

  const handleAddDepartment = async () => {
    try {
      const updatedResponse = await adminApi.addDepartment(inputs);

      const response = await adminApi.getDepartment();

      const newDepartment = response.department;

      setDepartment(newDepartment);
      setOpenAddModal(false);
      toast.success("Department added sucessfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const handleEditDepartment = async () => {
    try {
      const updatedResponse = await adminApi.updateDepartment(
        editingDepartment._id,
        inputs
      );

      const response = await adminApi.getDepartment();

      const newDepartment = response.department;

      setDepartment(newDepartment);
      setOpenEditModal(false);
    } catch (error) {
      console.log("Error editing department:", error);
    }
  };

  const handleEdit = (id) => {
    //get the element corresponding to that id
    const departmentToEdit = department.find((dep) => dep._id === id);
    setEditingDepartment(departmentToEdit);
    setInputs({
      department: departmentToEdit.department,
      designation: departmentToEdit.designation,
    });
    setOpenEditModal(true);
  };

  const departmentWithIndex = department.map((row, index) => ({
    ...row,
    slNo: index + 1,
  }));

  const columns = [
    { field: "slNo", headerName: "SL No", width: 200 },
    { field: "department", headerName: "Department", width: 200 },
    { field: "designation", headerName: "Designation", width: 250 },
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
            startIcon={<EditIcon />}
            onClick={() => handleEdit(params.row._id)}
          >
            Edit
          </Button>
        </TableCell>
      ),
    },
  ];

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
          onClick={() => setOpenAddModal(true)}
        >
          + Add Department
        </Button>
      </Box>
      <Box mt="20px">
        <DataGrid
          rows={departmentWithIndex}
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
            Add Department
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <Divider sx={{ border: 1 }} />
            <TextField
              label="Department"
              name="department"
              value={inputs.department}
              onChange={handleChange}
              fullWidth
              className={
                inputs.department.length > 100 ? "department-input" : ""
              }
              data-full={inputs.department}
            />
            <TextField
              label="Designation"
              name="designation"
              value={inputs.designation}
              onChange={handleChange}
              className={
                inputs.designation.length > 100 ? "department-input" : ""
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
              onClick={handleAddDepartment}
            >
              Submit
            </Button>
          </Box>
        </div>
      </Modal>

      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
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
            Edit Department
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <Divider sx={{ border: 1 }} />
            <TextField
              label="Department"
              name="department"
              value={inputs.department}
              onChange={handleChange}
              fullWidth
              className={
                inputs.department.length > 100 ? "department-input" : ""
              }
              data-full={inputs.department}
            />
            <TextField
              label="Designation"
              name="designation"
              value={inputs.designation}
              onChange={handleChange}
              className={
                inputs.designation.length > 100 ? "department-input" : ""
              }
              data-full={inputs.designation}
              fullWidth
            />
            <Button
              sx={{
                bgcolor: theme.palette.primary[50],
                color: theme.palette.secondary[1000],
              }}
              variant="contained"
              onClick={handleEditDepartment}
            >
              Submit
            </Button>
          </Box>
        </div>
      </Modal>
    </Box>
  );
};

export default Department;