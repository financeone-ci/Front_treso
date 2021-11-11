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

function CodeBudgetaireForm(props) {
  const [notify, setNotify] = useState({
    type: '',
    message: '',
  })
  const [defaut, setDefaut] = useState({})
  const [openNotif, setOpenNotif] = useState(false)
  const [typeSubmit, setTypeSubmit] = useState({ type: 0, nouveau: 0 })
  const [listTypeBudget, setListTypeBudget] = useState([])
  const [defautTypeBudget, setDefautTypeBudget] = useState()
  
  useEffect(() => {
    fetch(Constantes.URL + '/typeBudget.php?type=R')
      .then((response) => response.json())
      .then((data) => setListTypeBudget(data.infos))
  }, [])

  const schema = yup.object().shape({
    code: yup.string().required('Champs obligatoire'),
    libelle: yup.string().required('Champs obligatoire'),
    budget: yup.string().required('Champ obligatoire'),
  })

  // fonction à exécuter si le formulaire est OK
  const onSubmitProfilForm = (values, onSubmitProps) => {
    return props.initial_.id == 0
      ? createProfilFunc(values, onSubmitProps)
      : editProfilFunc(values, onSubmitProps)
  }

  const editProfilFunc = (values, onSubmitProps) => {
    axios
      .post('codeBudget.php?type=U', values) //

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
            onSubmitProps.resetForm()
            fetch(Constantes.URL + '/codeBudget.php?type=R&read_all')
              .then((response) => response.json())
              .then((data) => props.setListCodeBudgetaire(data.infos))
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
            message: ' response.data.message',
          })
          setOpenNotif(true)
        }
        onSubmitProps.setSubmitting(false)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const createProfilFunc = (values, onSubmitProps) => {
   
    axios
      .post('codeBudget.php?type=C&jeton=' + props.infoCookie, values)
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
            onSubmitProps.resetForm()
            fetch(Constantes.URL + '/codeBudget.php?type=R&read_all')
              .then((response) => response.json())
              .then((data) => props.setListCodeBudgetaire(data.infos))
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

  useEffect(() => {
    if (props.initial_.id != 0) {

      listTypeBudget.map((x) => {
        if (x.id == props.initial_.id) {
          setDefautTypeBudget(x)
        }
      })
    } else {
      setDefautTypeBudget(null)
    }
  }, [props])

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
            budget: props.initial_.id_code_budgetaire,
          }}
          validationSchema={schema}
          onSubmit={(values, onSubmitProps) => {
            onSubmitProfilForm(values, onSubmitProps)
          }}>
          {({
            values,
            errors,
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
                <Grid item xs={12} sm={12} lg={12}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='code'
                    label='Code budgetaire'
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
                    id='libelle'
                    label='Libelle code budgetaire'
                    type='text'
                    thelperText={errors.libelle}
                    terror={errors.libelle && true}
                    name='libelle'
                  />

                  <Controls.ComboSingle
                    name='budget'
                    code='CODE_TYPE_BUDGET'
                    data={listTypeBudget}
                    defaut={defautTypeBudget}
                    thelperText={errors.budget}
                    terror={errors.budget && true}
                    onChange={(e, value) => {
                      setFieldValue(
                        'budget',
                        value !== null ? value.id : value,
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

export default CodeBudgetaireForm
