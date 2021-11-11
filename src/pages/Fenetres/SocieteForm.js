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
  const [notify, setNotify] = useState({
    type: '',
    message: '',
  })
  const [defaut, setDefaut] = useState({})
  const [openNotif, setOpenNotif] = useState(false)
  const [typeSubmit, setTypeSubmit] = useState({ type: 0, nouveau: 0 })
 

  const schema = yup.object().shape({
    email: yup.string().email('Email invalide'),
    code: yup.string().required('Champs obligatoire'),
    libelle: yup.string(),
    complement: yup.string() ,
    contact: yup.string() ,
    siege: yup.string(),

  })

  // fonction à exécuter si le formulaire est OK
  const onSubmitProfilForm = (values, onSubmitProps) => {
    return props.initial_.id == 0
      ? createProfilFunc(values, onSubmitProps)
      : editProfilFunc(values, onSubmitProps)
  }

  const editProfilFunc = (values, onSubmitProps) => {
    axios
      .post('societe.php?type=U', values) //

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

            ////////////
            // setLoader(true)

            fetch(Constantes.URL + '/societe.php?type=R&read_all')
              .then((response) => response.json())
              .then((data) => props.setListUsers(data.infos))
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
    console.log(values)
    axios
      .post('societe.php?type=C&jeton='+props.infoCookie, values) 
      .then((response) => {
       //console.log(response.data)
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

            fetch(Constantes.URL + '/societe.php?type=R&read_all')
              .then((response) => response.json())
              .then((data) => props.setListUsers(data.infos))
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
            message: response.data.message,
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
            complement: props.initial_.complement,
            email: props.initial_.email,
            siege: props.initial_.siege,
            adresse: props.initial_.adresse,
            contact: props.initial_.tel,
           
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
                    label='Code société'
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
                    label='Libellé société'
                    
                    type='text'
                    thelperText={errors.libelle}
                    terror={errors.libelle && true}
                    name='libelle'
                  />
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='complement'
                    label='Complément société'
                    
                    type='text'
                    thelperText={errors.complement}
                    terror={errors.complement && true}
                    name='complement'
                  />
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='contact'
                    label='Contact société'
                    
                    type='text'
                    thelperText={errors.contact}
                    terror={errors.contact && true}
                    name='contact'
                  />
                 
                </Grid>
                <Grid item xs={6} sm={6} lg={6}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='email'
                    label='Adresse mail'
                    type='email'
                    thelperText={errors.email}
                    terror={errors.email && true}
                    name='email'
                  /> 
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='siege'
                    label='Siege'
                    type='text'
                    thelperText={errors.siege}
                    terror={errors.siege && true}
                    name='siege'
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
