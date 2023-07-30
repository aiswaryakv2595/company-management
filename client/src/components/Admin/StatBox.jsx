import { Box, Typography, useTheme } from '@mui/material'
import React from 'react'

const StatBox = ({ title, value, icon }) => {
  const theme = useTheme()
  return (
    <Box
      gridColumn="span 4"
      gridRow="span 1"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      p="1.25rem 1rem"
      flex="1 1 100%"
      backgroundColor={theme.palette.secondary[20]}
      borderRadius="0.55rem"
     
      alignItems="center" 
      height="7rem" 
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
        <Typography variant='h6' fontSize="50px" style={{ lineHeight: '1' }}>
          {icon}
        </Typography>
        <Box textAlign="center">
          <Typography variant='h3' style={{ lineHeight: '1', marginTop: '0.2rem' }}>
            {value}
          </Typography>
          <Typography variant='h5' fontSize="italic" style={{ marginTop: '0.2rem' }} >
            {title}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default StatBox
