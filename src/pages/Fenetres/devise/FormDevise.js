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

function FormDevise(props) {
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
    libelle: yup.string().required('Libellé obligatoire'),
    taux: yup.string().required('taux obligatoire'),
  })

  // Création d'une nouvelle devise
  const submitDevise = async (values) => {
    let response = ''
    const headers = {
      Authorization: cookieInfo,
    }
    if (values.id === '') {
      response = await axios.post(
        'devises/CreateDevise.php',
        { values },
        { headers },
      )
    } else {
      response = await axios.post(
        'devises/UpdateDevise.php?id=' + values.id,
        { values },
        { headers },
      )
    }
    typeSubmit == 1 && props.handleClose()

    return response.data
  }

  // Création d'une devise
  const devise = useMutation(submitDevise, {
    onSuccess: (data) => {
      props.queryClient.invalidateQueries('listedevise')
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
        {devise.isLoading && <SpinnerForm />}
        <Formik
          noValidate
          initialValues={{
            id: props.initialModal.id,
            code: props.initialModal.code,
            libelle: props.initialModal.libelle,
            taux: props.initialModal.taux,
            base_devise: props.initialModal.base_devise,
          }}
          validationSchema={schema}
          onSubmit={(values, onSubmitProps) => {
            devise.mutate(values, {
              onSuccess: (e) => {
                // console.log(e)
                e.reponse == 'success' &&
                  onSubmitProps.resetForm({
                    values: {
                      id: '',
                      code: '',
                      libelle: '',
                      taux: '',
                      base_devise: '',
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
                    id='base_devise'
                    label='Devise de base'
                    type='text'
                    thelperText={errors.base_devise}
                    terror={errors.base_devise && true}
                    name='base_devise'
                  />
                </Grid>
                <Grid item xs={6} sm={6} lg={6}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='libelle'
                    label='libelle'
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
                    label='Taux'
                    type='text'
                    thelperText={errors.taux}
                    terror={errors.taux && true}
                    name='taux'
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

export default FormDevise
