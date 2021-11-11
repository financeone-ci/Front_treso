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

function TypeTiersForm(props) {

  const [notify, setNotify] = useState({
    type: '',
    message: '',
  })
  const [defaut, setDefaut] = useState({})
  const [listTypeTiers, setListTypeTiers] = useState([])
  const [openNotif, setOpenNotif] = useState(false)
  const [typeSubmit, setTypeSubmit] = useState({ type: 0, nouveau: 0 })
  

  const schema = yup.object().shape({
    code: yup.string().required('Champs obligatoire'),
    libelle: yup.string().required('Champs obligatoire'),
  })

  // fonction à exécuter si le formulaire est OK
  const onSubmitProfilForm = (values, onSubmitProps) => {
    return props.initial_.id == 0
      ? createTypeTierFunc(values, onSubmitProps)
      : editTypeTierFunc(values, onSubmitProps)
  }

  const editTypeTierFunc = (values, onSubmitProps) => {
     console.log(values) 
    axios
    .post('tiers/type_tiers.php?type=U', values) 
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
            fetch(Constantes.URL + 'tiers/type_tiers.php?type=R&read_all')
              .then((response) => response.json())
              .then((data) => props.setListTypeTiers(data.infos))
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
      })
      .catch((error) => {
        console.log(error)
      }) 
  }

  const createTypeTierFunc = (values, onSubmitProps) => {
   
      axios
      .post('tiers/type_tiers.php?type=C&jeton=' + props.infoCookie, values)
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
            fetch(Constantes.URL + 'tiers/type_tiers.php?type=R&read_all')
              .then((response) => response.json())
              .then((data) => props.setListTypeTiers(data.infos))
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
      listTypeTiers.map((x) => {
        if (x.id == props.initial_.id) {
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
            code: props.initial_.code_type_tiers,
            libelle: props.initial_.libelle_type_tiers,
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
                <Grid item xs={12} sm={12} lg={12}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='code'
                    label='Code type tiers'
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
                    label='Libelle type tiers'
                    type='text'
                    thelperText={errors.libelle}
                    terror={errors.libelle && true}
                    name='libelle'
                  />
                </Grid>
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

export default TypeTiersForm
