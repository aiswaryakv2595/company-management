import React, { useState } from 'react'
import Navbar from '../../../components/Navbar'
import { Box, useMediaQuery } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { navItemsEmp } from '../../../navigations/NavData'
import Sidebar from '../../../components/Admin/Sidebar'

const EmployeeLayout = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)")
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  return (
    <Box display={isNonMobile?"flex":"block"} width="100%" height="100%">
        <Sidebar 
      isNonMobile={isNonMobile}
      drawerWidth="250px"
      isSidebarOpen = {isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
      navItems = {navItemsEmp}
      userRole="employee"
      
      />
    <Box flexGrow={1}>
        <Navbar
        isSidebarOpen = {isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        showBackground = {false}/>
        <Outlet/>
      </Box>
      </Box>
  )
}

export default EmployeeLayout