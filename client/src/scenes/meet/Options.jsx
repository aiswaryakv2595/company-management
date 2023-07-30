import { Button, TextField } from '@mui/material'
import React, { useCallback, useState } from 'react'
import {useNavigate} from 'react-router-dom'


const Options = () => {
  const [value, setValue] = useState("")
  const navigate = useNavigate()
  const handleJoin = useCallback(()=>{
 navigate(`/room/${value}`)
  },[navigate,value])
  return (
    <div>

    <TextField value={value}
    onChange={e=>setValue(e.target.value)}
    placeholder='room id'>

    </TextField>
    <Button variant='contained' color='info' onClick={handleJoin}>Join</Button>
  </div>
  )
}

export default Options