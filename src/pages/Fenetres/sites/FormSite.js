/** @format */

import React, { useState } from 'react'
import * as yup from 'yup'
import axios from '../../../api/axios'
import ModalForm from '../../../composants/controls/modal/ModalForm'
import Controls from '../../../composants/controls/Controls'
import { makeStyles } from '@material-ui/core'
import { Notification } from '../../../composants/controls/toast/MyToast'
import { Formik, Form, Field, useField, ErrorMessage } from 'formik'
import { Grid } from '@material-ui/core'
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
  const [notify, setNotify] = useState({
    type: '',
    message: '',
  })
  const [openNotif, setOpenNotif] = useState(false)

  // Variables

  // Schema formik
  const schema = yup.object().shape({
    code: yup.string().required('Code obligatoire'),
    description: yup.string().required('Description obligatoire'),
    representant: yup.string().required('Représentant obligatoire'),
    description: yup.string().required('Description obligatoire'),
    description: yup.string().required('Description obligatoire'),
  })

  const submitForm = async (values, type) => {
    let Api = ''
    type === 1 ? (Api = 'sites/CreateSite.php') : (Api = 'sites/UpdateSite.php')
    let response = await axios.post(Api, { values })
    return response.data
  }

  // Création d'un site
  const CreateSite = useMutation(submitForm, {
    onSuccess: (data) => {},
    onError: () => {},
  })

  // Modification d'un site
  const UpdateSite = useMutation(submitForm, {
    onSuccess: (data) => {},
    onError: () => {},
  })

  const classes = useStyles()
  return (
    <>
      <ModalForm
        title={props.titreModal}
        handleClose={props.handleClose}
        open={props.openModal}>
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
            // onSubmitBankForm(values, onSubmitProps)
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
                    label='Code site'
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
                  //onClick={}
                >
                  Valider
                </Controls.ButtonLabel>
                {props.initialModal.id == 0 && (
                  <Controls.ButtonLabel
                    color='secondary'
                    // onClick={}
                  >
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

export default FormSite
