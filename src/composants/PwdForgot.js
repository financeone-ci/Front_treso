/** @format */

import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Box from '@material-ui/core/Box'
import { makeStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'
import TextInput from './controls/TextInput'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { NavLink } from 'react-router-dom'
import { Formik, Form, Field, useField, ErrorMessage } from 'formik'


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
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

export default function PwdForgot() {
  const schema = yup.object().shape({
    email: yup.string().required('Adresse mail obligatoire'),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })
  //   const { estSubmit } = formState

  const onSubmit = (data) => {
    console.log(data)
  }
  const classes = useStyles()

  return (
    <>
      <Avatar className={classes.avatar}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component='h1' variant='h5'>
        Sign in
      </Typography>
      <Formik
          noValidate
          initialValues={{
            
          }}
          validationSchema={schema}
          onSubmit={(values, onSubmitProps) => {
           // onSubmitProfilForm(values, onSubmitProps)
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
        <TextInput
          variant='outlined'
          margin='normal'
          fullWidth
          id='email'
          label='Adresse mail'
          {...register('email')}
          autoFocus
          type='email'
          helperText={errors.email?.message}
          error={errors.email && true}
        />
        <Button
          type='submit'
          fullWidth
          variant='contained'
          color='primary'
          className={classes.submit}>
          Sign In
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
    </>
  )
}
