import { Box, Card, CardContent, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Header from '../../../components/Header'
import { useSelector } from 'react-redux';
import { api } from '../../../redux/api/api';
import { useNavigate } from 'react-router-dom';
import { employeeApi } from '../../../redux/api/employeeApi';

const UserProject = () => {
    const [project, setProject] = useState([]);
    const isLoggedIn = useSelector((state) => state.employee.isLoggedIn);
    const navigate = useNavigate()
    useEffect(() => {
       
        const fetchProjectDetails = async () => {
            try {
            
              const response = await employeeApi.getEmployeeProject()
              const data = response.project;
              console.log("data------", data);
              setProject(data);
            } catch (error) {
              console.log("Error fetching user details:", error);
            }
          };
    
      if(isLoggedIn){
        fetchProjectDetails()
      }
    }, [isLoggedIn])
    const handleTask = async (projectId) => {
     
        navigate(`/view-task?id=${projectId}`)
        
      
    
    };
    
  return (
    <Box m="1.5rem 2.5rem">
        <Header title="All Projects" subtitle="Project Details" />
        {project.length > 0 ? (
        <Box
        mt="20px" display="flex" flexWrap="wrap" gap={2}
        >
          {project.map((prj) => (
            <Card key={prj._id}
            sx={{
              maxWidth: 345,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              flexGrow:1}}
              onClick={() => handleTask(prj._id)}>
              <CardContent>
               
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  sx={{ textAlign: "center" }}
                >
                  {prj.project_name}
                  
                </Typography>
                <Typography variant="h6" gutterBottom>
        Status: {prj.status}
        </Typography>
        <Typography variant="body2" color="text.secondary">
        {prj.description}
        </Typography>
        <Typography variant="h6" gutterBottom sx={{mt:2}}>
        Deadline:
        <Typography 
         gutterBottom
         variant="h6"
         component="div">
        {new Date(prj.deadline).toLocaleDateString()}
        </Typography>
         
        </Typography>

        <Typography variant="h6" gutterBottom sx={{mt:2}}>
        Team Leader:
        <Typography 
         gutterBottom
         variant="h6"
         component="div">
        {prj.assigned_to.first_name +' '+prj.assigned_to.last_name}
        </Typography>
         
        </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : null}
    </Box>
  )
}

export default UserProject