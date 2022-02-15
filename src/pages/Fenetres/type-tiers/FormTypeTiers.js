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

function FormTypeTiers(props) {
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
  })

  // Création d'un nouveau TypeTiers
  const submitTypeTiers = async (values) => {
    let response = ''
    const headers = {
      Authorization: cookieInfo,
    }
    if (values.id === '') {
      response = await axios.post(
        'type-tiers/CreateTypeTiers.php',
        { values },
        { headers },
      )
    } else {
      response = await axios.post(
        'type-tiers/UpdateTypeTiers.php?id=' + values.id,
        { values },
        { headers },
      )
    }
    typeSubmit == 1 && props.handleClose()

    return response.data
  }

  // Création d'un TypeTiers
  const TypeTiers = useMutation(submitTypeTiers, {
    onSuccess: (data) => {
      console.log(data)
      props.queryClient.invalidateQueries('TypesTiers')
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
        {TypeTiers.isLoading && <SpinnerForm />}
        <Formik
          noValidate
          initialValues={{
            id: props.initialModal.id,
            code: props.initialModal.code,
            libelle: props.initialModal.libelle,
            
          }}
          validationSchema={schema}
          onSubmit={(values, onSubmitProps) => {
            TypeTiers.mutate(values, {
              onSuccess: (e) => {
                // console.log(e)
                e.reponse == 'success' &&
                  onSubmitProps.resetForm({
                    values: {
                      id: '',
                      code: '',
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
                    id='code'
                    label='Code Type tiers'
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
                    id='libelle'
                    label='libelle'
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

export default FormTypeTiers
