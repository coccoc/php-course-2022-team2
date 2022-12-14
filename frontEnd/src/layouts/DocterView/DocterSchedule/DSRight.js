import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import TRow from './TRow'
import { dataState } from '../../../recoil/dataState'
import { useRecoilValue } from 'recoil'

function DSRight(props) {
  const { schedules, setSchedules } = props
  const loginData = useRecoilValue(dataState)
  const [page, setPage] = useState(0)

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  return (
    <Box className="dsR">
      <Paper className="dsR-paper">
        <Box className="dsR-paper-head">
          <Typography variant="h5" sx={{ color: '#fff' }}>
            Schedule table
          </Typography>
        </Box>
        <Box className="dsR-paper-body">
          <TableContainer className="dsR-paper-body-table">
            <Table stickyHeader={true}>
              <TableHead>
                <TableRow>
                  <TableCell align="left">Id</TableCell>
                  <TableCell align="left">Date</TableCell>
                  <TableCell align="left">Time</TableCell>
                  <TableCell align="left"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {schedules.slice(page * 5, page * 5 + 4).map((schedule) => (
                  <TRow key={schedule.id} schedule={schedule} />
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5]}
              rowsPerPage={5}
              component="div"
              count={schedules.length}
              page={page}
              onPageChange={handleChangePage}
            />
          </TableContainer>
        </Box>
      </Paper>
    </Box>
  )
}

export default DSRight
