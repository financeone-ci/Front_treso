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
import { useSelector } from 'react-redux'

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(0),
  },
  buton: {
    textAlign: 'right',
  },
}))

function UtilisateursForm(props) {
  ////////////////// redux
  const myCookie = useSelector((state) => state.cookie)

  const [notify, setNotify] = useState({
    type: '',
    message: '',
  })
  const [defaut, setDefaut] = useState({})
  const [openNotif, setOpenNotif] = useState(false)
  const [typeSubmit, setTypeSubmit] = useState({ type: 0, nouveau: 0 })

  const schema = yup.object().shape({
    code: yup.string().required('Champs obligatoire'),
    libelle: yup.string(),
    directeur: yup.string(),
  })

  // fonction à exécuter si le formulaire est OK
  const onSubmitBankForm = (values, onSubmitProps) => {
    return props.initial_.id == 0
      ? createBankFunc(values, onSubmitProps)
      : editBankFunc(values, onSubmitProps)
  }

  const editBankFunc = (values, onSubmitProps) => {
    axios
      .post('banque.php?type=U&jeton=' + props.infoCookie, values) //

      .then((response) => {
        //console.log(response)
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
            fetch(Constantes.URL + '/banque.php?type=R&read_all')
              .then((response) => response.json())
              .then((data) => props.setListBanqs(data.infos))
            onSubmitProps.resetForm()
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
      })
      .catch((error) => {
        console.log(error)
      })
  }

  // Création de la banque
  const createBankFunc = (values, onSubmitProps) => {
    axios
      .post('banque.php?type=C&jeton=' + props.infoCookie, values)
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
            fetch(Constantes.URL + '/banque.php?type=R&read_all')
              .then((response) => response.json())
              .then((data) => props.setListBanqs(data.infos))
            onSubmitProps.resetForm()
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

  const classes = useStyles()

  const fonctionOK = () => {}
  return (
    <>
      <ModalForm
        title={props.titreModal}
        handleClose={props.handleClose}
        open={props.open}>
        <Formik
          noValidate
          initialValues={{
            id: props.initial_.id,
            code: props.initial_.code,
            libelle: props.initial_.libelle,
            directeur: props.initial_.dg,
            gestionnaire: props.initial_.gestionnaire,
            adresse_web: props.initial_.adresse_web,
            adresse: props.initial_.adresse,
            contact: props.initial_.contact,
          }}
          validationSchema={schema}
          onSubmit={(values, onSubmitProps) => {
            onSubmitBankForm(values, onSubmitProps)
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
                value={props.initial_.id || ''}
              />
              <Grid container spacing={2}>
                <Grid item xs={6} sm={6} lg={6}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='code'
                    label='Code banque'
                    autoFocus
                    type='text'
                    thelperText={errors.code}
                    terror={errors.code && true}
                    name='code'
                  />
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='libelle'
                    label='Libellé banque'
                    type='text'
                    thelperText={errors.libelle}
                    terror={errors.libelle && true}
                    name='libelle'
                  />
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='directeur'
                    label='Directeur banque'
                    type='text'
                    thelperText={errors.directeur}
                    terror={errors.directeur && true}
                    name='directeur'
                  />

                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='gestionnaire'
                    label='Gestionnaire banque'
                    type='text'
                    thelperText={errors.gestionnaire}
                    terror={errors.gestionnaire && true}
                    name='gestionnaire'
                  />
                </Grid>
                <Grid item xs={6} sm={6} lg={6}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='contact'
                    label='Contact banque'
                    type='text'
                    thelperText={errors.contact}
                    terror={errors.contact && true}
                    name='contact'
                  />
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='adresse_web'
                    label='Adresse web'
                    type='url'
                    thelperText={errors.adresse_web}
                    terror={errors.adresse_web && true}
                    name='adresse_web'
                  />

                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='adresse'
                    label='Adresse'
                    type='text'
                    thelperText={errors.adresse}
                    terror={errors.adresse && true}
                    name='adresse'
                  />
                </Grid>{' '}
              </Grid>

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

export default UtilisateursForm
