/** @format */

import React, { useState, useEffect } from 'react'
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

function FormSite(props) {
  // Stats
  const [typeSubmit, setTypeSubmit] = useState(1)
  const [succes, setSucces] = useState(false)

  // Variables
  // lire les infos du cookie
  const cookieInfo = ReadCookie()

  // Schema de validation du formulaire
  const schema = yup.object().shape({
    code: yup.string().required('Code obligatoire'),
    description: yup.string().required('Description obligatoire'),
    representant: yup.string().required('Représentant obligatoire'),
    local: yup.string().required('Localisation obligatoire'),
  })

  // Création d'un nouveau site
  const submitSite = async (values) => {
    let response = ''
    const headers = {
      Authorization: cookieInfo,
    }
    if (values.id === '') {
      response = await axios.post(
        'sites/CreateSite.php',
        { values },
        { headers },
      )
    } else {
      response = await axios.post(
        `sites/UpdateSite.php?id=${values.id}`,
        { values },
        { headers },
      )
    }
    typeSubmit === 1 && props.handleClose()
    return response.data
  }

  // Création d'un site
  const site = useMutation(submitSite, {
    onSuccess: (data) => {
      props.queryClient.invalidateQueries('listesite')
      props.setNotify({
        type: data.reponse,
        message: data.message,
      })
      props.setOpenNotif(true)
    },
    onError: () => {
      props.setNotify({
        message: 'Service indisponible',
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
        {site.isLoading && <SpinnerForm />}
        <Formik
          noValidate
          initialValues={{
            id: props.initialModal.id,
            code: props.initialModal.code,
            description: props.initialModal.description,
            representant: props.initialModal.representant,
            local: props.initialModal.local,
          }}
          validationSchema={schema}
          onSubmit={(values, onSubmitProps) => {
            site.mutate(values, {
              onSuccess: (e) => {
                e.reponse == 'success' && onSubmitProps.resetForm()
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
                    id='description'
                    label='Description'
                    type='text'
                    thelperText={errors.description}
                    terror={errors.description && true}
                    name='description'
                  />
                </Grid>
                <Grid item xs={6} sm={6} lg={6}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='representant'
                    label='Représentant'
                    type='text'
                    thelperText={errors.representant}
                    terror={errors.representant && true}
                    name='representant'
                  />
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='local'
                    label='Localisation'
                    type='text'
                    thelperText={errors.local}
                    terror={errors.local && true}
                    name='local'
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

export default FormSite
