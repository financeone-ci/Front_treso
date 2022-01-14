/** @format */

import React from 'react'
import * as yup from 'yup'
import axios from '../../../api/axios'
import ModalForm from '../../../composants/controls/modal/ModalForm'
import Controls from '../../../composants/controls/Controls'
import { makeStyles } from '@material-ui/core'
import { Notification } from '../../../composants/controls/toast/MyToast'
import Constantes from '../../../api/Constantes'
import { Formik, Form, Field, useField, ErrorMessage } from 'formik'
import { Grid } from '@material-ui/core'
import { useSelector } from 'react-redux'

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(0),
  },
  buton: {
    textAlign: 'right',
  },
}))

function FormSite() {
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
            directeur: props.initial_.dg,
            gestionnaire: props.initial_.gestionnaire,
            adresse_web: props.initial_.adresse_web,
            adresse: props.initial_.adresse,
            contact: props.initial_.contact,
          }}
          validationSchema={schema}
          onSubmit={(values, onSubmitProps) => {
            onSubmitBankForm(values, onSubmitProps)
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
                    id='desciption'
                    label='Description'
                    type='text'
                    thelperText={errors.desciption}
                    terror={errors.desciption && true}
                    name='desciption'
                  />
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
                    id='localisation'
                    label='Adresse géographique'
                    type='text'
                    thelperText={errors.localisation}
                    terror={errors.localisation && true}
                    name='localisation'
                  />
                </Grid>
                <Grid item xs={6} sm={6} lg={6}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='contact'
                    label='Contact banque'
                    type='text'
                    thelperText={errors.contact}
                    terror={errors.contact && true}
                    name='contact'
                  />
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='adresse_web'
                    label='Adresse web'
                    type='url'
                    thelperText={errors.adresse_web}
                    terror={errors.adresse_web && true}
                    name='adresse_web'
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

export default FormSite
