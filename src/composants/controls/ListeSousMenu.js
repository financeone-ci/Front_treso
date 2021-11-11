/** @format */

import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import ListSubheader from '@material-ui/core/ListSubheader'
import List from '@material-ui/core/List'
import MyListItem from './MyListItem'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '25vh',
    maxHeight: '25vh',
    maxWidth: 360,
    position: 'relative',
    overflow: 'auto',
    marginBottom: '10px',
  },
  entete: {
    backgroundColor: '#9c9b9a',
    color: '#FFFFFF',
    fontSize: '15px',
    textAlign: 'left',
    lineHeight: '30px',
  },
}))

function ListeSousMenu(props) {
  const classes = useStyles()
  return (
    <>
      {props.adminGeneral.length > 0 && (
        <List
          component='nav'
          aria-labelledby='nested-list-subheader'
          subheader={
            <ListSubheader component='div' className={classes.entete}>
              {props.volet}
            </ListSubheader>
          }
          className={classes.root}
          dense={true}
          style={{
            border: 'rgba(187, 183, 183, 0.50) solid 1px',
            minWidth: '100%',
          }}>
          {props.adminGeneral.length > 0 &&
            props.adminGeneral.map((item) => (
              <MyListItem
                key={item.id}
                lien={item.e_smenu_lien || null}
                icone={item.icone || <ChevronRightIcon fontSize='small' />}
                textPrincipal={item.e_smenu_libelle}
                textSecondaire={item.textSecondaire || null}
                vue={item.droits_lecture || null}
              />
            ))}
        </List>
      )}
    </>
  )
}
export default React.memo(ListeSousMenu)
