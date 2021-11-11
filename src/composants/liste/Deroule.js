/** @format */

import React, { useState } from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import List from '@material-ui/core/List'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import { Typography } from '@material-ui/core'
import MyAvatar from '../controls/avatar/MyAvatar'
import Tooltip from '@material-ui/core/Tooltip'

function Deroule(props) {
  const [open, setOpen] = React.useState(false)

  const handleClick = () => {
    setOpen(!open)
  }

  return (
    <>
      <ListItem button onClick={handleClick}>
        <ListItemText primary={props.libelle} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout='auto' unmountOnExit expanded={true} >
        <List component='div' disablePadding dense>
          {props.datax.length > 0 ? (
            props.datax.map((item) => (
              <ListItem button className={props.clax}>
                <Typography variant="body2">{item.e_smenu_libelle} </Typography>
                <div className='bloc-avatar'>
                  {item.droits_creer == 1 && (
                    <MyAvatar css='lecture-avatar' lettre='C' title='Créer' />
                  )}
                  {item.droits_lecture == 1 && (
                    <MyAvatar css='ecriture-avatar' lettre='L' title='Lire' />
                  )}
                  {item.droits_modifier == 1 && (
                    <MyAvatar
                      css='modif-avatar'
                      lettre='E'
                      title='Editer'
                    />
                  )}
                  {item.droits_supprimer == 1 && (
                    <MyAvatar css='suppression-avatar' lettre='S' title='Supprimer' />
                  )}
                </div>
              </ListItem>
            ))
          ) : (
            <ListItem button className={props.clax}>
              <Typography style={{ fontStyle: 'italic', opacity: '0.6' }}>
                Cliquez sur un profil pour voir ses droits sur "{props.lib}"{' '}
              </Typography>
            </ListItem>
          )}
        </List>
      </Collapse>
    </>
  )
}

export default Deroule
