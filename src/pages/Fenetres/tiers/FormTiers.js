/** @format */

import React, { useState } from 'react'
import * as yup from 'yup'
import axios from '../../../api/axios'
import ModalForm from '../../../composants/controls/modal/ModalForm'
import Controls from '../../../composants/controls/Controls'
import ReadCookie from '../../../functions/ReadCookie'
import { makeStyles } from '@material-ui/core'
import { Notification } from '../../../composants/controls/toast/MyToast'
import { Formik, Form, Field, useField, ErrorMessage } from 'formik'
import { Grid } from '@material-ui/core'
import SpinnerForm from '../../../composants/controls/spinner/SpinnerForm'
import {
  useIsMutating,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query'

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(0),
  },
  buton: {
    textAlign: 'right',
  },
}))

function FormTiers(props) {
  // Stats
  // const [notify, setNotify] = useState({
  //   type: '',
  //   message: '',
  // })
  // const [openNotif, setOpenNotif] = useState(false)
  const [typeSubmit, setTypeSubmit] = useState(1)
  const [listId, setListId] = useState('')

  // Variables
  // lire les infos du cookie
  const cookieInfo = ReadCookie()

  // Schema de validation du formulaire
  const schema = yup.object().shape({
    code: yup.string().required('Code obligatoire'),
    beneficiaire: yup.string().required('Bénéficiaire obligatoire'),
  })

  // Création d'un nouveau Tiers
  const submitTiers = async (values) => {
    let response = ''
    const headers = {
      Authorization: cookieInfo,
    }
    if (values.id === '') {
      response = await axios.post(
        'tiers/CreateTiers.php',
        { values },
        { headers },
      )
    } else {
      response = await axios.post(
        'tiers/UpdateTiers.php?id=' + values.id,
        { values },
        { headers },
      )
    }
    typeSubmit == 1 && props.handleClose()

    return response.data
  }

  // Création d'un Tiers
  const Tiers = useMutation(submitTiers, {
    onSuccess: (data) => {
      console.log(data)
      props.queryClient.invalidateQueries('Tiers')
      props.setNotify({
        type: data.reponse,
        message: data.message,
      })
      props.setOpenNotif(true)
    },
    onError: () => {
      props.setNotify({
        message: 'Connexion au service impossible',
        type: 'error',
      })
      props.setOpenNotif(true)
    },
  })

  const classes = useStyles()
  return (
    <>
      <ModalForm
        title={props.titreModal}
        handleClose={props.handleClose}
        open={props.openModal}>
        {Tiers.isLoading && <SpinnerForm />}
        <Formik
          noValidate
          initialValues={{
            id: props.initialModal.id,
            code: props.initialModal.code,
            beneficiaire: props.initialModal.beneficiaire,
            contact: props.initialModal.contact,
            civilite: props.initialModal.civilite,
            reference: props.initialModal.reference,
            nom: props.initialModal.nom,
            fonction: props.initialModal.fonction,
            adresse: props.initialModal.adresse,
            
          }}
          validationSchema={schema}
          onSubmit={(values, onSubmitProps) => {
            Tiers.mutate(values, {
              onSuccess: (e) => {
                // console.log(e)
                e.reponse == 'success' &&
                  onSubmitProps.resetForm({
                    values: {
                      id: '',
                      code: '',
                      beneficiaire: '',
                      contact: '',
                      civilite: '',
                      reference: '',
                      nom: '',
                      fonction: '',
                      adresse: '',
                      
                    },
                  })
              },
              onError: (e) => {
                console.log(e)
              },
            })
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
                value={props.initialModal.id || ''}
              />
              <Grid container spacing={2}>
                <Grid item xs={6} sm={6} lg={6}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='code'
                    label='Code  tiers'
                    autoFocus
                    type='text'
                    thelperText={errors.code}
                    terror={errors.code && true}
                    name='code'
                  />
                  
                </Grid>
                <Grid item xs={6} sm={6} lg={6}>
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
                  
                </Grid>
                <Grid item xs={6} sm={6} lg={6}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='contact'
                    label='contact'
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
                    id='civilite'
                    label='civilite'
                    type='text'
                    thelperText={errors.civilite}
                    terror={errors.civilite && true}
                    name='civilite'
                  />
                  
                </Grid>
                
                <Grid item xs={6} sm={6} lg={6}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='reference'
                    label='reference'
                    type='text'
                    thelperText={errors.reference}
                    terror={errors.reference && true}
                    name='reference'
                  />
                  
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
                  
                </Grid>
                
                <Grid item xs={6} sm={6} lg={6}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='fonction'
                    label='Fonction Représentant'
                    type='text'
                    thelperText={errors.fonction}
                    terror={errors.fonction && true}
                    name='fonction'
                  />
                  
                </Grid>
                
                <Grid item xs={6} sm={6} lg={6}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='adresse'
                    label='Adresse Représentant'
                    type='text'
                    thelperText={errors.adresse}
                    terror={errors.adresse && true}
                    name='adresse'
                  />
                  
                </Grid>
                
                
              </Grid>

              <div className={classes.buton}>
                <Controls.ButtonLabel
                  color='primary'
                  onClick={() => setTypeSubmit(1)}>
                  Valider
                </Controls.ButtonLabel>
                {props.initialModal.id === '' && (
                  <Controls.ButtonLabel
                    color='secondary'
                    onClick={() => setTypeSubmit(2)}>
                    Appliquer
                  </Controls.ButtonLabel>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </ModalForm>
    </>
  )
}

export default FormTiers
