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

function CompteForm(props) {
  const [notify, setNotify] = useState({
    type: '',
    message: '',
  })
  const [defaut, setDefaut] = useState({})
  const [defautSociete, setDefautSociete] = useState({})
  const [defautDevise, setDefautDevise] = useState({})
  const [openNotif, setOpenNotif] = useState(false)
  const [typeSubmit, setTypeSubmit] = useState({ type: 0, nouveau: 0 })
  const [listBank, setListBank] = useState([])
  const [listDevise, setListDevise] = useState([])
  const [listSociete, setListSociete] = useState([])
  useEffect(() => {
    fetch(Constantes.URL + '/banque.php?type=R')
      .then((response) => response.json())
      .then((data) => setListBank(data.infos))
  }, [])
  useEffect(() => {
    fetch(Constantes.URL + '/devise.php?type=R')
      .then((response) => response.json())
      .then((data) => setListDevise(data.infos))
  }, [])
  useEffect(() => {
    fetch(Constantes.URL + '/societe.php?type=R')
      .then((response) => response.json())
      .then((data) => setListSociete(data.infos))
  }, [])
  const schema = yup.object().shape({
    email: yup.string().email('Email invalide'),
    code: yup.string().required('Champs obligatoire'),

    banque: yup.string().required('Champs obligatoire'),
    societe: yup.string().required('Champs obligatoire'),
    devise: yup.string().required('Champs obligatoire'),
  })

  // fonction à exécuter si le formulaire est OK
  const onSubmitProfilForm = (values, onSubmitProps) => {
    return props.initial_.id == 0
      ? createProfilFunc(values, onSubmitProps)
      : editProfilFunc(values, onSubmitProps)
  }

  const editProfilFunc = (values, onSubmitProps) => {
    axios
      .post('compte.php?type=U&jeton=' + props.infoCookie, values) //

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

            fetch(Constantes.URL + '/compte.php?type=R&read_all')
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

  const createProfilFunc = (values, onSubmitProps) => {
    // console.log(values)
    axios
      .post('compte.php?type=C&jeton=' + props.infoCookie, values)
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
            onSubmitProps.resetForm()
            fetch(Constantes.URL + '/compte.php?type=R&read_all')
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
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const classes = useStyles()

  useEffect(() => {
    if (props.initial_.id != 0) {
      listBank.map((x) => {
        if (x.id == props.initial_.banque) {
          setDefaut(x)
        }
      })
      listDevise.map((x) => {
        if (x.id == props.initial_.devise) {
          setDefautDevise(x)
        }
      })
      listSociete.map((x) => {
        if (x.id == props.initial_.societe) {
          setDefautSociete(x)
        }
      })
    } else {
      setDefaut(null)
      setDefautSociete(null)
      setDefautDevise(null)
    }
  }, [props])

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
            solde_i: props.initial_.solde,
            comptable: props.initial_.comptable,
            rib: props.initial_.rib,
            libelle: props.initial_.libelle,
            gestionnaire: props.initial_.gestionnaire,
            civilite: props.initial_.civilite,
            service: props.initial_.service,
            tel: props.initial_.tel,
            email: props.initial_.email,
            banque: props.initial_.banque,
            fichier: props.initial_.fichier,
            societe: props.initial_.societe,
            devise: props.initial_.devise,
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
                    label='Code'
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
                    id='solde_i'
                    label='Solde initial'
                    type='text'
                    thelperText={errors.solde_i}
                    terror={errors.solde_i && true}
                    name='solde_i'
                    style={{ textAlign: 'right' }}
                  />
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='comptable'
                    label='Compte Comptable'
                    type='text'
                    thelperText={errors.comptable}
                    terror={errors.comptable && true}
                    name='comptable'
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
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='rib'
                    label='RIB'
                    type='text'
                    thelperText={errors.rib}
                    terror={errors.rib && true}
                    name='rib'
                  />

                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='libelle'
                    label='Libellé'
                    type='text'
                    thelperText={errors.libelle}
                    terror={errors.libelle && true}
                    name='libelle'
                  />
                </Grid>
                <Grid item xs={6} sm={6} lg={6}>
                  <Controls.ComboSingle
                    name='banque'
                    code='CODE_BANQUE'
                    data={listBank}
                    defaut={defaut}
                    onChange={(e, value) => {
                      setFieldValue('banque', value !== null ? value.id : value)
                    }}
                    thelperText={errors.banque}
                    terror={errors.banque && true}
                  />
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='gestionnaire'
                    label='gestionnaire'
                    type='text'
                    thelperText={errors.gestionnaire}
                    terror={errors.gestionnaire && true}
                    name='gestionnaire'
                  />
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='service'
                    label='service'
                    type='text'
                    thelperText={errors.service}
                    terror={errors.service && true}
                    name='service'
                  />
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='tel'
                    label='tel'
                    type='text'
                    thelperText={errors.tel}
                    terror={errors.tel && true}
                    name='tel'
                  />
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='fichier'
                    label='fichier'
                    type='text'
                    thelperText={errors.fichier}
                    terror={errors.fichier && true}
                    name='fichier'
                    style={{ display: 'none' }}
                  />
                  <Controls.ComboSingle
                    name='societe'
                    code='CODE_SOCIETE'
                    data={listSociete}
                    defaut={defautSociete}
                    onChange={(e, value) => {
                      setFieldValue(
                        'societe',
                        value !== null ? value.id : value,
                      )
                    }}
                    thelperText={errors.societe}
                    terror={errors.societe && true}
                  />
                  <Controls.ComboSingle
                    name='devise'
                    code='CODE_DEVISE'
                    data={listDevise}
                    defaut={defautDevise}
                    onChange={(e, value) => {
                      setFieldValue('devise', value !== null ? value.id : value)
                    }}
                    thelperText={errors.devise}
                    terror={errors.devise && true}
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

export default CompteForm
