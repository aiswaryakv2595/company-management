import {Typography,Box,useTheme} from '@mui/material'

import React from 'react'

const Header = ({title,subtitle}) => {
    const theme = useTheme()
  return (
    <Box>
        <Typography variant='h2' 
        color={theme.palette.primary[50]}
        fontWeight='bold'
        sx={{mb:'5px'}}>
            {title}
        </Typography>
        <Typography variant='h5' 
        color={theme.palette.grey[800]}
        fontWeight='bold'
        sx={{mb:'5px'}}>
            {subtitle}
        </Typography>
    </Box>
  )
}

export default Header