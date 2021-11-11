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
import { useMutation, useQuery, useQueryClient } from 'react-query'
import SpinnerForm from '../../composants/controls/spinner/SpinnerForm'

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(0),
  },
  buton: {
    textAlign: 'right',
  },
}))

function FluxForm(props) {
  
  const [notify, setNotify] = useState({
    type: '',
    message: '',
  })
  const [defaut, setDefaut] = useState({})
  const [openNotif, setOpenNotif] = useState(false)
  const [typeSubmit, setTypeSubmit] = useState({ type: 0, nouveau: 0 })
  const [listCategorieFlux, setListCategorieFlux] = useState([])
  const [defautCategorieFlux, setDefautCategorieFlux] = useState()
  const listSens = [
    { valeur: 'Credit' },
    { valeur: 'Debit' },
  ]

  // choisir le sens
  const actualisationCat = (filterSens="", type="") =>{
    if(type == "auto"){
                      axios
                      .post('categorie_flux.php?type=R' , {filter: filterSens})
                      .then((response) => {
                        setListCategorieFlux(response.data.infos)
                      })
    }else{
                      axios
                      .post('categorie_flux.php?type=R&filter=' + filterSens , {filter: filterSens})
                      .then((response) => {
                        setListCategorieFlux(response.data.infos)
                       // setDefautCategorieFlux(null)
                      })
    }
            
  }
 
  useEffect(() => { 
      actualisationCat("", "auto")
  }, [])
  

  const schema = yup.object().shape({
    code: yup.string().required('Champs obligatoire'),
    description: yup.string().required('Champs obligatoire'),
    sens: yup.string().required('Champ obligatoire'),
    categorie: yup.string().nullable().required('Champ obligatoire'),
  })

    // Création et  modification de flux

    const editFlux = async (values) => {
      
      let donnees = ''
      // Création de flux
      if (props.initial_.id == 0) {
        const resp = await axios
          .post('flux.php?type=C&jeton=' + props.infoCookie, values)
          .then((response) => {
            donnees = response
          })
        if (typeSubmit.type == 1) {
          props.handleClose()
        }
      } else {
        // Modification de flux
        const resp = await axios
          .post(
            'flux.php?type=U&id=' +
              values.id +
              '&jeton=' +
              props.infoCookie,
            values,
          )
          .then((response) => {
            donnees = response
          })
  
        props.handleClose()
      }
      return donnees.data
    }
  
    const mutationEdit = useMutation(editFlux, {
      onError: (data) => {
        setNotify({ message: data.message, type: data.reponse })
        setOpenNotif(true)
      },
      onSuccess: (data) => {
        props.queryClient.invalidateQueries('reqFlux')
        setNotify({ message: data.message, type: data.reponse })
        setOpenNotif(true)
      },
    })



  useEffect(() => {
    if (props.initial_.id != 0) {
      listSens.map((x) => {
         
        if (props.initial_.sens == "C" ) {
          setDefaut({valeur:'Credit'})
        }
         
        if (props.initial_.sens == "D" ) {
          setDefaut({valeur:'Debit'})
        }
      })

      listCategorieFlux.map((x) => {
        if (x.ID_CATEGORIE_FLUX == props.initial_.id_categorie_flux) {
          setDefautCategorieFlux(x)
        }
      })
    } else {
      setDefaut(null)
      setDefautCategorieFlux(null)
    }
  }, [props])

  const classes = useStyles()

  return (
    <>
      <ModalForm
        title={props.titreModal}
        handleClose={props.handleClose}
        open={props.open}>
        {
        mutationEdit.isLoading && 
          <SpinnerForm />
        }

        <Formik
          noValidate
          initialValues={{
            id: props.initial_.id,
            code: props.initial_.code,
            description: props.initial_.description,
            sens: props.initial_.sens,
            incr_quota_flux: props.initial_.inc_quota_flux,
            categorie: props.initial_.id_categorie_flux,
          }}
          validationSchema={schema}
          onSubmit={(values, onSubmitProps) => {
            mutationEdit.mutate(values, {
              onSuccess: () => {
                onSubmitProps.resetForm({
                  values: {
                    code: '',
                    description: '',
                    sens: '',
                    incr_quota_flux: '',
                    categorie: '',
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
                    label='Code flux'
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
                    label='Description flux'
                    type='text'
                    thelperText={errors.description}
                    terror={errors.description && true}
                    name='description'
                  />
                  <Controls.ComboSingle
                    name='sens'
                    code='valeur'
                    data={listSens}
                    defaut={defaut}
                    thelperText={errors.sens}
                    terror={errors.sens && true}
                    onChange={(e, value) => {
                      setFieldValue(
                        'sens',
                        value !== null ? value.valeur : value,
                      )
                      if(value.valeur == "Credit"){
                         actualisationCat("C")
                      }
                      if(value.valeur == "Debit"){
                         actualisationCat("D")
                      }
                    }}
                  />
                  <Controls.ComboSingleState
                    name='categorie'
                    code='CODE_CATEGORIE_FLUX'
                    data={listCategorieFlux}
                    defaut={defautCategorieFlux}
                    thelperText={errors.categorie}
                    terror={errors.categorie && true}
                    onChange={(e, value) => {
                      setFieldValue(
                        'categorie',
                        value !== null ? value.ID_CATEGORIE_FLUX : value,
                      )
                    }}
                  />

                  {props.initial_.inc_quota_flux == 0 ? (
                    <Controls.Check
                      checked={false}
                      label='Inclus au Quota '
                      name='incr_quota_flux'
                      onChange={() => {
                        setFieldValue('incr_quota_flux', 1)
                      }}
                    />
                  ) : (
                    <Controls.Check
                      checked={true}
                      label='Inclus au Quota '
                      name='incr_quota_flux'
                      onChange={() => {
                        setFieldValue('incr_quota_flux', 0)
                      }}
                    />
                  )}
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

export default FluxForm
