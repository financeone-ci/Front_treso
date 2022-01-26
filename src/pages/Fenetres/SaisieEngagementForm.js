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

function SaisieEngagementForm(props) {
  const [notify, setNotify] = useState({
    type: '',
    message: '',
  })

  const [defautCodeBudget, setDefautCodeBudget] = useState({})
  const [loading, setLoading] = useState(false)
  const [openNotif, setOpenNotif] = useState(false)
  const [listSaisieEngagement, setListSaisieEngagement] = useState([])
  const [typeSubmit, setTypeSubmit] = useState({ type: 0, nouveau: 0 })
  const [listCodeBudgetaire, setListCodeBudgetaire] = useState([])

  const schema = yup.object().shape({
    beneficiaire: yup.string().required('Champs obligatoire'),
    montant: yup.string().required('Champs obligatoire'),
    motif: yup.string().required('Champs obligatoire'),
    num_engagement: yup.string().nullable(''),
    num_bon: yup.string().nullable(''),
    ref_beneficiaire: yup.string().nullable(''),
    date_echeance: yup.string().nullable(''),
    code_budget: yup.string().nullable(''),
    ref_marche: yup.string().nullable(''),
    retenue: yup.string().nullable(''),
    taxe: yup.string().nullable(''),
    date_engagement: yup.string().nullable(''),
  })

  // Charger le combo budget
  useEffect(() => {
    fetch(Constantes.URL + '/codeBudget.php?type=R')
      .then((response) => response.json())
      .then((data) => setListCodeBudgetaire(data.infos))
  }, [])

  // REMPLIR LA COMBO BUDGET
  useEffect(() => {
    if (props.initial_.id != 0) {
      listCodeBudgetaire.map((item) => {
        if (item.id == props.initial_.code_budget) {
          setDefautCodeBudget(item)
        }
      })
    } else {
      setDefautCodeBudget(null)
    }
  }, [props])

  // Création modification d'engagement
  const editEngagement = async (values) => {
    let donnees = ''
    // Création d'engagement
    if (props.initial_.id == 0) {
      const resp = await axios
        .post('engagements.php?type=C&jeton=' + props.infoCookie, values)
        .then((response) => {
          donnees = response
        })
      if (typeSubmit.type == 1) {
        props.handleClose()
      }
    } else {
      // Modification d'engagement
      const resp = await axios
        .post(
          'engagements.php?type=U&id=' +
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

  const mutationEdit = useMutation(editEngagement, {
    onError: () => {
      setNotify({
        message: 'Connexion au service impossible',
        type: 'error',
      })
      setOpenNotif(true)
    },
    onSuccess: (data) => {
      props.queryClient.invalidateQueries('engagements')
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
        {mutationEdit.isLoading && <SpinnerForm />}

        <Formik
          noValidate
          initialValues={{
            id: props.initial_.id,
            beneficiaire: props.initial_.beneficiaire,
            montant: props.initial_.montant,
            motif: props.initial_.motif,
            num_engagement: props.initial_.num_engagement,
            num_bon: props.initial_.num_bon,
            ref_beneficiaire: props.initial_.ref_beneficiaire,
            date_echeance: props.initial_.date_echeance,
            code_budget: props.initial_.code_budget,
            ref_marche: props.initial_.ref_marche,
            retenue: props.initial_.retenue,
            taxe: props.initial_.taxe,
            date_engagement: props.initial_.date_engagement,
          }}
          validationSchema={schema}
          onSubmit={(values, onSubmitProps) => {
            mutationEdit.mutate(values, {
              onSuccess: () => {
                onSubmitProps.resetForm({
                  values: {
                    beneficiaire: '',
                    montant: '',
                    motif: '',
                    num_engagement: '',
                    num_bon: '',
                    ref_beneficiaire: '',
                    date_echeance: '',
                    code_budget: values.code_budget,
                    ref_marche: '',
                    retenue: '',
                    taxe: '',
                    date_engagement: '',
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
                <Grid item xs={6} sm={6} lg={6}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='beneficiaire'
                    label='Bénéficiaire'
                    type='text'
                    thelperText={errors.beneficiaire}
                    terror={errors.beneficiaire && true}
                    name='beneficiaire'
                    autoFocus
                  />
                </Grid>
                <Grid item xs={6} sm={6} lg={6}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='ref_beneficiaire'
                    label='Référence bénéficiaire'
                    type='text'
                    thelperText={errors.ref_beneficiaire}
                    terror={errors.ref_beneficiaire && true}
                    name='ref_beneficiaire'
                  />
                </Grid>
                <Grid item xs={6} sm={4} lg={4}>
                  <Controls.ComboSingleState
                    name='code_budget'
                    code='CODE_CB'
                    data={listCodeBudgetaire}
                    defaut={defautCodeBudget}
                    onChange={(e, value) => {
                      setFieldValue(
                        'code_budget',
                        value !== null ? value.id : value,
                      )
                    }}
                    thelperText={errors.code_budget}
                    terror={errors.code_budget && true}
                  />
                </Grid>
                <Grid item xs={6} sm={4} lg={4}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='motif'
                    label='Motif'
                    type='text'
                    thelperText={errors.motif}
                    terror={errors.motif && true}
                    name='motif'
                  />
                </Grid>
                <Grid item xs={6} sm={4} lg={4}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='taxe'
                    label='Taxe'
                    type='text'
                    thelperText={errors.taxe}
                    terror={errors.taxe && true}
                    name='taxe'
                  />
                </Grid>
                <Grid item xs={6} sm={6} lg={6}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='num_engagement'
                    label='N engagement'
                    type='text'
                    thelperText={errors.num_engagement}
                    terror={errors.num_engagement && true}
                    name='num_engagement'
                  />
                </Grid>
                <Grid item xs={6} sm={6} lg={6}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='date_engagement'
                    label=''
                    type='date'
                    thelperText={errors.date_engagement}
                    terror={errors.date_engagement && true}
                    name='date_engagement'
                    helperText='Date Engagement'
                  />
                </Grid>
                <Grid item xs={6} sm={6} lg={6}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='montant'
                    label='Montant'
                    type='text'
                    thelperText={errors.montant}
                    terror={errors.montant && true}
                    name='montant'
                  />
                </Grid>
                <Grid item xs={6} sm={6} lg={6}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='date_echeance'
                    label=''
                    type='date'
                    thelperText=''
                    terror={errors.date_echeance && true}
                    name='date_echeance'
                    helperText='Date échéance'
                  />
                </Grid>
                <Grid item xs={6} sm={4} lg={4}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='num_bon'
                    label='N bon'
                    type='text'
                    thelperText={errors.num_bon}
                    terror={errors.num_bon && true}
                    name='num_bon'
                  />
                </Grid>
                <Grid item xs={6} sm={4} lg={4}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='ref_marche'
                    label='Référence marché'
                    type='text'
                    thelperText={errors.ref_marche}
                    terror={errors.ref_marche && true}
                    name='ref_marche'
                  />
                </Grid>
                <Grid item xs={6} sm={4} lg={4}>
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='retenue'
                    label='Retenue'
                    type='text'
                    thelperText={errors.retenue}
                    terror={errors.retenue && true}
                    name='retenue'
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

export default SaisieEngagementForm
