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
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(0),
  },
  buton: {
    textAlign: 'right',
  },
}))

function PaiementForm(props) {
  const [notify, setNotify] = useState({
    type: '',
    message: '',
  })

  const [openNotif, setOpenNotif] = useState(false)
  const [typeSubmit, setTypeSubmit] = useState({ type: 0, nouveau: 0 })
  const [listCodeBudgetaire, setListCodeBudgetaire] = useState([])
  const [listCompte, setListCompte] = useState([])
  const [listCategorieFlux, setListCategorieFlux] = useState([])
  const [listFlux, setListFlux] = useState([])
  const [listCategoriePaiement, setListCategoriePaiement] = useState([])
  const [typePaie, setTypePaie] = useState("") // type de paiement



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
 // Charger le combo nature
 useEffect(() => {
  fetch(Constantes.URL + '/flux.php?type=R')
    .then((response) => response.json())
    .then((data) => setListFlux(data.infos))
}, [])

 
  const schema = yup.object().shape({
    compte: yup.string().required('Champs obligatoire'),
    budget: yup.string().required('Champs obligatoire'),
    categorie: yup.string().required('Champs obligatoire'),
    montant: yup.number().required('Champs obligatoire'),
    //type: yup.number().required('Champs obligatoire'),
     
  }) 
   




  // Charger le combo budget
  useEffect(() => {
    fetch(Constantes.URL + '/codeBudget.php?type=R')
      .then((response) => response.json())
      .then((data) => setListCodeBudgetaire(data.infos))
  }, [])

    // Charger le combo compte
    useEffect(() => {
      fetch(Constantes.URL + '/compte.php?type=R')
        .then((response) => response.json())
        .then((data) => setListCompte(data.infos))
    }, [])
  
      // Charger le combo categorie flux
  useEffect(() => {
    fetch(Constantes.URL + '/categorie_paiement.php?type=R')
      .then((response) => response.json())
      .then((data) => setListCategoriePaiement(data.infos))
  }, [])

  // Création modification d'engagement
  const editEngagement = async (values) => {
    let donnees = ''
    let lien = 'paiement.php?type=C&jeton='
    if(props.initial_.typaiement == 'partiel'  ){
      lien = 'paiement.php?type=C&jeton='
    }
    if(props.initial_.typaiement == 'fusion'  ){
      lien = 'paiement.php?type=F&jeton='
    }
    // Création d'engagement
    if (props.initial_.id.length > 0) {
      
     // console.log(values)
      const resp = await axios
        .post(lien + props.infoCookie, values)
        .then((response) => {
          console.log(response.data)
          donnees = response
        })
       
        props.handleClose()
       
      
    } else { 
      /* */
    }
    return donnees.data
  }

  const mutationEdit = useMutation(editEngagement, {
    onError: (data) => {
      setNotify({ message: data.message, type: data.reponse })
      setOpenNotif(true)
    },
    onSuccess: (data) => {
      props.queryClient.invalidateQueries('paiements')
      setNotify({ message: data.message, type: data.reponse })
      setOpenNotif(true)
    },
  })

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
            compte: "",
            budget: "",
            categorie: "",
            type: "",
            montant: 0,
          }}
          validationSchema={schema}
          onSubmit={(values, onSubmitProps) => {
            mutationEdit.mutate(values, {
              onSuccess: () => {
                onSubmitProps.resetForm({
                  values: {
                    compte: '',
                    budget: '',
                    categorie: '',
                    nature: '',
                    type: "",
                    montant: 0,
                  },
                })
                // setDefautCodeBudget(null)
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
                value={props.initial_.id}
              />
              <Grid container spacing={2}>


              <Grid item xs={6} sm={6} lg={6}>
                  <Controls.ComboSingleState
                    name='compte'
                    code='CODE_COMPTE'
                    data={listCompte}
                    onChange={(e, value) => {
                      setFieldValue(
                        'compte',
                        value !== null ? value.CODE_COMPTE : value,
                      )
                    }}
                    autoFocus
                    thelperText={errors.compte}
                    terror={errors.compte && true}
                  />
                </Grid>

               

                

                

                

                <Grid item xs={6} sm={6} lg={6}>
                  <Controls.ComboSingleState
                    name='budget'
                    code='CODE_CB'
                    data={listCodeBudgetaire}
                    onChange={(e, value) => {
                      setFieldValue(
                        'budget',
                        value !== null ? value.CODE_CB : value,
                      )
                    }}
                    thelperText={errors.budget}
                    terror={errors.budget && true}
                  />
                </Grid>
                
                <Grid item xs={6} sm={6} lg={6}>
                  <Controls.ComboSingleState
                    name='categorie'
                    code='CODE_CATEGORIE_PAIEMENT'
                    data={listCategoriePaiement}
                    onChange={(e, value) => {
                      setFieldValue(
                        'categorie',
                        value !== null ? value.id : value,
                      )
                    }}
                    thelperText={errors.categorie}
                    terror={errors.categorie && true}
                  />
                </Grid>{' '}
               
                <Grid item xs={6} sm={6} lg={6}>
                  <Controls.ComboSingleState
                    name='nature'
                    code='CODE_FLUX'
                    data={listFlux}
                    onChange={(e, value) => {
                      setFieldValue(
                        'nature',
                        value !== null ? value.CODE_FLUX : value,
                      )
                    }}
                    thelperText={errors.nature}
                    terror={errors.nature && true}
                  />
                </Grid>{' '}
                
                 <Grid item xs={6} sm={6} lg={6}>
                {
                  props.initial_.typaiement !== "fusion" && 
                <RadioGroup aria-label="type" name="type" value={values.type}  onChange={(e, value) => {
                      setFieldValue(
                        'type',
                        value !== null ? value : "",
                      )
                      setTypePaie(value)
                      
                    }}>
              
                  <FormControlLabel value="Pourcentage" control={<Radio />} label="Partiel Pourcentage" />
                  <FormControlLabel value="Tranche" control={<Radio />} label="Partiel Tranche" />
                  <FormControlLabel value="Total" control={<Radio />} label="Total" />
       
                </RadioGroup>
                }  
                
                  </Grid>
                <Grid item xs={6} sm={6} lg={6}>
                  {   props.initial_.typaiement !== "fusion" ?
                    typePaie == "Pourcentage" ?
                    <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='valeur'
                    label='Pourcentage'
                    type='number'
                    thelperText={errors.pourcentage}
                    terror={errors.pourcentage && true}
                    name='montant'
                  />
                  :
                    typePaie == "Tranche" ?
                    <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='valeur'
                    label='Montant'
                    type='number'
                    thelperText={errors.pourcentage}
                    terror={errors.pourcentage && true}
                    name='montant'
                  />
                  :
                    typePaie == "" &&
                    <></>

                    : 
                    <Grid item xs={6} sm={6} lg={6}>
                    Montant à payer:  {props.sumMontant}
                    </Grid>
                   

                  }
                  
                  </Grid>
                
              </Grid>
             
              <div className={classes.buton}>
                <Controls.ButtonLabel
                  color='primary'
                  onClick={() => setTypeSubmit({ type: 1 })}>
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

export default PaiementForm
