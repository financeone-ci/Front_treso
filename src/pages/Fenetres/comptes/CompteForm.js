/** @format */

import React, { useState, useEffect } from 'react'
import * as yup from 'yup'
import axios from '../../../api/axios'
import ModalForm from '../../../composants/controls/modal/ModalForm'
import Controls from '../../../composants/controls/Controls'
import ReadCookie from '../../../functions/ReadCookie'
import { makeStyles } from '@material-ui/core'
import { Formik, Form, Field, useField, ErrorMessage } from 'formik'
import { Grid } from '@material-ui/core'
import Constantes from '../../../api/Constantes'
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

function CompteForm(props) {
  // Stats
  const [typeSubmit, setTypeSubmit] = useState(1)
  const [defaut, setDefaut] = useState({})
  const [defautSociete, setDefautSociete] = useState({})
  const [defautDevise, setDefautDevise] = useState({})
  const [civilite, setCivilite] = useState([
    { civ: 'Monsieur' },
    { civ: 'Madame' },
    { civ: 'Mademoiselle' },
  ])
  const [openNotif, setOpenNotif] = useState(false)
  const [listBank, setListBank] = useState([])
  const [listDevise, setListDevise] = useState([])

  // Variables
  // lire les infos du cookie
  const cookieInfo = ReadCookie()

  // Schema de validation du formulaire
  const schema = yup.object().shape({
    code: yup.string().required('Code obligatoire'),
    solde_i: yup.number().required('Solde non initialisé'),
    rib: yup.string().required('RIB obligatoire'),
    libelle: yup.string().required('Description obligatoire'),
    banque: yup.string().required('Banque obligatoire'),
    tel: yup.number('N° de tel invalide'),
    email: yup.string().email('adresse mail invalide'),
    civilite: yup.string().required('Civilité obligatoire'),
    devise: yup.string().required('devise obligatoire'),
  })

  const fetchDevises = async () => {
    const headers = {
      Authorization: cookieInfo,
    }
    let response = await axios('devises/ReadDevise.php', {
      headers,
    })
    return response.data
  }
  const VueData = useQuery(['listedevise'], fetchDevises, {
    cacheTime: 1 * 60 * 1000,
  })

  const submitCompte = async (values) => {
    let response = ''
    const headers = {
      Authorization: cookieInfo,
    }
    if (values.id === '') {
      // Création societe
      response = await axios.post(
        'comptes/CreateCompte.php',
        { values },
        { headers },
      )
    } else {
      // Modification societe
      response = await axios.post(
        `comptes/UpdateCompte.php?id=${values.id}`,
        { values },
        { headers },
      )
    }
    typeSubmit === 1 && props.handleClose()

    return response.data
  }

  // Création d'une societe
  const compte = useMutation(submitCompte, {
    onSuccess: (data) => {
      props.queryClient.invalidateQueries('listecompte')
      props.setNotify({
        type: data.reponse,
        message: data.message,
      })
      props.setOpenNotif(true)
    },
    onError: () => {
      props.setNotify({
        message: 'Service indisponible',
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
        <Formik
          noValidate
          initialValues={{
            id: props.initialModal.id,
            code: props.initialModal.code,
            solde_i: props.initialModal.solde,
            comptable: props.initialModal.comptable,
            rib: props.initialModal.rib,
            libelle: props.initialModal.libelle,
            gestionnaire: props.initialModal.gestionnaire,
            civilite: props.initialModal.civilite,
            service: props.initialModal.service,
            tel: props.initialModal.tel,
            email: props.initialModal.email,
            banque: props.initialModal.banque,
            societe: props.initialModal.societe,
            devise: props.initialModal.devise,
          }}
          validationSchema={schema}
          onSubmit={(values, onSubmitProps) => {
            compte.mutate(values, {
              onSuccess: (data) => {
                data.reponse == 'success' && onSubmitProps.resetForm()
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
                    label='Code'
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
                    id='solde_i'
                    label='Solde initial'
                    type='text'
                    thelperText={errors.solde_i}
                    terror={errors.solde_i && true}
                    name='solde_i'
                    style={{ textAlign: 'right' }}
                  />
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='comptable'
                    label='Compte Comptable'
                    type='text'
                    thelperText={errors.comptable}
                    terror={errors.comptable && true}
                    name='comptable'
                  />
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='email'
                    label='Email'
                    type='email'
                    thelperText={errors.email}
                    terror={errors.email && true}
                    name='email'
                  />
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='rib'
                    label='RIB'
                    type='text'
                    thelperText={errors.rib}
                    terror={errors.rib && true}
                    name='rib'
                  />
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='libelle'
                    label='Libellé'
                    type='text'
                    thelperText={errors.libelle}
                    terror={errors.libelle && true}
                    name='libelle'
                  />
                </Grid>
                <Grid item xs={6} sm={6} lg={6}>
                  {/* <Controls.ComboSingle
                    Authorization={cookieInfo}
                    api={ApiBanq}
                    useQuery={Query}
                    name='banque'
                    code='CODE_BANQUE'
                    data={listBank}
                    defaut={defaut}
                    onChange={(e, value) => {
                      setFieldValue('banque', value !== null ? value.id : value)
                    }}
                    thelperText={errors.banque}
                    terror={errors.banque && true}
                  /> */}
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='gestionnaire'
                    label='gestionnaire'
                    type='text'
                    thelperText={errors.gestionnaire}
                    terror={errors.gestionnaire && true}
                    name='gestionnaire'
                  />
                  <Controls.ComboSingle
                    name='civilite'
                    code='civ'
                    data={civilite}
                    defaut={civilite}
                    onChange={(e, value) => {
                      setFieldValue(
                        'civilite',
                        value !== null ? value.civ : value,
                      )
                    }}
                    thelperText={errors.civilite}
                    terror={errors.civilite && true}
                  />
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='service'
                    label='service'
                    type='text'
                    thelperText={errors.service}
                    terror={errors.service && true}
                    name='service'
                  />
                  <Controls.TextInput
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='tel'
                    label='tel'
                    type='text'
                    thelperText={errors.tel}
                    terror={errors.tel && true}
                    name='tel'
                  />
                  <Controls.ComboSingle
                    fetchData={fetchDevises}
                    name='devise'
                    Authorization={cookieInfo}
                    code='CODE_DEVISE'
                    data={VueData.data.infos}
                    defaut={defautDevise}
                    onChange={(e, value) => {
                      setFieldValue('devise', value !== null ? value.id : value)
                    }}
                    thelperText={errors.devise}
                    terror={errors.devise && true}
                  />
                </Grid>{' '}
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

export default CompteForm
