/** @format */

import React, { useState, useEffect } from 'react'
import * as yup from 'yup'
import axios from '../../api/axios'
import ModalForm from '../../composants/controls/modal/ModalForm'
import Controls from '../../composants/controls/Controls'
import { makeStyles } from '@material-ui/core'
import { Notification } from '../../composants/controls/toast/MyToast'
import Constantes from '../../api/Constantes'
import { Formik, Form, Field, useField, ErrorMessage } from 'formik'
import { Paper, Grid } from '@material-ui/core'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(0),
  },
  buton: {
    textAlign: 'right',
  },
}))

export default function MesureForm(props) {
  const classes = useStyles()
  const [notify, setNotify] = useState({
    type: '',
    message: '',
  })
  const [openNotif, setOpenNotif] = useState(false)
  // State initial champs mesures banque
  const schema = yup.object().shape({
    lglettre: yup
      .number('Numérique obligatoire')
      .required('Champs obligatoire'),
    xchiffre: yup
      .number('Numérique obligatoire')
      .required('Champs obligatoire')
      .min(0, 'la position du champ doit être >=0'),
    ychiffre: yup
      .number('Numérique obligatoire')
      .required('Champs obligatoire')
      .min(0, 'la position du champ doit être >=0'),
    xlettre1: yup
      .number('Numérique obligatoire')
      .required('Champs obligatoire')
      .min(0, 'la position du champ doit être >=0'),
    ylettre1: yup
      .number('Numérique obligatoire')
      .required('Champs obligatoire')
      .min(0, 'la position du champ doit être >=0'),
    xlettre2: yup
      .number('Numérique obligatoire')
      .required('Champs obligatoire')
      .min(0, 'la position du champ doit être >=0'),
    ylettre2: yup
      .number('Numérique obligatoire')
      .required('Champs obligatoire')
      .min(0, 'la position du champ doit être >=0'),
    xbenef: yup
      .number('Numérique obligatoire')
      .required('Champs obligatoire')
      .min(0, 'la position du champ doit être >=0'),
    ybenef: yup
      .number('Numérique obligatoire')
      .required('Champs obligatoire')
      .min(0, 'la position du champ doit être >=0'),
    xville: yup
      .number('Numérique obligatoire')
      .required('Champs obligatoire')
      .min(0, 'la position du champ doit être >=0'),
    yville: yup
      .number('Numérique obligatoire')
      .required('Champs obligatoire')
      .min(0, 'la position du champ doit être >=0'),
    xdate: yup
      .number('Numérique obligatoire')
      .required('Champs obligatoire')
      .min(0, 'la position du champ doit être >=0'),
    ydate: yup
      .number('Numérique obligatoire')
      .required('Champs obligatoire')
      .min(0, 'la position du champ doit être >=0'),
    xdate1: yup
      .number('Numérique obligatoire')
      .required('Champs obligatoire')
      .min(0, 'la position du champ doit être >=0'),
    ydate1: yup
      .number('Numérique obligatoire')
      .required('Champs obligatoire')
      .min(0, 'la position du champ doit être >=0'),
    xdate2: yup
      .number('Numérique obligatoire')
      .required('Champs obligatoire')
      .min(0, 'la position du champ doit être >=0'),
    ydate2: yup
      .number('Numérique obligatoire')
      .required('Champs obligatoire')
      .min(0, 'la position du champ doit être >=0'),
    xdatecp: yup
      .number('Numérique obligatoire')
      .required('Champs obligatoire')
      .min(0, 'la position du champ doit être >=0'),
    ydatecp: yup
      .number('Numérique obligatoire')
      .required('Champs obligatoire')
      .min(0, 'la position du champ doit être >=0'),
    xbenefcp: yup
      .number('Numérique obligatoire')
      .required('Champs obligatoire')
      .min(0, 'la position du champ doit être >=0'),
    ybenefcp: yup
      .number('Numérique obligatoire')
      .required('Champs obligatoire')
      .min(0, 'la position du champ doit être >=0'),
    xchiffrecp: yup
      .number('Numérique obligatoire')
      .required('Champs obligatoire')
      .min(0, 'la position du champ doit être >=0'),
    ychiffrecp: yup
      .number('Numérique obligatoire')
      .required('Champs obligatoire')
      .min(0, 'la position du champ doit être >=0'),
    xmotif: yup
      .number('Numérique obligatoire')
      .required('Champs obligatoire')
      .min(0, 'la position du champ doit être >=0'),
    ymotif: yup
      .number('Numérique obligatoire')
      .required('Champs obligatoire')
      .min(0, 'la position du champ doit être >=0'),
  })

  // Mise à jour des mesures de la banque
  const editMesureFunc = (values, onSubmitProps) => {
    console.log(values)
    axios
      .post('Mesures.php?type=U', values)
      .then((response) => {
        if (response.data.reponse == 'success') {
          setNotify({
            type: response.data.reponse,
            message: response.data.message,
          })
          props.handleClose()
          setOpenNotif(true)
        } else {
          setNotify({
            type: 'error',
            message: response.data.message,
          })
          setOpenNotif(true)
        }
        onSubmitProps.setSubmitting(false)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <>
      <ModalForm
        title={props.titreModal}
        handleClose={props.handleClose}
        open={props.open}>
        <Formik
          noValidate
          initialValues={props.initMesure}
          validationSchema={schema}
          onSubmit={(values, onSubmitProps) => {
            editMesureFunc(values, onSubmitProps)
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
              <input
                id='id'
                name='id'
                type='hidden'
                value={props.initMesure.id || ''}
              />
              <Grid container spacing={2}>
                <Grid item xs={6} sm={6} lg={6}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='lglettre'
                    label='Lg. lettre'
                    autoFocus
                    type='number'
                    thelperText={errors.lglettre}
                    terror={errors.lglettre && true}
                    name='lglettre'
                  />
                </Grid>
                <Grid item xs={6} sm={6} lg={6}>
                  {props.initMesure.deux_date == 0 ? (
                    <Controls.Check
                      checked={false}
                      label='Deux champs de date'
                      name='deux_date'
                      onChange={(e, value) => {
                        setFieldValue('deux_date', 1)
                      }}
                    />
                  ) : (
                    <Controls.Check
                      checked={false}
                      label='Deux champs de date'
                      name='deux_date'
                      onChange={(e, value) => {
                        setFieldValue('deux_date', 0)
                      }}
                    />
                  )}
                </Grid>
                <Grid item xs={12} sm={12} lg={12}>
                  <Typography gutterBottom variant='body1'>
                    Positions chèque
                  </Typography>
                  <Divider variant='middle' />
                </Grid>
                <Grid item xs={6} sm={4} lg={3}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='xchiffre'
                    label='X. MtChiffre'
                    autoFocus
                    type='number'
                    step='0.01'
                    thelperText={errors.xmchiffre}
                    terror={errors.xmchiffre && true}
                    name='xchiffre'
                  />
                </Grid>
                <Grid item xs={6} sm={4} lg={3}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='ychiffre'
                    label='Y. MtChiffre'
                    autoFocus
                    type='number'
                    thelperText={errors.ychiffre}
                    terror={errors.ychiffre && true}
                    name='ychiffre'
                  />
                </Grid>
                <Grid item xs={6} sm={4} lg={3}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='xlettre1'
                    label='X. MtLettre 1'
                    autoFocus
                    type='number'
                    thelperText={errors.xlettre1}
                    terror={errors.xlettre1 && true}
                    name='xlettre1'
                  />
                </Grid>
                <Grid item xs={6} sm={4} lg={3}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='ylettre1'
                    label='Y. MtLettre 1'
                    autoFocus
                    type='number'
                    thelperText={errors.ylettre1}
                    terror={errors.ylettre1 && true}
                    name='ylettre1'
                  />
                </Grid>
                <Grid item xs={6} sm={4} lg={3}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='xlettre2'
                    label='X. MtLettre 2'
                    autoFocus
                    type='number'
                    thelperText={errors.xlettre2}
                    terror={errors.xlettre2 && true}
                    name='xlettre2'
                  />
                </Grid>
                <Grid item xs={6} sm={4} lg={3}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='ylettre2'
                    label='Y. MtLettre 2'
                    autoFocus
                    type='number'
                    thelperText={errors.ylettre2}
                    terror={errors.ylettre2 && true}
                    name='ylettre2'
                  />
                </Grid>
                <Grid item xs={6} sm={4} lg={3}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='xbenef'
                    label='X. Bénéficiaire'
                    autoFocus
                    type='number'
                    thelperText={errors.xbenef}
                    terror={errors.xbenef && true}
                    name='xbenef'
                  />
                </Grid>
                <Grid item xs={6} sm={4} lg={3}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='ybenef'
                    label='Y. Bénéficiaire'
                    autoFocus
                    type='number'
                    thelperText={errors.ybenef}
                    terror={errors.ybenef && true}
                    name='ybenef'
                  />
                </Grid>
                <Grid item xs={6} sm={4} lg={3}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='xville'
                    label='X. Ville'
                    autoFocus
                    type='number'
                    thelperText={errors.xville}
                    terror={errors.xville && true}
                    name='xville'
                  />
                </Grid>
                <Grid item xs={6} sm={4} lg={3}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='yville'
                    label='Y. Ville'
                    autoFocus
                    type='number'
                    thelperText={errors.yville}
                    terror={errors.yville && true}
                    name='yville'
                  />
                </Grid>
                <Grid item xs={6} sm={4} lg={3}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='xdate'
                    label='X. Date'
                    autoFocus
                    type='number'
                    thelperText={errors.xdate}
                    terror={errors.xdate && true}
                    name='xdate'
                  />
                </Grid>
                <Grid item xs={6} sm={4} lg={3}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='ydate'
                    label='Y. Date'
                    autoFocus
                    type='number'
                    thelperText={errors.ydate}
                    terror={errors.ydate && true}
                    name='ydate'
                  />
                </Grid>
                <Grid item xs={12} sm={12} lg={12}>
                  <Typography gutterBottom variant='body1'>
                    Positions coupon
                  </Typography>
                  <Divider variant='middle' />
                </Grid>
                <Grid item xs={6} sm={4} lg={3}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='xdatecp'
                    label='X. Date'
                    autoFocus
                    type='number'
                    thelperText={errors.xdatecp}
                    terror={errors.xdatecp && true}
                    name='xdatecp'
                  />
                </Grid>
                <Grid item xs={6} sm={4} lg={3}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='ydatecp'
                    label='Y. Date'
                    autoFocus
                    type='number'
                    thelperText={errors.ydatecp}
                    terror={errors.ydatecp && true}
                    name='ydatecp'
                  />
                </Grid>
                <Grid item xs={6} sm={4} lg={3}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='xbenefcp'
                    label='X. Béneficiaire'
                    autoFocus
                    type='number'
                    thelperText={errors.xbenefcp}
                    terror={errors.xbenefcp && true}
                    name='xbenefcp'
                  />
                </Grid>
                <Grid item xs={6} sm={4} lg={3}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='ybenefcp'
                    label='Y. Béneficiaire'
                    autoFocus
                    type='number'
                    thelperText={errors.ybenefcp}
                    terror={errors.ybenefcp && true}
                    name='ybenefcp'
                  />
                </Grid>
                <Grid item xs={6} sm={4} lg={3}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='xchiffrecp'
                    label='X. Chiffre'
                    autoFocus
                    type='number'
                    thelperText={errors.xchiffrecp}
                    terror={errors.xchiffrecp && true}
                    name='xchiffrecp'
                  />
                </Grid>
                <Grid item xs={6} sm={4} lg={3}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='ychiffrecp'
                    label='Y. Chiffre'
                    autoFocus
                    type='number'
                    thelperText={errors.ychiffrecp}
                    terror={errors.ychiffrecp && true}
                    name='ychiffrecp'
                  />
                </Grid>
                <Grid item xs={6} sm={4} lg={3}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='xmotif'
                    label='X. Motif'
                    autoFocus
                    type='number'
                    thelperText={errors.xmotif}
                    terror={errors.xmotif && true}
                    name='xmotif'
                  />
                </Grid>
                <Grid item xs={6} sm={4} lg={3}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='ymotif'
                    label='Y. Motif'
                    autoFocus
                    type='number'
                    thelperText={errors.ymotif}
                    terror={errors.ymotif && true}
                    name='ymotif'
                  />
                </Grid>
                <Grid item xs={6} sm={4} lg={3}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='xdate1'
                    label='X. Date 1'
                    autoFocus
                    type='number'
                    thelperText={errors.xdate1}
                    terror={errors.xdate1 && true}
                    name='xdate1'
                  />
                </Grid>
                <Grid item xs={6} sm={4} lg={3}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='ydate1'
                    label='Y. Date 1'
                    autoFocus
                    type='number'
                    thelperText={errors.ydate1}
                    terror={errors.ydate1 && true}
                    name='ydate1'
                  />
                </Grid>
                <Grid item xs={6} sm={4} lg={3}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='xdate2'
                    label='X. Date 2'
                    autoFocus
                    type='number'
                    thelperText={errors.xdate2}
                    terror={errors.xdate2 && true}
                    name='xdate2'
                  />
                </Grid>
                <Grid item xs={6} sm={4} lg={3}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='ydate2'
                    label='Y. Date 2'
                    autoFocus
                    type='number'
                    thelperText={errors.ydate2}
                    terror={errors.ydate2 && true}
                    name='ydate2'
                  />
                </Grid>
              </Grid>
              <div className={classes.buton}>
                <Controls.ButtonLabel color='primary'>
                  Valider
                </Controls.ButtonLabel>
              </div>
            </Form>
          )}
        </Formik>
      </ModalForm>
      <Notification
        type={notify.type}
        message={notify.message}
        open={openNotif}
        setOpen={setOpenNotif}
      />
    </>
  )
}
