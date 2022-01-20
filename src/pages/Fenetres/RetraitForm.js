/** @format */

import React, { useState } from 'react'
import * as yup from 'yup'
import axios from '../../api/axios'
import ModalForm from '../../composants/controls/modal/ModalForm'
import Controls from '../../composants/controls/Controls'
import { makeStyles } from '@material-ui/core'
import { Notification } from '../../composants/controls/toast/MyToast'
import { Formik, Form, Field, useField, ErrorMessage } from 'formik'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import SpinnerForm from '../../composants/controls/spinner/SpinnerForm'
import Upload from '../../composants/formulaire/Upload'

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(0),
  },
  buton: {
    textAlign: 'right',
  },
}))

function RetraitForm(props) {
  // notification
  const [notify, setNotify] = useState({
    type: '',
    message: '',
  })
  const [openNotif, setOpenNotif] = useState(false)
  const [files, setFiles] = useState([props.files.file])

  const schema = yup.object().shape({
    beneficiaire: yup.string().required('Champs obligatoire'),
    identite: yup.string().required('Champs obligatoire'),
  })

  const editRetraitFunc = async (values) => {
    const formData = new FormData()
    formData.append('beneficiaire', values.beneficiaire)
    formData.append('identite', values.identite)
    files.length > 0 && files.map((item) => formData.append('fichier[]', item))

    let donnee = ''
    const headers = {
      Authorization: props.infoCookie,
    }
    let response = await axios.post(
      `CreateRetrait.php?id=${props.listID}`,
      formData,
      { headers },
    )
    return response.data
  }

  const mutationEdit = useMutation(editRetraitFunc, {
    onError: () => {
      setNotify({ message: 'Connexion impossible', type: 'error' })
      setOpenNotif(true)
    },
    onSuccess: (data) => {
      props.queryClient.invalidateQueries('vueretraits')
      props.handleClose()
      setNotify({ message: data.message, type: data.reponse })
      setOpenNotif(true)
    },
  })

  const handleChangeFile = (files) => {
    setFiles(files)
  }

  const classes = useStyles()

  return (
    <>
      <ModalForm
        title='Informations bénéficiaire'
        handleClose={props.handleClose}
        open={props.openModal}>
        {mutationEdit.isLoading && <SpinnerForm />}
        <Formik
          noValidate
          initialValues={{
            beneficiaire: props.initialModal.beneficiaire,
            identite: props.initialModal.identite,
          }}
          validationSchema={schema}
          onSubmit={(values, onSubmitProps) => {
            mutationEdit.mutate(values, {
              onSuccess: () => {
                onSubmitProps.resetForm({
                  values: {
                    beneficiaire: '',
                    identite: '',
                  },
                })
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
            /* and other goodies */
          }) => (
            <Form>
              <Controls.TextInput
                variant='outlined'
                margin='normal'
                id='beneficiaire'
                label='Bénéficiaire'
                autoFocus
                fullWidth='true'
                type='text'
                helperText={errors.beneficiaire}
                error={errors.beneficiaire && true}
                name='beneficiaire'
              />
              <Controls.TextInput
                variant='outlined'
                margin='normal'
                id='identite'
                fullWidth='true'
                label='Identité'
                type='text'
                name='identite'
                error={errors.identite && true}
                helperText={errors.identite}
              />
              <Upload
                initialFiles={files}
                handleChange={handleChangeFile}
                acceptedFiles={['image/*', '.doc', '.docx', '.pdf']}
              />
              <div className={classes.buton}>
                <Controls.ButtonLabel color='green'>
                  Valider
                </Controls.ButtonLabel>
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

export default RetraitForm
