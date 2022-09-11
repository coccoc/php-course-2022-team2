import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay'
import moment from 'moment'
import { Autocomplete, Box, Button, FormControl, Paper, Stack, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { dataState } from '../../../recoil/dataState'
import axios from 'axios'
import { useRecoilState } from 'recoil'
import { concatSchedule } from '../../../function/concatSchedule'

const times = ['Morning', 'Afternoon']

function DSLeft(props) {
  const { schedules, setSchedules, id, getSchedule } = props
  const [loginData, setLoginData] = useRecoilState(dataState)

  const [DSFdate, setDSFdate] = useState({
    value: null,
    choosen: false,
    error: null,
  })

  const [DSFtime, setDSFtime] = useState({
    value: null,
    choosen: false,
    error: false,
  })

  const [timeTable, setTimeTable] = useState(times)

  //--------------------------------------------------------------------Render calendar && time

  const customDayRenderer = (date, selectedDates, pickersDayProps) => {
    const stringifiedDate = moment(date).format('YYYY-MM-DD')
    const condition = schedules.some((schedule) => schedule.date === stringifiedDate && schedule.shift === 3)
    if (condition) {
      return <PickersDay {...pickersDayProps} disabled />
    }
    return <PickersDay {...pickersDayProps} />
  }

  useEffect(() => {
    if (DSFdate.value !== null) {
      const stringifiedDate = moment(DSFdate.value).format('YYYY-MM-DD')
      let arr = schedules.filter((schedule) => schedule.date === stringifiedDate)
      let timesArr = ['Morning', 'Afternoon']
      console.log(arr)
      if (arr.length === 1) {
        switch (arr[0].shift) {
          case 1:
            timesArr = ['Afternoon']
            break
          default:
            timesArr = ['Morning']
            break
        }
      }
      setTimeTable(timesArr)
    }
  }, [DSFdate])

  //--------------------------------------------------------------------Handle changes

  const handleDSFdateChange = (newValue) => {
    if (newValue === 'Invalid Date') {
      setDSFdate({
        ...DSFdate,
        value: newValue,
        choosen: true,
      })
    } else if (newValue === null && DSFdate.error === null) {
      setDSFdate({
        error: 'Required',
        value: newValue,
        choosen: true,
      })
    } else if (newValue !== null && DSFdate.error === 'Required') {
      setDSFdate({
        value: newValue,
        error: null,
        choosen: true,
      })
    } else {
      setDSFdate({
        ...DSFdate,
        value: newValue,
        choosen: true,
      })
    }
    setDSFtime({
      value: null,
      choosen: false,
      error: false,
    })
  }

  const handleDSFdateError = (error, newValue) => {
    if (error === null) {
      setDSFdate({
        ...DSFdate,
        error: 'Required',
      })
    } else {
      setDSFdate({
        ...DSFdate,
        error,
      })
    }
  }

  const handleDFStimeChange = (event, newValue) => {
    var error = false
    if (newValue === null) {
      error = true
    }
    setDSFtime({
      value: newValue,
      choosen: true,
      error,
    })
  }

  //--------------------------------------------------------------------Handle click button

  const handleClear = () => {
    setDSFdate({
      value: null,
      choosen: false,
      error: null,
    })
    setDSFtime({
      value: null,
      choosen: false,
      error: false,
    })
  }

  const postSchedlue = async () => {
    let data = {
      doctor_id: id,
      date: moment(DSFdate.value).format('YYYY-MM-DD'),
      shift: DSFtime.value === 'Morning' ? 1 : 2,
    }

    await axios.post(`http://localhost:8080/api/schedule`, data).catch((error) => {
      console.log(error)
    })
    await getSchedule()
  }

  const handleSubmit = () => {
    if (!DSFdate.choosen) {
      setDSFdate({
        ...DSFdate,
        choosen: true,
        error: 'Required',
      })
    }
    if (!DSFtime.choosen && DSFdate.error === null && DSFdate.choosen) {
      setDSFtime({
        ...DSFtime,
        choosen: true,
        error: true,
      })
    }
    if (DSFtime.choosen && !DSFtime.error && DSFdate.choosen && !DSFdate.error) {
      postSchedlue()

      setDSFdate({
        value: null,
        choosen: false,
        error: null,
      })
      setDSFtime({
        value: null,
        choosen: false,
        error: false,
      })
    }
  }

  return (
    <Box className="dsL">
      <Paper className="dsL-paper">
        <Box className="dsL-paper-head">
          <Typography className="dsL-paper-head-typography" variant="h5" sx={{ color: '#fff' }}>
            New schedule
          </Typography>
        </Box>
        <Box className="dsL-paper-body">
          <Box
            component="form"
            className="dsL-paper-body-form"
            sx={{
              '& > :not(style)': { m: 1 },
            }}
            noValidate
            autoComplete="off"
          >
            <FormControl className="dsL-paper-body-form-item">
              <Stack>
                <Typography variant="subtitle1">Date</Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    value={DSFdate.value}
                    onError={(error, newValue) => handleDSFdateError(error, newValue)}
                    disablePast
                    onChange={(newValue) => handleDSFdateChange(newValue)}
                    renderInput={(params) => <TextField {...params} error={DSFdate.error !== null} />}
                    renderDay={customDayRenderer}
                  />
                </LocalizationProvider>
                <Box className="dsL-paper-body-form-item-error">
                  <Typography className="error-text" variant="caption">
                    {DSFdate.error === null ? '' : `*${DSFdate.error}`}
                  </Typography>
                </Box>
              </Stack>
            </FormControl>
            <FormControl className="dsL-paper-body-form-item">
              <Stack>
                <Typography variant="subtitle1">Time</Typography>
                <Autocomplete
                  disabled={DSFdate.error !== null || !DSFdate.choosen}
                  options={timeTable}
                  value={DSFtime.value}
                  onChange={(event, newValue) => handleDFStimeChange(event, newValue)}
                  renderInput={(params) => <TextField {...params} error={DSFtime.error} placeholder="Time" />}
                />
                <Box className="dsL-paper-body-form-item-error">
                  <Typography
                    className="error-text"
                    variant="caption"
                    sx={{
                      color: 'red',
                    }}
                  >
                    {DSFtime.error ? '*Required' : ''}
                  </Typography>
                </Box>
              </Stack>
            </FormControl>
            <Box className="dsL-paper-body-form-buttonBox">
              <Button variant="contained" onClick={handleClear}>
                Clear
              </Button>
              <Button variant="contained" onClick={handleSubmit}>
                {/*handleSubmit Submit*/}
                Submit
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}

export default DSLeft
