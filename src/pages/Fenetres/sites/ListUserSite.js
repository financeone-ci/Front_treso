/** @format */

import React, { useState, useEffect } from 'react'
import ModalForm from '../../../composants/controls/modal/ModalForm'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Checkbox from '@material-ui/core/Checkbox'
import axios from '../../../api/axios'
import { makeStyles } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}))

function ListUserSite(props) {
  // stats
  const classes = useStyles()

  // Mise à jour de la liste des utilisateurs du site
  const handleToggle = (user, site) => () => {
    const currentIndex = props.checked.indexOf(user)
    const newChecked = [...props.checked]
    // Appel API
    const headers = {
      Authorization: props.Authorization,
    }
    if (currentIndex === -1) {
      // Ajout de user au site
      axios
        .get(`sites/GestUserSite.php?site=${site}&us=${user}&act=${0}`, {
          headers,
        })
        .then((response) => {
          if (response.data.reponse == 'error') {
            props.setNotify({
              type: response.data.reponse,
              message: response.data.message,
            })
            props.setOpenNotif(true)
          }
        })
        .catch((error) => {
          props.setNotify({
            type: 'error',
            message: `Service indisponible: ${error}`,
          })
          props.setOpenNotif(true)
        })
      newChecked.push(user)
    } else {
      // Suppression de user du site
      axios
        .get(`sites/GestUserSite.php?site=${site}&us=${user}&act=${1}`, {
          headers,
        })
        .then((response) => {
          if (response.data.reponse == 'error') {
            props.setNotify({
              type: response.data.reponse,
              message: response.data.message,
            })
            props.setOpenNotif(true)
          }
        })
        .catch((error) => {
          props.setNotify({
            type: 'error',
            message: `Service indisponible: ${error}`,
          })
          props.setOpenNotif(true)
        })
      newChecked.splice(currentIndex, 1)
    }
    props.setChecked(newChecked)
  }

  return (
    <>
      <ModalForm
        title={props.titreModal}
        handleClose={props.handleClose}
        open={props.openModal}>
        <List dense className={classes.root}>
          {props.usersite.map((item) => {
            const labelId = item.id
            return (
              <ListItem key={item.id} button>
                <ListItemAvatar>
                  <Avatar alt={item.user_nom} src={'/broken-image.jpg'} />
                </ListItemAvatar>
                <ListItemText
                  id={labelId}
                  primary={`${item.user_nom} ${item.user_prenom}`}
                />
                <ListItemSecondaryAction>
                  <Checkbox
                    edge='end'
                    onChange={handleToggle(item.id, props.siteId)}
                    checked={props.checked.indexOf(item.id) !== -1}
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            )
          })}
        </List>
      </ModalForm>
    </>
  )
}

export default ListUserSite
