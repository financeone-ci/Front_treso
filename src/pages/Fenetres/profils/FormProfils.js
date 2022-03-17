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

function FormProfil(props) {
  // Stats

  const [typeSubmit, setTypeSubmit] = useState(1)

  // Variables
  // lire les infos du cookie
  const cookieInfo = ReadCookie()

  // Schema de validation du formulaire
  const schema = yup.object().shape({
    description: yup.string().required('Description obligatoire'),
    libelle: yup.string().required('Libellé obligatoire'),
   
  })

  // Création de profil
  const submitProfil = async (values) => {
    let response = ''
    const headers = {
      Authorization: cookieInfo,
    }
    if (values.id === '') {
      response = await axios.post(
        'Profils/CreateProfils.php',
        { values },
        { headers },
      )
    } else {
      response = await axios.post(
        'Profils/UpdateProfils.php?id='+values.id,
        { values },
        { headers },
      )
     
    }
    typeSubmit == 1 && props.handleClose()

    return response.data
  }

  // Création de profil
  const profil = useMutation(submitProfil, {
    onSuccess: (data) => {
      props.queryClient.invalidateQueries('listeProfils')
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
        {profil.isLoading && <SpinnerForm />}
        <Formik
          noValidate
          initialValues={{
            id: props.initialModal.id,
            libelle: props.initialModal.libelle,
            description: props.initialModal.description,
          }}
          validationSchema={schema}
          onSubmit={(values, onSubmitProps) => {
            profil.mutate(values, {
              onSuccess: (e) => {
                // console.log(e)
                e.reponse == 'success' &&
                onSubmitProps.resetForm({
                  values: {
                    id: '',
                    description: '',
                    libelle: '',
                   
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
                    id='libelle'
                    label='libelle'
                    autoFocus
                    type='text'
                    thelperText={errors.libelle}
                    terror={errors.libelle && true}
                    name='libelle'
                  />
                  
                  </Grid>
                  <Grid item xs={6} sm={6} lg={6}>
                <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='description'
                    label='description'
                    type='text'
                    thelperText={errors.description}
                    terror={errors.description && true}
                    name='description'
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

export default FormProfil
