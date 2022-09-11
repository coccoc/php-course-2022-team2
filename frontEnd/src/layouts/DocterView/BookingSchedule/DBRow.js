import { IconButton, TableCell, TableRow } from '@mui/material'
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { useState } from 'react'
import DBDialog from './DBDialog'

function DBRow(props) {
  const { index, show, deleteInfo, setDeleteInfo } = props
  const [open, setOpen] = useState(false)

  const handleDelete = () => {
    setOpen(true)
  }

  const handleAgree = () => {
    // setDeleteInfo({
    //   id: show.id,
    //   patientId: show.patientId,
    // })
    setOpen(false)
  }

  const handleDissagree = () => {
    setOpen(false)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
        <TableCell align="left">{index + 1}</TableCell>
        <TableCell align="left">{show.customer_name}</TableCell>
        <TableCell align="left">{show.date}</TableCell>
        <TableCell align="left">{show.shift === 3 ? 'Full' : show.shift === 2 ? 'Afternoon' : 'Morning'}</TableCell>
        <TableCell align="left">
          <IconButton onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <Dialog open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
        <DialogTitle>
          <span>Phiên bản này chưa hỗ trợ delete </span>
        </DialogTitle>
        <DialogActions>
          <Button autoFocus onClick={handleDissagree}>
            Disagree
          </Button>
          <Button autoFocus onClick={handleAgree}>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default DBRow
