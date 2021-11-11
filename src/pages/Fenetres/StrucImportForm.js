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

function StrucImportForm(props) {
  const [notify, setNotify] = useState({
    type: '',
    message: '',
  })

  const [defaut, setDefaut] = useState({})
  const [openNotif, setOpenNotif] = useState(false)
  const [listStrucImport, setListStrucImport] = useState([])
  const [typeSubmit, setTypeSubmit] = useState({ type: 0, nouveau: 0 })

  const schema = yup.object().shape({
    code: yup.string().required('Champs obligatoire'),
    description: yup.string().required('Champs obligatoire'),
    pos_taxe: yup.string().nullable(),
    pos_benef: yup.string().nullable(),
    pos_ref_benef: yup.string().nullable(),
    pos_montant: yup.string().nullable(),
    pos_num: yup.string().nullable(),
    pos_num_bon: yup.string().nullable(),
    pos_motif: yup.string().nullable(),
    pos_echeance: yup.string().nullable(),
    pos_budget: yup.string().nullable(),
    pos_date: yup.string().nullable(),
    pos_marche: yup.string().nullable(),
    pos_retenue: yup.string().nullable(),
  })

  // fonction à exécuter si le formulaire est OK
  const onSubmitStrucImportForm = (values, onSubmitProps) => {
    return props.initial_.id == 0
      ? createStrucImportFunc(values, onSubmitProps)
      : editStrucImportFunc(values, onSubmitProps)
  }

  // Recuperation des Structure

  useEffect(() => {
    fetch(Constantes.URL + '/StrucImport.php?type=R')
      .then((response) => response.json())
      .then((data) => setListStrucImport(data.infos))
  }, [])

  // Modification de la strucuture

  const editStrucImportFunc = (values, onSubmitProps) => {
    axios
      .post('StrucImport.php?type=U', values) //

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
            fetch(Constantes.URL + 'StrucImport.php?type=R&read_all')
              .then((response) => response.json())
              .then((data) => props.setListStrucImport(data.infos))
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
        onSubmitProps.resetForm()
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const createStrucImportFunc = (values, onSubmitProps) => {
    console.log(values)
    axios
      .post('fichier/structure.php?type=C&jeton=' + props.infoCookie, values)
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

            fetch(Constantes.URL + 'StrucImport.php?type=R&read_all')
              .then((response) => response.json())
              .then((data) => props.setListStrucImport(data.infos))
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
        onSubmitProps.resetForm()
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const classes = useStyles()

  useEffect(() => {
    if (props.initial_.id != 0) {
      listStrucImport.map((x) => {
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
            code: props.initial_.code,
            description: props.initial_.description,
            pos_taxe: props.initial_.pos_taxe,
            pos_benef: props.initial_.pos_benef,
            pos_ref_benef: props.initial_.pos_ref_benef,
            pos_montant: props.initial_.pos_montant,
            pos_num: props.initial_.pos_num,
            pos_num_bon: props.initial_.pos_num_bon,
            pos_motif: props.initial_.pos_motif,
            pos_echeance: props.initial_.pos_echeance,
            pos_budget: props.initial_.pos_budget,
            pos_date: props.initial_.pos_date,
            pos_marche: props.initial_.pos_marche,
            pos_retenue: props.initial_.pos_retenue,
          }}
          validationSchema={schema}
          onSubmit={(values, onSubmitProps) => {
            onSubmitStrucImportForm(values, onSubmitProps)
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
                <Grid item xs={6} sm={3} lg={3}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    autoFocus
                    id='code'
                    label='Code Structure'
                    autoFocus
                    type='text'
                    thelperText={errors.code}
                    terror={errors.code && true}
                    name='code'
                  />
                </Grid>
                <Grid item xs={6} sm={9} lg={9}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='description'
                    label='Description'
                    autoFocus
                    type='text'
                    thelperText={errors.description}
                    terror={errors.description && true}
                    name='description'
                  />
                </Grid>
                <Grid item xs={6} sm={3} lg={3}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='pos_taxe'
                    label='Taxe'
                    type='text'
                    thelperText={errors.pos_taxe}
                    terror={errors.pos_taxe && true}
                    name='pos_taxe'
                  />
                </Grid>
                <Grid item xs={6} sm={3} lg={3}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='pos_benef'
                    label='Bénéficiaire'
                    type='text'
                    thelperText={errors.pos_benef}
                    terror={errors.pos_benef && true}
                    name='pos_benef'
                  />
                </Grid>
                <Grid item xs={6} sm={3} lg={3}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='pos_ref_benef'
                    label='Réf. Bénéficiaire'
                    type='text'
                    thelperText={errors.pos_ref_benef}
                    terror={errors.pos_ref_benef && true}
                    name='pos_ref_benef'
                  />
                </Grid>
                <Grid item xs={6} sm={3} lg={3}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='pos_montant'
                    label='Montant'
                    type='text'
                    thelperText={errors.pos_montant}
                    terror={errors.pos_montant && true}
                    name='pos_montant'
                  />
                </Grid>
                <Grid item xs={6} sm={3} lg={3}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='pos_num'
                    label='N° Engagement'
                    type='text'
                    thelperText={errors.pos_num}
                    terror={errors.pos_num && true}
                    name='pos_num'
                  />
                </Grid>
                <Grid item xs={6} sm={3} lg={3}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='pos_num_bon'
                    label='N° Bon de commande'
                    type='text'
                    thelperText={errors.pos_num_bon}
                    terror={errors.pos_num_bon && true}
                    name='pos_num_bon'
                  />
                </Grid>
                <Grid item xs={6} sm={3} lg={3}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='pos_motif'
                    label='Motif'
                    type='text'
                    thelperText={errors.pos_motif}
                    terror={errors.pos_motif && true}
                    name='pos_motif'
                  />
                </Grid>
                <Grid item xs={6} sm={3} lg={3}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='pos_echeance'
                    label='Echéance'
                    type='text'
                    thelperText={errors.pos_echeance}
                    terror={errors.pos_echeance && true}
                    name='pos_echeance'
                  />
                </Grid>
                <Grid item xs={6} sm={3} lg={3}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='pos_budget'
                    label='Budget'
                    type='text'
                    thelperText={errors.pos_budget}
                    terror={errors.pos_budget && true}
                    name='pos_budget'
                  />
                </Grid>
                <Grid item xs={6} sm={3} lg={3}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='pos_date'
                    label='Date'
                    type='text'
                    thelperText={errors.pos_date}
                    terror={errors.pos_date && true}
                    name='pos_date'
                  />
                </Grid>
                <Grid item xs={6} sm={3} lg={3}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='pos_marche'
                    label='Marche'
                    type='text'
                    thelperText={errors.pos_marche}
                    terror={errors.pos_marche && true}
                    name='pos_marche'
                  />
                </Grid>
                <Grid item xs={6} sm={3} lg={3}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='pos_retenue'
                    label='Retenue'
                    type='text'
                    thelperText={errors.pos_retenue}
                    terror={errors.pos_retenue && true}
                    name='pos_retenue'
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

export default StrucImportForm
