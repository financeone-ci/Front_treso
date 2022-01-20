/** @format */

import React, { useState } from 'react'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Controls from '../composants/controls/Controls'
import EmailIcon from '@material-ui/icons/Email'
import Box from '@material-ui/core/Box'
import { makeStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'
import TextInput from './controls/TextInput'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { NavLink } from 'react-router-dom'
import { Formik, Form, Field, useField, ErrorMessage } from 'formik'
import axios from '../api/axios'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Notification } from '../composants/controls/toast/MyToast'

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
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

export default function PwdForgot() {
  const [initialFormValues, setInitialFormValues] = useState({ mail: '' })
  // notification
  const [notify, setNotify] = useState({
    type: '',
    message: '',
  })

  const [openNotif, setOpenNotif] = useState(false)

  const schema = yup.object().shape({
    mail: yup
      .string()
      .email('Adresse mail incorrecte')
      .required('Adresse mail obligatoire'),
  })

  // Envoi de l'adresse mail
  const submitMail = async (values) => {
    let response = await axios.post('login/envoiMailPwd.php', { values })
    return response.data
  }

  const sendMail = useMutation(submitMail, {
    onSuccess: (data) => {
      setNotify({ message: data.message, type: data.reponse })
      setOpenNotif(true)
    },
    onError: () => {
      setNotify({ message: 'Connexion impossible', type: 'error' })
      setOpenNotif(true)
      console.error(sendMail.error)
    },
  })

  const classes = useStyles()

  return (
    <>
      {sendMail.isLoading && <Controls.SpinnerBase />}
      <Avatar className={classes.avatar}>
        <EmailIcon />
      </Avatar>
      <Typography component='h1' variant='h5'>
        Mot de passe oublié
      </Typography>
      <Formik
        noValidate
        initialValues={initialFormValues}
        validationSchema={schema}
        onSubmit={(values, onSubmitProps) => {
          sendMail.mutate(values)
        }}>
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          setFieldValue,
        }) => (
          <Form>
            <Controls.TextInput
              variant='outlined'
              margin='normal'
              fullWidth
              id='mail'
              label='E-mail'
              name='mail'
              autoFocus
              type='text'
              helperText={errors.mail}
              error={errors.mail && true}
            />
            <Button
              type='submit'
              fullWidth
              variant='contained'
              color='primary'
              disabled={sendMail.isLoading}
              className={classes.submit}>
              Valider
            </Button>
            <Grid container>
              <Grid item>
                <NavLink to='/' variant='body2'>
                  {'Connexion'}
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
