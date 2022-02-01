/** @format */

import React, { useState, useEffect } from 'react'
import Box from '@material-ui/core/Box'
import { MyToast } from '../composants/controls/toast/MyToast'
import Idle from 'react-idle'
import { Link } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import jwt from 'jsonwebtoken'
import Constantes from '../api/Constantes'


const IdleFunc = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['_Jst'])
  var history = useHistory()
  var temps0 = 15 * 60 //temps avant compte à rebours (13min)
  var temps = 17 * 60 //temps avant déconnexion automatique (2min)
  var warn = 30 // temps avant "danger" (30s)
  const [delay, setDelay] = useState(temps)

  /// ouverture alerte déconnexion
  const [t_open, setT_Open] = React.useState(false)

  const t_handleClickOpen = () => {
    setT_Open(true)
  }
  const t_handleClose = () => {
    setT_Open(false)
  }
  const StopCnx = useCallback(() => {
    removeCookie('_Jst', {
      expires: new Date(2021, 1, 1),
      path: '/',
    })
    history.push('/')
  })
  useEffect(() => {
    const idInterval = setInterval(() => {
      setDelay((delay) => delay - 1)
    }, 1000)
    return () => {
      clearInterval(idInterval)
    }
  }, [])

  var lestyle = {}
  if (delay - temps0 < warn) {
    lestyle = { color: 'red' }
  }
  let login =""
  let id =""
  let nom =""

  try {
    var infos = cookies._Jst
    var donneesUser = jwt.verify(infos, Constantes.token)
   login = donneesUser.user_login
   id = donneesUser.user_id
   nom = donneesUser.user_nom+' '+donneesUser.user_prenom+' ('+login+')'
   
  } catch (error) {
   // console.log(error)
  } 


  return (
    <>
      <Box pt={4}>
       

        <Idle
          timeout={temps0 * 1000}
          //timeout={840000}
          //timeout={5000}
          render={({ idle }) => (
            <h1>
              {idle ? t_handleClickOpen() : (t_handleClose(), setDelay(temps))}
            </h1>
          )}
        />
        <Idle
          timeout={temps * 1000}
          //timeout={10000}
          render={({ idle }) => <h1>{idle && StopCnx()}</h1>}
        />
        <MyToast
          styles={lestyle}
          onClose={t_handleClose}
          open={t_open}
          className='warn'
          message={`Déconnexion dans ${delay - temps0} s`}
          // message='Vous serez déconnecté dans 60s'
        />
      </Box>
    </>
  )
}

export default IdleFunc
