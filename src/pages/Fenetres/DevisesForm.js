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

function DevisesForm(props) {

  const [notify, setNotify] = useState({
    type: '',
    message: '',
  })

  const [defaut, setDefaut] = useState({})
  const [openNotif, setOpenNotif] = useState(false)
  const [typeSubmit, setTypeSubmit] = useState({ type: 0, nouveau: 0 })
  const [listDevises, setListDevises] = useState([])


  const schema = yup.object().shape({
   
    code: yup.string().required('Champs obligatoire'),
    libelle: yup.string().required('Champs obligatoire'),
    taux: yup.string().required('Champ obligatoire'),
    base: yup.string().required('Champ obligatoire'),
    cent: yup.string().nullable('Champ obligatoire'),
    sigle: yup.string().nullable('Cham obligatoire'),
    
  })

  // fonction à exécuter si le formulaire est OK
  const onSubmitProfilForm = (values, onSubmitProps) => {
    return props.initial_.id == 0
      ? createDeviseFunc(values, onSubmitProps)
      : editDeviseFunc(values, onSubmitProps)
  }

  const editDeviseFunc = (values, onSubmitProps) => {

    axios
      .post('devise.php?type=U', values) //

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

            fetch(Constantes.URL + '/devise.php?type=R&read_all')
              .then((response) => response.json())
              .then((data) => props.setListDevises(data.infos))
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

  const createDeviseFunc = (values, onSubmitProps) => {
    
    axios
      .post('devise.php?type=C&jeton='+props.infoCookie, values) 
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

            fetch(Constantes.URL + '/devise.php?type=R&read_all')
              .then((response) => response.json())
              .then((data) => props.setListDevises(data.infos))
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
      listDevises.map((x) => {
        if (x.id == props.initial_.iddevise) {
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
            code: props.initial_.code,
            libelle: props.initial_.libelle,
            taux: props.initial_.taux,
            base: props.initial_.base,
            cent: props.initial_.cent,
            sigle: props.initial_.sigle,
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
                    label='Code devise'
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
                    label='Libelle devise'
                    type='text'
                    thelperText={errors.libelle}
                    terror={errors.libelle && true}
                    name='libelle'
                  />
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='taux'
                    label='Taux devise' 
                    type='text'
                    thelperText={errors.taux}
                    terror={errors.taux && true}
                    name='taux'
                  />
                </Grid>
                <Grid item xs={6} sm={6} lg={6}>
                {props.initial_.base == 0 ? (
                    <Controls.Check
                      checked={false}
                      label='Devise Référence '
                      name='base'
                      onChange={() => {
                        setFieldValue('base', 1)
                      }}
                    />
                  ) : (
                    <Controls.Check
                      checked={true}
                      label='Devise Référence '
                      name='base'
                      onChange={() => {
                        setFieldValue('base', 0)
                      }}
                    />
                  )}

                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='cent'
                    label='Libelle centimes'
                    type='text'
                    thelperText={errors.cent}
                    terror={errors.cent && true}
                    name='cent'
                  />
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='sigle'
                    label='Sigle devise'
                    type='text'
                    thelperText={errors.sigle}
                    terror={errors.sigle && true}
                    name='sigle'
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

export default DevisesForm
