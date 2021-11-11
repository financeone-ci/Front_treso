/** @format */

import { Card } from '@material-ui/core'
import React from 'react'
import { makeStyles, Typography, Breadcrumbs, Link } from '@material-ui/core'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import { Paper } from '@material-ui/core'
import FuncBread from '../functions/FuncBread'

const useStyle = makeStyles((theme) => ({
  root: {
    backgroundColor: 'rgba(0,0,0,0)',
    marginTop: '-31px',
    marginLeft: '-22px',
    marginRight: '-22px',
    padding: '0px',
  },
  pageHeader: {
    display: 'flex',
    marginBottom: theme.spacing(2),
  },
  pageIcon: {
    display: 'inline-block',

    color: '#3c44b1',
    borderRadius: '8px',
    padding: '10px',
    paddingRight: '0px',
  },
  pageTitle: {
    textAlign: 'left',
    paddingLeft: theme.spacing(2),
    '& .MuiTypography-subtitle2': {
      opacity: '0.6',
    },
  },
  breadStyle: {
    fontSize: '12px',
    '& .MuiBreadcrumbs-separator': { margin: '3px' },
  },
}))

const PageHeader = (props) => {
  const classes = useStyle()
  return (
    <Paper elevation={2} square className={classes.root}>
      <div className={classes.pageHeader}>
        <span className={classes.pageIcon}>{props.icone}</span>
        <div className={classes.pageTitle}>
          <Typography variant='h6' component='div'>
            {props.titrePage}
          </Typography>
          {FuncBread()}
        </div>
      </div>
    </Paper>
  )
}

export default PageHeader
