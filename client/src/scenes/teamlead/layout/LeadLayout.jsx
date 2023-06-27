import { Box, useMediaQuery } from '@mui/material'
import React, { useState } from 'react'
import Sidebar from '../../../components/Admin/Sidebar'
import Navbar from '../../../components/Navbar'
import { Outlet } from 'react-router-dom'
import { navItemsteamlead } from '../../../navigations/NavData'

const LeadLayout = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)")
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  return (
    <Box display={isNonMobile?"flex":"block"} width="100%" height="100%">
        <Sidebar 
      isNonMobile={isNonMobile}
      drawerWidth="250px"
      isSidebarOpen = {isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
      navItems = {navItemsteamlead}
      userRole="teamlead"
      
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

export default LeadLayout