/** @format */

import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import MuiDialogActions from '@material-ui/core/DialogActions'
import Typography from '@material-ui/core/Typography'
import { Snackbar, makeStyles } from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert'

// Composant Mytoast
const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
})

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant='h6'>{children}</Typography>
      {onClose ? '' : null}
    </MuiDialogTitle>
  )
})

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent)

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions)

export function MyToast(props) {
  return (
    <div>
      <Dialog
        onClose={props.onClose}
        aria-labelledby='customized-dialog-title'
        open={props.open}>
        <DialogContent dividers>
          <h1 style={props.styles}>{props.message}</h1>
        </DialogContent>
      </Dialog>
    </div>
  )
}

//************************************************************ */

function AlertNotification(props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />
}

const useStyles = makeStyles((theme) => ({
  root: {
    Top: theme.spacing(100),
  },
}))

export function Notification(props) {
  const classes = useStyles()

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    props.setOpen(false)
  }

  return (
    <div className={classes.root}>
      <Snackbar
        open={props.open}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        {...props}>
        <AlertNotification onClose={handleClose} severity={props.type || 'info'}>
          {props.message}
        </AlertNotification>
      </Snackbar>
    </div>
  )
}
