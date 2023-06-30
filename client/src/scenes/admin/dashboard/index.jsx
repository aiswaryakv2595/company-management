import React from 'react'
import {Box} from '@mui/material'
import FlexBetween from '../../../components/FlexBetween'
import Header from '../../../components/Header'
function Dashboard() {
  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header title="Welcome Admin" subtitle="Dashboard"/>
      </FlexBetween>
    </Box>
  )
}

export default Dashboard