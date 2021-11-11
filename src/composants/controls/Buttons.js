/** @format */

import React from 'react'
import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles({
  root: {
    // background: 'linear-gradient(45deg, #009688 30%, #bdbdbd 90%)',
    border: 0,
    borderRadius: 3,
    height: 48,
    padding: '0 30px',
  },
})

function Buttons(props) {
  const classes = useStyles()
  return (
    <Button
      type={props.type || 'submit'}
      variant={props.variant || 'contained'}
      
      className={classes.root}
      {...props}>
      {props.children}
    </Button>
  )
}

export default Buttons
