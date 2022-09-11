import { Box, Button } from '@mui/material'
import axios from 'axios'
import { useEffect, useState } from 'react'
import DSLeft from './DSLeft'
import DSRight from './DSRight'
import ResDialog from './ResDialog'
import LoadingPage from '../../LoadingPage'

import { loginState } from '../../../recoil/loginState'
import { useRecoilValue } from 'recoil'

function Body() {
  const [openDialog, setOpenDialog] = useState(false)
  const [schedules, setSchedules] = useState()
  const isLogin = useRecoilValue(loginState)

  const getSchedule = async () => {
    await axios.get(`http://localhost:8080/api/schedule/${isLogin.id}`).then((response) => {
      setSchedules(response.data)
    })
  }

  useEffect(() => {
    getSchedule()
  }, [])

  if (schedules === undefined) {
    return <LoadingPage />
  }

  return (
    <Box className="ds-body">
      <Box className="ds-body-container">
        <Button className="ds-body-container-button mobileDisplay" onClick={() => setOpenDialog(true)}>
          Add new schedule
        </Button>
        <ResDialog open={openDialog} setOpen={setOpenDialog} />
        <Box className="ds-body-item-1 ">
          <DSLeft schedules={schedules} setSchedules={setSchedules} />
        </Box>
        <Box className="ds-body-item-2">
          <DSRight schedules={schedules} setSchedules={setSchedules} />
        </Box>
      </Box>
    </Box>
  )
}

export default Body
