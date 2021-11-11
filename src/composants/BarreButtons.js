/** @format */

import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'left',
    marginBottom: '4px',
    marginTop: '-10px',
  },
}))

export default function BarreButtons(props) {
  const classes = useStyles(props)

  return <div className={classes.root}>{props.buttons}</div>
}
