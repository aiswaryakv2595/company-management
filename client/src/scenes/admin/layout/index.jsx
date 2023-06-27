import React,{useState} from 'react'
import {Box,useMediaQuery} from '@mui/material'
import { Outlet } from 'react-router-dom'
import Navbar from '../../../components/Navbar'
import Sidebar from '../../../components/Admin/Sidebar'
import { navItems } from '../../../navigations/NavData'

const Layout = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)")
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  return (
    <Box display={isNonMobile?"flex":"block"} width="100%" height="100%">
      <Sidebar 
      isNonMobile={isNonMobile}
      drawerWidth="250px"
      isSidebarOpen = {isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
      navItems = {navItems}
      userRole="admin"
      />
      
      <Box flexGrow={1}>
        <Navbar
        isSidebarOpen = {isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        showBackground = {true}/>
        <Outlet/>
      </Box>
    </Box>
  )
}

export default Layout