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
import { Grid } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(0),
  },
  buton: {
    textAlign: 'right',
  },
}))

function SecuriteForm(props) {
  const [notify, setNotify] = useState({
    type: '',
    message: '',
  })
  const [openNotif, setOpenNotif] = useState(false)
  const schema = yup.object().shape({
    securite_taille: yup
      .number('Numérique obligatoire')
      .required('Champs obligatoire')
      .positive('Nombre positif obligatoire')
      .integer('Nombre entier obligatoire')
      .min(8, 'Ta taille du mot de passe doit être >= 8'),
    securite_majuscule: yup.number().required('Champs obligatoire'),
    securite_carc_speciaux: yup.number().required('Champs obligatoire'),
    securite_chiffres: yup.number().required('Champs obligatoire'),
    securite_duree_pwd: yup
      .number('Numérique obligatoire')
      .required('Champs obligatoire')
      .positive('Nombre positif obligatoire')
      .integer('Nombre entier obligatoire')
      .min(0, 'La durée du mot de passe doit être >= 0'),
  })

  // fonction à exécuter si le formulaire est OK
  const onSubmitSecureForm = (values, onSubmitProps) => {
    return editSecuriteFunc(values, onSubmitProps)
  }

  const editSecuriteFunc = (values, onSubmitProps) => {
    axios
      .post('securite.php?type=U', values)
      .then((response) => {
        if (response.data.reponse == 'success') {
          setNotify({
            type: response.data.reponse,
            message: response.data.message,
          })
          props.handleClose()
          setOpenNotif(true)

          fetch(Constantes.URL + '/securite.php?type=R')
            .then((response) => response.json())
            .then((data) => props.setListSecurite(data.infos))
        } else {
          setNotify({
            type: 'error',
            message: ' response.data.message',
          })
          setOpenNotif(true)
        }
        onSubmitProps.setSubmitting(false)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const classes = useStyles()

  return (
    <>
      <ModalForm
        title={props.titreModal || 'Paramétrage sécurité'}
        handleClose={props.handleClose}
        open={props.open}>
        <Formik
          noValidate
          initialValues={{
            id: props.initial_.id,
            securite_taille: props.initial_.securite_taille,
            securite_majuscule: props.initial_.securite_majuscule,
            securite_carc_speciaux: props.initial_.securite_carc_speciaux,
            securite_chiffres: props.initial_.securite_chiffres,
            securite_duree_pwd: props.initial_.securite_duree_pwd,
            valider: props.initial_.valider,
            autoriser: props.initial_.autoriser,
            approuver: props.initial_.approuver,
          }}
          validationSchema={schema}
          onSubmit={(values, onSubmitProps) => {
            onSubmitSecureForm(values, onSubmitProps)
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
            /* and other goodies */
          }) => (
            <Form>
              <input
                id='id'
                name='id'
                type='hidden'
                value={props.initial_.id || ''}
              />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} lg={6}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='securite_taille'
                    label='Taille mot de passe'
                    autoFocus
                    type='number'
                    helperText={errors.securite_taille}
                    error={errors.securite_taille && true}
                    name='securite_taille'
                  />
                </Grid>
                <Grid item xs={12} sm={6} lg={6}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='duree'
                    label='durée mot de passe (jours)'
                    autoFocus
                    type='number'
                    helperText={errors.securite_duree_pwd}
                    error={errors.securite_duree_pwd && true}
                    name='securite_duree_pwd'
                  />
                </Grid>
                <Grid item xs={12} sm={4} lg={4}>
                  {values.securite_majuscule == 0 ? (
                    <Controls.SwitchIos
                      checked={{
                        checkedB: false,
                      }}
                      data={{ id: 1, column: 1, value: 1 }}
                      label='Majuscule'
                      edit={() => {
                        setFieldValue('securite_majuscule', 1)
                      }}
                    />
                  ) : (
                    <Controls.SwitchIos
                      checked={{
                        checkedB: true,
                      }}
                      data={{ id: 1, column: 1, value: 1 }}
                      label='Majuscule'
                      edit={() => {
                        setFieldValue('securite_majuscule', 0)
                      }}
                    />
                  )}
                </Grid>
                <Grid item xs={12} sm={4} lg={4}>
                  {values.securite_chiffres == 0 ? (
                    <Controls.SwitchIos
                      checked={{
                        checkedB: false,
                      }}
                      data={{ id: 1, column: 1, value: 1 }}
                      label='Chiffres'
                      edit={() => {
                        setFieldValue('securite_chiffres', 1)
                      }}
                    />
                  ) : (
                    <Controls.SwitchIos
                      checked={{
                        checkedB: true,
                      }}
                      data={{ id: 1, column: 1, value: 1 }}
                      label='Chiffres'
                      edit={() => {
                        setFieldValue('securite_chiffres', 0)
                      }}
                    />
                  )}
                </Grid>
                <Grid item xs={12} sm={4} lg={4}>
                  {values.securite_carc_speciaux == 0 ? (
                    <Controls.SwitchIos
                      checked={{
                        checkedB: false,
                      }}
                      data={{ id: 1, column: 1, value: 1 }}
                      label='Carac. spéciaux'
                      edit={() => {
                        setFieldValue('securite_carc_speciaux', 1)
                      }}
                    />
                  ) : (
                    <Controls.SwitchIos
                      checked={{
                        checkedB: true,
                      }}
                      data={{ id: 1, column: 1, value: 1 }}
                      label='Carac. spéciaux'
                      edit={() => {
                        setFieldValue('securite_carc_speciaux', 0)
                      }}
                    />
                  )}
                </Grid>
                <Grid item xs={12} sm={4} lg={4}>
                  {values.valider == 0 ? (
                    <Controls.SwitchIos
                      checked={{
                        checkedB: false,
                      }}
                      data={{ id: 1, column: 1, value: 1 }}
                      label='Valider'
                      edit={() => {
                        setFieldValue('valider', 1)
                      }}
                    />
                  ) : (
                    <Controls.SwitchIos
                      checked={{
                        checkedB: true,
                      }}
                      data={{ id: 1, column: 1, value: 1 }}
                      label='Valider'
                      edit={() => {
                        setFieldValue('valider', 0)
                      }}
                    />
                  )}
                </Grid>
                <Grid item xs={12} sm={4} lg={4}>
                  {values.autoriser == 0 ? (
                    <Controls.SwitchIos
                      checked={{
                        checkedB: false,
                      }}
                      data={{ id: 1, column: 1, value: 1 }}
                      label='Autoriser'
                      edit={() => {
                        setFieldValue('autoriser', 1)
                      }}
                    />
                  ) : (
                    <Controls.SwitchIos
                      checked={{
                        checkedB: true,
                      }}
                      data={{ id: 1, column: 1, value: 1 }}
                      label='Autoriser'
                      edit={() => {
                        setFieldValue('autoriser', 0)
                      }}
                    />
                  )}
                </Grid>
                <Grid item xs={12} sm={4} lg={4}>
                  {values.approuver == 0 ? (
                    <Controls.SwitchIos
                      checked={{
                        checkedB: false,
                      }}
                      data={{ id: 1, column: 1, value: 1 }}
                      label='Approuver'
                      edit={() => {
                        setFieldValue('approuver', 1)
                      }}
                    />
                  ) : (
                    <Controls.SwitchIos
                      checked={{
                        checkedB: true,
                      }}
                      data={{ id: 1, column: 1, value: 1 }}
                      label='Approuver'
                      edit={() => {
                        setFieldValue('approuver', 0)
                      }}
                    />
                  )}
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

export default SecuriteForm
