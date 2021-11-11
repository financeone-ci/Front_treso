/** @format */

import React from 'react'
import { ListItem } from '@material-ui/core'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { NavLink } from 'react-router-dom'
import { makeStyles } from '@material-ui/core'
import { useLocation } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  link: {
    textDecoration: 'none',
    color: 'rgba(0, 0, 0, 0.87)',
    fontWeight: 'bold',
    paddingTop: '0px',
    paddingBottom: '0px',
    minHeight: '10px',
  },
  ico: {
    minWidth: '27px',
  },
}))

function MyListItem(props) {
  const classes = useStyles()
  let location = useLocation()
  return (
    <>
      {props.vue == 1 && (
        <ListItem className={classes.link}>
          <ListItemIcon className={classes.ico}>{props.icone}</ListItemIcon>
          <NavLink
            to={location.pathname + props.lien || '#'}
            style={{ textDecoration: 'none', color: '#282c34' }}>
            <ListItemText
              primary={props.textPrincipal}
              secondary={props.textSecondaire ? props.textSecondaire : null}
            />
          </NavLink>
        </ListItem>
      )}
    </>
  )
}

export default React.memo(MyListItem)
