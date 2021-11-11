/** @format */

import React, { useState } from 'react'
import Avatar from '@material-ui/core/Avatar'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Box from '@material-ui/core/Box'
import { makeStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'
import * as yup from 'yup'
import { NavLink, useHistory } from 'react-router-dom'
import axios from '../api/axios'
import Controls from './controls/Controls'
import jwt from 'jsonwebtoken'
import { useCookies } from 'react-cookie'
import { Formik, Form, Field, useField, ErrorMessage } from 'formik'
import CryptFunc from '../functions/CryptFunc'
import Constantes from '../api/Constantes'

function Copyright() {
  return (
    <Typography variant='body2' color='textSecondary' align='center'>
      {'Copyright © '}
      <Link color='inherit' href='https://financeone-ci.com'>
        Mon application tréso
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
}))

export default function LoginForm() {
  const [loader, setLoader] = useState(false)
  const [alertVisible, setAlertVisible] = useState(false)
  const [infoAlert, setinfoAlert] = useState({
    reponse: '',
    message: '',
    jeton: false,
  })

  // Cookie
  const [cookies, setCookie] = useCookies(['_Jst'])

  const schema = yup.object().shape({
    user: yup.string().required('Utilisateur obligatoire'),
    pwd: yup.string().required('Mot de passe obligatoire'),
  })

  let history = useHistory()

  // validation du formulaire
  const onSubmit = (values) => {
    setLoader(true)
    axios
      .post('user.php?type=R', values)
      .then((response) => {
        if (response.data.jeton) {
          try {
            // Renvoi un objet contenant les informations du TOKEN
            jwt.verify(response.data.jeton, Constantes.token)

            // Cryptage du jeton
            // var jetonCrypte = CryptFunc(response.data.jeton, 1)
            setCookie('_Jst', response.data.jeton, {
              path: '/',
              //httpOnly: true,
            })
            setTimeout(() => {
              setLoader(false)
              if(response.data.newConnexion == '0'){
                history.push('/accueil')
              }else{
                history.push('/accueil/definePassword')
              }
              

              // cryptage
              var MachaineCrypte = CryptFunc(response.data.droit, 1)

              // enregistrement dans local storage
              localStorage.setItem('_Drt', MachaineCrypte)
            }, 500)
          } catch (e) {
            setinfoAlert({
              reponse: 'error',
              message: 'Connexion invalide',
              jeton: false,
            })
            setLoader(false)
            setAlertVisible(true)
          }
        } else {
          setinfoAlert({
            reponse: response.data.reponse,
            message: response.data.message,
            jeton: response.data.jeton,
          })

          setLoader(false)
          setAlertVisible(true)
        }
      })
      .catch((error) => {
        console.log(error)
      })
    setTimeout(() => {
      setAlertVisible(false)
    }, 10000)
  }

  const classes = useStyles()

  return (
    <>
      {loader && <Controls.SpinnerBase />}
      {alertVisible && (
        <Controls.Alerts
          severity={infoAlert.reponse}
          message={infoAlert.message}
        />
      )}
      <Avatar className={classes.avatar}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component='h1' variant='h5'>
        Connexion
      </Typography>
      <Formik
        noValidate
        initialValues={{
          user: '',
          pwd: '',
        }}
        validationSchema={schema}
        onSubmit={(values, onSubmitProps) => {
          onSubmit(values, onSubmitProps)
        }}>
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          /* and other goodies */
        }) => (
          <Form className={classes.form}>
            <Controls.TextInput
              variant='outlined'
              margin='normal'
              fullWidth
              id='user'
              label='Utilisateur'
              name='user'
              autoFocus
              type='text'
              helperText={errors.user}
              error={errors.user && true}
            />
            <Controls.TextInput
              variant='outlined'
              margin='normal'
              fullWidth='true'
              id='pwd'
              label='Mot de passe'
              name='pwd'
              type='password'
              helperText={errors.pwd}
              error={errors.pwd && true}
            />
            <FormControlLabel
              control={<Checkbox value='remember' color='primary' />}
              label='Remember me'
            />
            <Controls.Buttons fullWidth>Connexion</Controls.Buttons>
            <Grid container>
              <Grid item>
                <NavLink to='/sendpwd' variant='body2'>
                  {'Mot de passe oublié ?'}
                </NavLink>
              </Grid>
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </Form>
        )}
      </Formik>
    </>
  )
}
