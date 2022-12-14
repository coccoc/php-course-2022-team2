import {
  Box,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import moment from 'moment'

import { tokenState } from '../../../recoil/tokenState'
import { loginState } from '../../../recoil/loginState'
import { useRecoilValue } from 'recoil'
import { useEffect, useState } from 'react'
import axios from 'axios'
import DBRow from './DBRow'
import { de } from 'date-fns/locale'

function Body() {
  const isLogin = useRecoilValue(loginState)
  const tokenData = useRecoilValue(tokenState)

  const [bookingSchedule, setBookingSchedule] = useState()
  const [shows, setShows] = useState()
  const [date, setDate] = useState({
    value: null,
    error: null,
  })
  console.log(shows)
  const [page, setPage] = useState(0)
  const [deleteInfo, setDeleteInfo] = useState()

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const callAPI = async () => {
    let id = !isLogin.id ? '1' : isLogin.id
    axios.defaults.headers.common['Authorization'] = `${tokenData?.token}`
    await axios
      .get(`http://localhost:8080/api/booking/${id}`)
      .then((response) => {
        console.log(response)
        setBookingSchedule(response.data)
        setShows(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    callAPI()
    return () => {
      axios.defaults.headers.common['Authorization'] = ``
    }
  }, [])

  const deleteDataApi = async () => {
    const arr = shows.filter((show) => show.id !== deleteInfo.id)
    const doctorData = {
      bookings: arr,
    }
    let userData
    await axios
      .put(`https://62c65d1874e1381c0a5d833e.mockapi.io/doctorSchedule/${isLogin.id}`, doctorData)
      .catch((error) => {
        console.log(error)
      })
    await axios
      .get(`https://62c65d1874e1381c0a5d833e.mockapi.io/userData/${deleteInfo.patientId}`)
      .then((response) => {
        const arr2 = response.data.dates.filter((item) => item.id != deleteInfo.id)
        console.log(arr2)
        userData = {
          dates: arr2,
        }
      })
      .catch((error) => {
        console.log(error)
      })
    await axios
      .put(`https://62c65d1874e1381c0a5d833e.mockapi.io/userData/${deleteInfo.patientId}`, userData)
      .catch((error) => {
        console.log(error)
      })
    await callAPI()
  }

  useEffect(() => {
    if (deleteInfo) {
      deleteDataApi()
    }
  }, [deleteInfo])

  useEffect(() => {
    if (date.error === null) {
      if (date.value === null) {
        setShows(bookingSchedule)
      } else {
        let arr = []
        let stringifyDate = moment(date.value).format('YYYY-MM-DD')
        for (let key in bookingSchedule) {
          if (bookingSchedule[key].date === stringifyDate) {
            arr.push(bookingSchedule[key])
          }
        }
        setShows(arr)
        setPage(0)
      }
    }
  }, [date])

  const checkday = (newDate) => {
    return date.value === newDate
  }

  const handleDateError = (error, newValue) => {
    setDate({
      ...date,
      error,
    })
  }

  return (
    <Box className="drBs">
      <Paper className="drBs-paper">
        <Box className="drBs-paper-header">
          <Box className="drBs-paper-header-1">
            <Typography variant="h5" sx={{ color: '#fff' }}>
              Booking schedule
            </Typography>
          </Box>
        </Box>
        <Box className="drBS-paper-body">
          <TableContainer className="drBS-paper-body-table">
            <Table stickyHeader={true}>
              <TableHead>
                <TableRow>
                  <TableCell align="left">Id</TableCell>
                  <TableCell align="left">Name</TableCell>
                  <TableCell align="left">Date</TableCell>
                  <TableCell align="left">Time</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {shows === undefined ? (
                  <TableRow>
                    <TableCell align="left">
                      <Skeleton variant="text" animation="wave" />
                    </TableCell>
                    <TableCell align="left">
                      <Skeleton variant="text" animation="wave" />
                    </TableCell>
                    <TableCell align="left">
                      <Skeleton variant="text" animation="wave" />
                    </TableCell>
                    <TableCell align="left">
                      <Skeleton variant="text" animation="wave" />
                    </TableCell>
                    <TableCell align="left">
                      <Skeleton variant="circular" animation="wave" sx={{ width: '16px' }} />
                    </TableCell>
                  </TableRow>
                ) : (
                  shows.slice(page * 5, page * 5 + 5).map((show, index) => {
                    return (
                      <DBRow
                        key={index}
                        index={index}
                        show={show}
                        deleteInfo={deleteInfo}
                        setDeleteInfo={setDeleteInfo}
                      />
                    )
                  })
                )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5]}
              rowsPerPage={5}
              component="div"
              count={shows !== undefined ? shows.length : 0}
              page={page}
              onPageChange={handleChangePage}
            />
          </TableContainer>
        </Box>
      </Paper>
    </Box>
  )
}

export default Body
