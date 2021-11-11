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

function TiersForm(props) {
  const [notify, setNotify] = useState({
    type: '',
    message: '',
  })
  const [openNotif, setOpenNotif] = useState(false)
  const [typeSubmit, setTypeSubmit] = useState({ type: 0, nouveau: 0 })


  const schema = yup.object().shape({
    code: yup.string().required('Champs obligatoire'),
  })

  // fonction à exécuter si le formulaire est OK
  const onSubmitTiersForm = (values, onSubmitProps) => {
    return props.initial_.id == 0
      ? createTiersFunc(values, onSubmitProps)
      : editTiersFunc(values, onSubmitProps)
  }

  const editTiersFunc = (values, onSubmitProps) => {
    axios
      .post('/tiers/tiers.php?type=U', values) //

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

            fetch(Constantes.URL + 'tiers/tiers.php?type=R')
              .then((response) => response.json())
              .then((data) => props.setListTiers(data.infos))
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
            message:  response.data.message,
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

  const createTiersFunc = (values, onSubmitProps) => {
    
    axios
      .post('tiers/tiers.php?type=C&jeton=' + props.infoCookie, values)
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

            fetch(Constantes.URL + 'tiers/tiers.php?type=R&read_all')
              .then((response) => response.json())
              .then((data) => props.setListTiers(data.infos)) 
              onSubmitProps.resetForm()
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
            adresse: props.initial_.adresse,
            code: props.initial_.code,
            beneficiaire: props.initial_.beneficiaire,
            nom: props.initial_.nom,
            civilite: props.initial_.civilite,
            nom: props.initial_.nom,
            fonction: props.initial_.fonction,
            tel: props.initial_.tel,
            ref: props.initial_.ref,
            fournisseur: props.initial_.fournisseur,
            type_tiers: props.initial_.type,
            //type_tiers: defautTypeTiers,
          }}
          validationSchema={schema}
          onSubmit={(values, onSubmitProps) => {
            onSubmitTiersForm(values, onSubmitProps)
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
                    id='beneficiaire'
                    label='beneficiaire'
                    type='text'
                    thelperText={errors.beneficiaire}
                    terror={errors.beneficiaire && true}
                    name='beneficiaire'
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
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='tel'
                    label='Téléphone'
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
                      display:'none',
                    }}>
                    {'  '}
                    <span style={{ marginLeft: '12px' }}>
                      {values.fournisseur == 1 ? (
                        <Controls.SwitchIos
                          checked={{
                            checkedB: true,
                          }}
                          data={{ id: 1, column: 1, value: 1 }}
                          fonctionOK={fonctionOK}
                          edit={() => {
                            setFieldValue('fournisseur', 0)
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
                            setFieldValue('fournisseur', 1)
                          }}
                        />
                      )}
                    </span>{' '}
                    Fournisseur
                  </div>
                  
                </Grid>
                <Grid item xs={6} sm={6} lg={6}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='nom'
                    label='Représentant'
                    type='text'
                    thelperText={errors.nom}
                    terror={errors.nom && true}
                    name='nom'
                  />
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='civilite'
                    label='Civilité'
                    type='text'
                    thelperText={errors.civilite}
                    terror={errors.civilite && true}
                    name='civilite'
                  />

                  
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='fonction'
                    label='Fonction représentant'
                    type='text'
                    thelperText={errors.fonction}
                    terror={errors.fonction && true}
                    name='fonction'
                  />
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='ref'
                    label='Reférence'
                    type='text'
                    thelperText={errors.ref}
                    terror={errors.ref && true}
                    name='ref'
                  />
                  
                   
 
                </Grid> 
                <Grid item xs={12}>
                  <Controls.ComboMulti
                    name='type_tiers'
                    code='CODE_TYPE_TIERS'
                    data={props.listTypeTiers}
                   defaut={props.initial_.type}    
                  //   defaut={defautTypeTiers}
                    includeInputInList
                    thelperText={errors.type_tiers}
                    terror={errors.type_tiers && true}
                    onChange={(e, value) => {
                     
                      setFieldValue(
                        'type_tiers',
                        value
                      )
                    }}
                     
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

export default TiersForm
