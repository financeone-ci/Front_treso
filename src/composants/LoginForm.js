/** @format */

import React, { useState } from 'react'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
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
import { Notification } from '../composants/controls/toast/MyToast'
import { useCookies } from 'react-cookie'
import { Formik, Form, Field, useField, ErrorMessage } from 'formik'
import CryptFunc from '../functions/CryptFunc'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import Backdrop from '@material-ui/core/Backdrop'
import CircularProgress from '@material-ui/core/CircularProgress'

function Copyright() {
  return (
    <Typography variant='body2' color='textSecondary' align='center'>
      {'Copyright © '}
      <Link color='inherit' href='https://financeone-ci.com'>
        FinanceOne-ci
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
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}))

export default function LoginForm() {
  const [notify, setNotify] = useState({
    type: '',
    message: '',
  })
  const [openNotif, setOpenNotif] = useState(false)
  const [open, setOpen] = React.useState(false)
  const handleClose = () => {
    setOpen(false)
  }
  const handleToggle = () => {
    setOpen(!open)
  }
  // Cookie
  const [cookies, setCookie] = useCookies(['_Jst'])

  const schema = yup.object().shape({
    user: yup.string().required('Utilisateur obligatoire'),
    pwd: yup.string().required('Mot de passe obligatoire'),
  })

  let history = useHistory()

  // validation du formulaire
  const onSubmit = async (values) => {
    let response = await axios.post('login/Connexion.php', { values })
    return response.data
  }

  const userCnx = useMutation(onSubmit, {
    onSuccess: (data) => {
      // Cryptage du jeton
      setCookie('_Jst', data.jeton, {
        path: '/',
        //httpOnly: true,
      })

      if (data.reponse === 'success') {
        // Redirection
        if (data.jeton && data.newConnexion === '0') {
          history.push('/accueil')
        } else {
          history.push('/accueil/definePassword')
        }
      } else {
        setNotify({ message: data.message, type: data.reponse })
        setOpenNotif(true)
      }
      // cryptage
      var MachaineCrypte = CryptFunc(data.droit, 1)
      // enregistrement dans local storage
      localStorage.setItem('_Drt', MachaineCrypte)
    },
    onError: () => {
      setNotify({ message: 'Connexion impossible', type: 'error' })
      setOpenNotif(true)
    },
    onMutate: () => {
      handleToggle()
    },
  })

  const classes = useStyles()

  return (
    <>
      {userCnx.isLoading && (
        <Backdrop
          className={classes.backdrop}
          open={open}
          onClick={handleClose}>
          <CircularProgress color='inherit' />
        </Backdrop>
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
        onSubmit={(values) => {
          userCnx.mutate(values)
        }}>
        {({ errors }) => (
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
            <Button
              type='submit'
              fullWidth
              variant='contained'
              color='primary'
              className={classes.submit}
              disabled={userCnx.isLoading}>
              Sign In
            </Button>
            {/* <Controls.Buttons fullWidth>Connexion</Controls.Buttons> */}
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
      <Notification
        type={notify.type}
        message={notify.message}
        open={openNotif}
        setOpen={setOpenNotif}
      />
    </>
  )
}
