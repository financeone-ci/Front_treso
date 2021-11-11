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

function CompteTiersForm(props) {
  const [notify, setNotify] = useState({
    type: '',
    message: '',
  })
  const [defaut, setDefaut] = useState({})
  const [openNotif, setOpenNotif] = useState(false)
  const [typeSubmit, setTypeSubmit] = useState({ type: 0, nouveau: 0 })
  const [ListBanqs, setListBanqs] = useState([])
  const [listTiers, setListTiers] = useState([])
  const [defautBanqs, setDefautBanqs] = useState()
  const [defautTiers, setDefautTiers] = useState()


  
  useEffect(() => {
    fetch(Constantes.URL + '/banque.php?type=R')
      .then((response) => response.json())
      .then((data) => setListBanqs(data.infos))
  }, [])

  useEffect(() => {
    fetch(Constantes.URL + '/tiers/tiers.php?type=R')
      .then((response) => response.json())
      .then((data) => setListTiers(data.infos))
  }, [props])

  const schema = yup.object().shape({
    iban: yup.string().nullable('Champs obligatoire'),
    swift: yup.string().nullable('Champs obligatoire'),
    banque: yup.string().required('Champs obligatoire'),
    adresse: yup.string().nullable('Champs obligatoire'),
    tiers: yup.string().required('Champs obligatoire'),
    libelle: yup.string().nullable('Champs obligatoire'),
    rib: yup.string().required('Champs obligatoire'),
  })

  // fonction à exécuter si le formulaire est OK
  const onSubmitProfilForm = (values, onSubmitProps) => {
    return props.initial_.id == 0
      ? createCompteTiersFunc(values, onSubmitProps)
      : editCompteTiersFunc(values, onSubmitProps)
  }

  const editCompteTiersFunc = (values, onSubmitProps) => {
  
    axios
       .post('/tiers/compte_tiers.php?type=U&jeton=' + props.infoCookie, values)//

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
            fetch(Constantes.URL + '/tiers/compte_tiers.php?type=R&codetiers='+props.codeTiers)
              .then((response) => response.json())
              .then((data) => props.setListCompteTiers(data.infos))
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
  
  const createCompteTiersFunc = (values, onSubmitProps) => {
    
   
    
    axios
      .post('/tiers/compte_tiers.php?type=C&jeton=' + props.infoCookie, values)
      .then((response) => {
        console.log(response.data)
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
            fetch(Constantes.URL + '/tiers/compte_tiers.php?type=R&codetiers='+props.codeTiers)
              .then((response) => response.json())
              .then((data) => props.setListCompteTiers(data.infos))
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

      ListBanqs.map((x) => { 
        
        if (x.id == props.initial_.banque_id) {
         
          setDefautBanqs(x)
        }
      })
    } else {
      setDefautBanqs(null)
    }
  }, [props])


 return (
    <React.Suspense fallback={<Controls.SpinnerBase />}>
      <>
      <ModalForm
        title={props.titreModal}
        handleClose={props.handleClose}
        open={props.open}>
        <Formik
          noValidate
          initialValues={{
            iban: props.initial_.iban_compte_tiers,
            swift: props.initial_.swift_compte_tiers,
            banque: props.initial_.banque_id,
            adresse: props.initial_.adresse_banque,
            tiers: props.codeTiers,
            libelle: props.initial_.libelle_compte_tiers,
            rib: props.initial_.rib_compte_tiers,  
            id: props.initial_.id,  
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
                <Grid item xs={6} sm={6} lg={6}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='iban'
                    label=' Iban compte tiers'
                    type='text'
                    thelperText={errors.iban}
                    terror={errors.iban && true}
                    name='iban'
                  />
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='swift'
                    label=' Swift compte tiers'
                    type='text'
                    thelperText={errors.swift}
                    terror={errors.swift && true}
                    name='swift'
                  />
                  <Controls.ComboSingle
                    name='banque'
                    code='CODE_BANQUE'
                    data={ListBanqs}
                    defaut={defautBanqs}
                    thelperText={errors.banque}
                    terror={errors.banque && true}
                    onChange={(e, value) => {
                      setFieldValue(
                        'banque',
                        value !== null ? value.id : value,
                      )
                    }}
                  />
                    <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='rib'
                    label='Rib compte tiers'
                    type='text'
                    thelperText={errors.rib}
                    terror={errors.rib && true}
                    name='rib'
                  />
                  </Grid>
                   <Grid item xs={6} sm={6} lg={6}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='adresse'
                    label=' Adresse Banque'
                    autoFocus
                    type='text'
                    thelperText={errors.adresse}
                    terror={errors.adresse && true}
                    name='adresse'
                  />

                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='tiers'
                    label='Tiers'
                    type='text'
                    disabled={true}
                    defaultfValue={props.codeTiers}
                    thelperText={errors.tiers}
                    terror={errors.tiers && true}
                    name='tiers'
                  />

                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='libelle'
                    label='Libelle compte tiers'
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
    </React.Suspense>
    
  )
}

export default CompteTiersForm
