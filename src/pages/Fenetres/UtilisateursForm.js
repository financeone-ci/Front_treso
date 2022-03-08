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
  const [listProfils, setListProfils] = useState([])
  useEffect(() => {
    fetch(Constantes.URL + '/Profils.php?type=R')
      .then((response) => response.json())
      .then((data) => setListProfils(data.infos))
  }, [])

  const schema = yup.object().shape({
    email: yup.string().email('Email invalide').required('Champs obligatoire'),
    login: yup.string().required('Champs obligatoire'),
    role: yup.string().required('Champs obligatoire'),
    nom: yup.string().nullable().required('Champs obligatoire'),
    prenom: yup.string().nullable().required('Champs obligatoire'),
    profil: yup.string().required('Champs obligatoire'),
    actif: yup.string().required('Champs obligatoire'),
  })

  // fonction à exécuter si le formulaire est OK
  const onSubmitProfilForm = (values, onSubmitProps) => {
    return props.initial_.id == 0
      ? createProfilFunc(values, onSubmitProps)
      : editProfilFunc(values, onSubmitProps)
  }

  const editProfilFunc = (values, onSubmitProps) => {
    axios
      .post('user.php?type=U', values) //

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

            fetch(Constantes.URL + '/user.php?type=R&read_all')
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
      .post('user.php?type=C&jeton=' + props.infoCookie, values)
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

            fetch(Constantes.URL + '/user.php?type=R&read_all')
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

  useEffect(() => {
    if (props.initial_.id != 0) {
      listProfils.map((x) => {
        if (x.id == props.initial_.idprofil) {
          //console.log(x)
          setDefaut(x)
        }
      }, [])
    } else setDefaut(null)
  })

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
            email: props.initial_.email,
            login: props.initial_.login,
            profil: props.initial_.idprofil,
            role: props.initial_.role,
            tel: props.initial_.tel,
            nom: props.initial_.nom,
            prenom: props.initial_.prenom,
            actif: props.initial_.actif,
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
                    id='nom'
                    label='Nom'
                    autoFocus
                    type='text'
                    thelperText={errors.nom}
                    terror={errors.nom && true}
                    name='nom'
                  />
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='prenom'
                    label='Prénoms'
                    type='text'
                    thelperText={errors.prenom}
                    terror={errors.prenom && true}
                    name='prenom'
                  />
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='login'
                    label='Login'
                    type='text'
                    thelperText={errors.login}
                    terror={errors.login && true}
                    name='login'
                  />
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='email'
                    label='Email'
                    type='email'
                    thelperText={errors.email}
                    terror={errors.email && true}
                    name='email'
                  />
                </Grid>
                <Grid item xs={6} sm={6} lg={6}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='role'
                    label='Role'
                    type='text'
                    thelperText={errors.role}
                    terror={errors.role && true}
                    name='role'
                  />

                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='tel'
                    label='Contact'
                    type='text'
                    thelperText={errors.tel}
                    terror={errors.tel && true}
                    name='tel'
                  />

                  <div
                    className='MuiInputBase-root MuiOutlinedInput-root MuiInputBase-fullWidth MuiInputBase-formControl MuiInputBase-marginDense MuiOutlinedInput-marginDense'
                    style={{
                      marginTop: '19px',
                      marginBottom: '16px',
                      paddingLeft: '12px',
                    }}>
                    {'  '}
                    <span style={{ marginLeft: '12px' }}>
                      {values.actif == 0 ? (
                        <Controls.SwitchIos
                          checked={{
                            checkedB: true,
                          }}
                          data={{ id: 1, column: 1, value: 1 }}
                          fonctionOK={fonctionOK}
                          edit={() => {
                            setFieldValue('actif', 1)
                          }}
                        />
                      ) : (
                        <Controls.SwitchIos
                          checked={{
                            checkedB: false,
                          }}
                          data={{ id: 1, column: 1, value: 1 }}
                          fonctionOK={fonctionOK}
                          edit={() => {
                            setFieldValue('actif', 0)
                          }}
                        />
                      )}
                    </span>{' '}
                    Actif
                  </div>

                  <Controls.ComboSingle
                    name='profil'
                    data={listProfils}
                    defaut={defaut}
                    onChange={(e, value) => {
                      setFieldValue('profil', value !== null ? value.id : value)
                    }}
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
