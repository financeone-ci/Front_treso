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

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(0),
  },
  buton: {
    textAlign: 'right',
  },
}))

function ProfilsForm(props) {
  const [notify, setNotify] = useState({
    type: '',
    message: '',
  })
  const [openNotif, setOpenNotif] = useState(false)
  const [typeSubmit, setTypeSubmit] = useState({ type: 0, nouveau: 0 })
  const [initialValue, setInitialValue] = useState({})
  const schema = yup.object().shape({
    libelle: yup.string().required('Champs obligatoire'),
    description: yup.string().required('Champs obligatoire'),
  })

  // fonction à exécuter si le formulaire est OK
  const onSubmitProfilForm = (values, onSubmitProps) => {
    return props.initial_.id == 0
      ? createProfilFunc(values, onSubmitProps)
      : editProfilFunc(values, onSubmitProps)
  }

  const editProfilFunc = (values, onSubmitProps) => {
    axios
      .post('Profils.php?type=U', values)
      .then((response) => {
        if (response.data.reponse == 'success') {
          try {
            setNotify({
              type: response.data.reponse,
              message: response.data.message,
            })
            if (typeSubmit.type == 1) {
              props.handleClose()
            }
            setOpenNotif(true)
            props.setTitreTableau(values.libelle)
            ////////////
            // setLoader(true)

            fetch(Constantes.URL + '/Profils.php?type=R')
              .then((response) => response.json())
              .then((data) => props.setListProfils(data.infos))
            // setLoader(false)
            /////////////
          } catch (e) {
            setNotify({
              type: response.data.reponse,
              message: response.data.message,
            })
            setOpenNotif(true)
          }
        } else {
          setNotify({
            type: 'error',
            message: ' response.data.message',
          })
          setOpenNotif(true)
        }
        onSubmitProps.setSubmitting(false)
        onSubmitProps.resetForm()
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const createProfilFunc = (values, onSubmitProps) => {
    axios
      .post('Profils.php?type=C', values)
      .then((response) => {
        if (response.data.reponse == 'success') {
          try {
            setNotify({
              type: response.data.reponse,
              message: response.data.message,
            })
            if (typeSubmit.type == 1) {
              props.handleClose()
            }
            setOpenNotif(true)
            ////////////
            // setLoader(true)

            fetch(Constantes.URL + '/Profils.php?type=R')
              .then((response) => response.json())
              .then((data) => props.setListProfils(data.infos))
            // setLoader(false)
            /////////////
          } catch (e) {
            setNotify({
              type: response.data.reponse,
              message: response.data.message,
            })
            setOpenNotif(true)
          }
        } else {
          setNotify({
            type: 'error',
            message: ' response.data.message',
          })
          setOpenNotif(true)
        }
        onSubmitProps.setSubmitting(false)
        onSubmitProps.resetForm()
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const classes = useStyles()

  return (
    <>
      <ModalForm
        title={props.titreModal || 'Nouveau profil'}
        handleClose={props.handleClose}
        open={props.open}>
        <Formik
          noValidate
          initialValues={{
            id: props.initial_.id,
            libelle: props.initial_.libelle,
            description: props.initial_.description,
          }}
          validationSchema={schema}
          onSubmit={(values, onSubmitProps) => {
            onSubmitProfilForm(values, onSubmitProps)
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
            <Form>
              <input
                id='id'
                name='id'
                type='hidden'
                value={props.initial_.id || ''}
              />

              <Controls.TextInput
                variant='outlined'
                margin='normal'
                fullWidth
                id='libelle'
                label='Libelle profil'
                autoFocus
                type='text'
                helperText={errors.libelle}
                error={errors.libelle && true}
                name='libelle'
              />
              <Controls.TextInput
                variant='outlined'
                margin='normal'
                fullWidth='true'
                id='description'
                label='description'
                name='description'
                error={errors.description && true}
                helperText={errors.description}
              />
              <div className={classes.buton}>
                <Controls.ButtonLabel
                  color='primary'
                  onClick={() => setTypeSubmit({ type: 1 })}>
                  Valider
                </Controls.ButtonLabel>
                {props.initial_.id == 0 && (
                  <Controls.ButtonLabel
                    color='secondary'
                    onClick={() => setTypeSubmit({ type: 2 })}>
                    Appliquer
                  </Controls.ButtonLabel>
                )}
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

export default ProfilsForm
