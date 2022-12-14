import { Autocomplete, Box, Button, FormControl, Stack, TextField, Typography } from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay'
import moment from 'moment'
import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { loginState } from '../../../../recoil/loginState'

import { BookingData } from '../BookingLeft'
import { useRecoilValue } from 'recoil'

const times = ['Morning', 'Afternoon']

function BookingForm(props) {
  const context = useContext(BookingData)
  const loginData = useRecoilValue(loginState)
  const { activeStep, setActiveStep } = props
  const [doctorName, setDoctorName] = useState(context.booking.doctorName)
  const [time, setTime] = useState(context.booking.time)
  const [date, setDate] = useState(context.booking.date)
  const [doctorTimes, setDoctorTimes] = useState(context.booking.doctorTimes)
  const [full, setFull] = useState(context.booking.full)
  const [morning, setMorning] = useState(context.booking.morning)
  const [afternoon, setAfternoon] = useState(context.booking.afternoon)

  // console.log(parseInt(moment(value).format("DD")));
  // console.log(moment(value).format('dddd MMMM DD YYYY'));

  //----------------------------------------------------------------------render

  const customDayRenderer = (date, selectedDates, pickersDayProps) => {
    const stringifiedDate = moment(date).format('YYYY-MM-DD')

    if (full.includes(stringifiedDate)) {
      return <PickersDay {...pickersDayProps} disabled />
    }
    return <PickersDay {...pickersDayProps} />
  }

  const defaultProps = {
    options: context.doctorList,
    getOptionLabel: (option) => option.name,
  }

  //----------------------------------------------------------------------get data

  const doctorInfor = async () => {
    const res = await axios.get('http://localhost:8080/api/doctor/list')
    if (res.data) {
      var arr = []
      for (let key in res.data) {
        arr.splice(key, 0, res.data[key])
      }
      context.setDoctorList(arr)
    }
  }

  useEffect(() => {
    if (!context.doctorList.length) {
      doctorInfor()
    }
  }, [])

  const doctorSchedule = async () => {
    const res = await axios.get(`https://62c65d1874e1381c0a5d833e.mockapi.io/doctorSchedule/${doctorName.value.id}`)
    if (res.data) {
      var arr = res.data.dates
      var fullArr = []
      var morningArr = []
      var afternoonArr = []
      for (let key in arr) {
        switch (arr[key].time) {
          case 'Full':
            fullArr.splice(fullArr.length, 0, arr[key].date)
            break
          case 'Morning':
            morningArr.splice(morningArr.length, 0, arr[key].date)
            break
          default:
            afternoonArr.splice(afternoonArr.length, 0, arr[key].date)
            break
        }
      }
      setFull(fullArr)
      setMorning(morningArr)
      setAfternoon(afternoonArr)
    }
  }

  const getTimeAvailable = async (date) => {
    axios
      .get(`http://localhost:8080/api/schedule/available?doctor_id=${doctorName.value.id}&date=${date}`)
      .then((response) => {
        console.log(response.data)
        let timesArr
        switch (response.data.shift - response.data.booked) {
          case 0:
            timesArr = []
            break
          case 1:
            timesArr = ['Morning']
            break
          case 2:
            timesArr = ['Afternoon']
            break
          default:
            timesArr = ['Morning', 'Afternoon']
        }

        setDoctorTimes(timesArr)
      })
  }

  const handleDoctorChange = (event, newValue) => {
    const error = !newValue

    setDoctorName({
      value: newValue,
      isChoosen: true,
      error,
    })
    setDate({
      value: null,
      day: '',
      month: '',
      year: '',
      isChoosen: false,
      error: null,
    })
    setTime({
      value: null,
      isChoosen: false,
      error: false,
    })
  }

  // useEffect(() => {
  //   //handle change doctor schedule api
  //   if (doctorName?.isChoosen && doctorName?.value) {
  //     doctorSchedule()
  //   }
  // }, [doctorName])

  useEffect(() => {
    if (date.value) {
      const stringifiedDate = moment(date.value).format('YYYY-MM-DD')
      getTimeAvailable(stringifiedDate)
    }
  }, [time])

  //----------------------------------------------------------------------validate

  const handleDateChange = (newValue) => {
    if (newValue === 'Invalid Date') {
      setDate({
        value: newValue,
        day: '',
        month: '',
        year: '',
        isChoosen: true,
      })
    } else if (newValue === null && date.error === null) {
      setDate({
        error: 'Required',
        value: newValue,
        day: '',
        month: '',
        year: '',
        isChoosen: true,
      })
    } else if (newValue !== null && date.error === 'Required') {
      setDate({
        error: null,
        value: newValue,
        day: moment(newValue).format('DD'),
        month: moment(newValue).format('MMMM'),
        year: moment(newValue).format('YYYY'),
        isChoosen: true,
      })
    } else {
      setDate({
        ...date,
        value: newValue,
        day: moment(newValue).format('DD'),
        month: moment(newValue).format('MMMM'),
        year: moment(newValue).format('YYYY'),
        isChoosen: true,
      })
    }
    setTime({
      value: null,
      isChoosen: false,
      error: false,
    })
  }

  const handleDateError = (error, newValue) => {
    setDate({
      ...date,
      error: error ?? 'Required',
    })
  }

  const handleTimeChange = (event, newValue) => {
    setTime({
      value: newValue,
      error: !newValue,
      isChoosen: true,
    })
  }

  //button action

  const pushBooking = async () => {
    let id
    let data = {
      customer_name: context.customer.name,
      customer_email: context.customer.email,
      customer_phone: context.customer.phoneNumber,
      doctor_id: doctorName.value.id,
      date: moment(date.value).format('YYYY-MM-DD'),
      shift: time.value === 'Morning' ? 1 : 2,
    }
    console.log(data)
    await axios
      .post(`http://localhost:8080/api/booking/create`, data)
      .then(() => {
        context.setBooking({
          doctorName,
          date,
          time,
        })
        setActiveStep((prevActiveStep) => prevActiveStep + 1)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const handleBack = () => {
    context.setBooking({
      doctorName,
      date,
      time,
      doctorTimes,
      morning,
      afternoon,
      full,
    })
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleFinish = () => {
    if (doctorName.isChoosen && !doctorName.error && date.isChoosen && !date.error && time.isChoosen && !time.error) {
      pushBooking()
    } else {
      if (!doctorName.isChoosen) {
        setDoctorName({
          ...doctorName,
          isChoosen: true,
          error: true,
        })
      } else if (doctorName.isChoosen && !doctorName.error) {
        if (!date.isChoosen) {
          setDate({
            ...date,
            isChoosen: true,
            error: 'Required',
          })
        } else if (date.isChoosen && !date.error) {
          if (!time.isChoosen) {
            setTime({
              ...time,
              error: true,
              isChoosen: true,
            })
          }
        }
      }
    }
  }

  return (
    <Box className="bookingTab">
      <Box>
        <Typography variant="h5">Doctor Booking</Typography>
      </Box>
      <Box
        className="b-container bookingTab-form"
        component="form"
        sx={{
          '& > :not(style)': { m: 1 },
        }}
        noValidate
        autoComplete="off"
      >
        <FormControl className="b-item bookingTab-form-item margin1 bookingTab-form-item-1">
          <Stack>
            <Typography variant="subtitle1">Doctors</Typography>
            <Autocomplete
              {...defaultProps}
              value={doctorName.value}
              onChange={handleDoctorChange}
              renderInput={(params) => <TextField {...params} error={doctorName.error} placeholder="Doctors" />}
            />
            <Box className="bookingTab-form-item-errorBox">
              <Typography variant="caption" className="bookingTab-form-item-errorText">
                {doctorName.error ? '*Required' : ''}
              </Typography>
            </Box>
          </Stack>
        </FormControl>

        <FormControl className="b-item bookingTab-form-item margin1 bookingTab-form-item-2">
          <Stack>
            <Typography variant="subtitle1">Choose Date</Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                disabled={doctorName.value === null || doctorName.value === ''}
                // !doctorName.value
                value={date.value}
                onError={handleDateError}
                disablePast
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} error={date.error !== null} />}
                renderDay={customDayRenderer}
              />
            </LocalizationProvider>
            <Box className="bookingTab-form-item-errorBox">
              <Typography variant="caption" className="bookingTab-form-item-errorText">
                {date.error !== null ? `*${date.error}` : ''}
              </Typography>
            </Box>
          </Stack>
        </FormControl>

        <FormControl className="b-item bookingTab-form-item margin1 bookingTab-form-item-3">
          <Stack>
            <Typography variant="subtitle1">Time</Typography>
            <Autocomplete
              disabled={date.error !== null || !date.isChoosen}
              options={doctorTimes}
              value={time.value}
              onChange={handleTimeChange}
              renderInput={(params) => <TextField {...params} error={time.error} placeholder="Times" />}
            />
            <Box className="bookingTab-form-item-errorBox">
              <Typography variant="caption" className="bookingTab-form-item-errorText">
                {time.error ? '*Required' : ''}
              </Typography>
            </Box>
          </Stack>
        </FormControl>

        <Box className="bookingTab-form-buttons">
          <Button variant="contained" onClick={handleBack}>
            Back
          </Button>
          <Button variant="contained" onClick={handleFinish}>
            Finish
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default BookingForm
