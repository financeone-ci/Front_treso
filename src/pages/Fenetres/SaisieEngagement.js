/** @format */
import React, { useEffect, useState } from 'react'
import PageHeader from '../../composants/PageHeader'
import TableauBasic from '../../composants/tableaux/TableauBasic'
import { Paper, Grid } from '@material-ui/core'
import Controls from '../../composants/controls/Controls'
import Constantes from '../../api/Constantes'
import BarreButtons from '../../composants/BarreButtons'
import Buttons from '../../composants/controls/Buttons'
import AddIcon from '@material-ui/icons/Add'
import { makeStyles } from '@material-ui/core/styles'
import SaisieEngagementForm from './SaisieEngagementForm'
import CreateIcon from '@material-ui/icons/Create'
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep'
import IconButton from '@material-ui/core/IconButton'
import ModalOuiNon from '../../composants/controls/modal/ModalOuiNon'
import axios from '../../api/axios'
import { Notification } from '../../composants/controls/toast/MyToast'
import CryptFunc from '../../functions/CryptFunc'
import GroupBy from '../../functions/GroupBy'
import SearchIcon from '@material-ui/icons/Search'
import { Formik, Form } from 'formik'
import * as yup from 'yup'
import { ReactQueryDevtools } from 'react-query/devtools'
import { useMutation, useQuery, useQueryClient } from 'react-query'

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(0.5),
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
}))

function SaisieEngagement(props) {
  // Date de selection
  let today = new Date()
  let today2 = new Date()
  let dd = today.getDate()

  let mm = today.getMonth() + 1

  const yyyy = today.getFullYear()
  if (dd < 10) {
    dd = `0${dd}`
  }

  if (mm < 10) {
    mm = `0${mm}`
  }
  today = `${yyyy}-${mm}-${dd}`
  today2 = `${yyyy}-${mm}-${dd - 1}`

  const [notify, setNotify] = useState({
    type: '',
    message: '',
  })

  // Lignes du tableau
  const [initial, setInitial] = useState({ debut: today, fin: today })

  ///// Chargement des engagements par période
  const fetchEngagements = async () => {
    const response = await fetch(
      Constantes.URL +
        '/engagements.php?type=R&debut=' +
        initial.debut +
        '&fin=' +
        initial.fin,
    )
    return response.json()
  }
  const { data, status } = useQuery(['engagements', initial], fetchEngagements)

  // supprimer des engagements
  const queryClient = useQueryClient()

  const supprEngagement = async () => {
    const response = await fetch(
      Constantes.URL + `/engagements.php?type=D&id=${listId}`,
    )
    return response.json()
  }
  const mutationDelete = useMutation(supprEngagement, {
    onError: (data) => {
      setOpens_(false)
      setNotify({ message: data.message, type: data.reponse })
      setOpenNotif(true)
    },
    onSuccess: (data) => {
      setNotify({ message: data.message, type: data.reponse })
      queryClient.invalidateQueries('engagements')
      setOpens_(false)
      setOpenNotif(true)
    },
  })

  const [openSaisieEngagement, setOpenSaisieEngagement] = useState(false)

  // valeurs initiales
  const [openNotif, setOpenNotif] = useState(false)

  const [opens_, setOpens_] = React.useState(false) // statut du modal suppression
  const [listId, setListId] = React.useState('') // idprofil à editer ou supprimer?
  const [init, setInit] = useState({
    id: 0,
    num_engagement: '',
    beneficiaire: '',
    ref_beneficiaire: '',
    montant: '',
    num_bon: '',
    motif: '',
    type_import: '',
    user_import: '',
    date_echeance: '',
    id_statut_engagement: 1,
    code_budget: '',
    date_importation: '',
    idimport: 0,
    date_engagement: '',
    ref_marche: '',
    retenue: '',
    taxe: '',
  })

  const handleCloseModal_ = () => {
    setOpens_(false)
  }

  const notificationLanceur = (type, message) => {
    setNotify({ message: message, type: type })
     setOpenNotif(true)
  }

  // Entetes du tableau
  const enteteCol = [
    {
      field: 'id',
      hide: true,
      editable: false,
      headerName: 'id',
      width: 20,
      columnResizeIcon: true,
    },
    {
      field: 'NUM_ENGAGEMENT',
      hide: false,
      editable: false,
      headerName: 'N° Engagement',
      width: 200,
      columnResizeIcon: true,
    },
    {
      field: 'BENEFICIAIRE',
      hide: false,
      editable: false,
      headerName: 'Bénéficiaire',
      width: 300,
      columnResizeIcon: true,
    },

    {
      field: 'MONTANT',
      hide: false,
      editable: false,
      headerName: 'Montant',
      width: 150,
      columnResizeIcon: true,
      type: 'number',
      valueFormatter: (params) => {
        const valueFormatted = Number(params.value).toLocaleString()
        //  const valueFormatted = new Intl.NumberFormat().format(params.value)
        return `${valueFormatted}`
      },
      valueParser: (value) => Number(value),
    },
    {
      field: 'NUM_BON',
      hide: false,
      editable: false,
      headerName: 'N° Bon',
      width: 100,
      columnResizeIcon: true,
    },
    {
      field: 'MOTIF',
      hide: false,
      editable: false,
      headerName: 'Motif',
      width: 100,
      columnResizeIcon: true,
    },
    {
      field: 'TYPE_IMPORT',
      hide: true,
      editable: false,
      headerName: 'Type Importation',
      width: 100,
      columnResizeIcon: true,
    },
    {
      field: 'USER_IMPORT',
      hide: false,
      editable: false,
      headerName: 'Utilisateur',
      width: 100,
      columnResizeIcon: true,
    },
    {
      field: 'DATE_ECHEANCE',
      hide: false,
      editable: false,
      headerName: 'Date échéance',
      width: 100,
      columnResizeIcon: true,
    },
    {
      field: 'ID_STATUT_ENGAGEMENT',
      hide: true,
      editable: false,
      headerName: 'Status engagement',
      width: 100,
      columnResizeIcon: true,
    },
    {
      field: 'CODE_BUDGET',
      hide: false,
      editable: false,
      headerName: 'Code Budget',
      width: 100,
      columnResizeIcon: true,
    },
    {
      field: 'DATE_IMPORTATION',
      hide: true,
      editable: false,
      headerName: 'Date Importation',
      width: 100,
      columnResizeIcon: true,
    },
    {
      field: 'IDIMPORT',
      hide: true,
      editable: false,
      headerName: 'id Import',
      width: 100,
      columnResizeIcon: true,
    },
    {
      field: 'DATE_ENGAGEMENT',
      hide: false,
      editable: false,
      headerName: 'Date engagement',
      width: 100,
      columnResizeIcon: true,
    },
    {
      field: 'REF_MARCHE',
      hide: false,
      editable: false,
      headerName: 'Référence Marché',
      width: 100,
      columnResizeIcon: true,
    },
    {
      field: 'RETENUE',
      hide: false,
      editable: false,
      headerName: 'Retenue',
      width: 100,
      columnResizeIcon: true,
    },
    {
      field: 'TAXE',
      hide: false,
      editable: false,
      headerName: 'Taxe',
      width: 100,
      columnResizeIcon: true,
    },
   

   
    {
      field: 'Actions',
      width: 125,
      align: 'center',
      renderCell: (e) => (
        <>
          <IconButton
            aria-label='update'
            size='small'
            onClick={() => {
              e.row.ID_STATUT_ENGAGEMENT < 2 ?

              DroitsUser.droits_modifier == 1
                ? handleClickOpenSaisieEngagement(
                    e.row.id,
                    e.row.NUM_ENGAGEMENT,
                    e.row.BENEFICIAIRE,
                    e.row.REF_BENEFICIAIRE,
                    e.row.MONTANT,
                    e.row.NUM_BON,
                    e.row.MOTIF,
                    e.row.TYPE_IMPORT,
                    e.row.USER_IMPORT,
                    e.row.DATE_ECHEANCE,
                    e.row.ID_STATUT_ENGAGEMENT,
                    e.row.CODE_BUDGET,
                    e.row.DATE_IMPORTATION,
                    e.row.IDIMPORT,
                    e.row.DATE_ENGAGEMENT,
                    e.row.REF_MARCHE,
                    e.row.RETENUE,
                    e.row.TAXE,
                  )
                : noRightFunc()
                :
               notificationLanceur('error', 'Engagement en cours \r de règlement')
                  
                
            }}>
            <CreateIcon
              fontSize='inherit'
              color='default'
              className='CreateIcon'
            />
          </IconButton>
        </>
      ),
    },
  ]

  // recuperation des Structures

  const MettreAJourTableau = (values) => {
    setInitial({ debut: values.debut, fin: values.fin })
  }

  // Defiition des saisies
  const schema = yup.object().shape({
    debut: yup.date('Date invalide').max(yup.ref('fin'), 'Période invalide'),
    fin: yup
      .date('Date invalide')
      .min(yup.ref('debut'), 'Période invalide')
      .max(new Date(), 'Période invalide'),
  })

  //Ouverture modal Structure
  const handleClickOpenSaisieEngagement = (
    id = 0,
    num_engagement = '',
    beneficiaire = '',
    ref_beneficiaire = '',
    montant = '',
    num_bon = '',
    motif = '',
    type_import = '',
    user_import = '',
    date_echeance = '',
    id_statut_engagement = 1,
    code_budget = '',
    date_importation = '',
    idimport = 0,
    date_engagement = '',
    ref_marche = '',
    retenue = '',
    taxe = '',
  ) => {
    setInit({
      id: id,
      num_engagement: num_engagement,
      beneficiaire: beneficiaire,
      ref_beneficiaire: ref_beneficiaire,
      montant: montant,
      num_bon: num_bon,
      motif: motif,
      type_import: type_import,
      user_import: user_import,
      date_echeance: date_echeance,
      id_statut_engagement: id_statut_engagement,
      code_budget: code_budget,
      date_importation: date_importation,
      idimport: idimport,
      date_engagement: date_engagement,
      ref_marche: ref_marche,
      retenue: retenue,
      taxe: taxe,
    })

    setOpenSaisieEngagement(true)
  }
  const handleCloseSaisieEngagement = () => {
    setOpenSaisieEngagement(false)
  }

  ////////////// Droits de l'utilisateur
  var MachaineDeCrypte = CryptFunc(localStorage.getItem('_Drt'), 0)
  const leMenu = GroupBy(MachaineDeCrypte)
  const DroitsUser = leMenu.group['Intégrations'][1]

  // fonction pas assez de droits
  const noRightFunc = () => {
    setNotify({
      type: 'error',
      message: 'Droits insuffisants',
    })

    setOpenNotif(true)
  }

  const classes = useStyles()

  return (
    <>
      <PageHeader icone={props.icone} titrePage={props.titre} />

      <BarreButtons
        buttons={
          <>
            <div style={{ textAlign: 'left' }}>
              <Buttons
                variant='contained'
                color='primary'
                size='small'
                onClick={() => {
                  DroitsUser.droits_creer == 1
                    ? handleClickOpenSaisieEngagement()
                    : noRightFunc()
                }}
                className={classes.button}
                startIcon={<AddIcon />}>
                Créer
              </Buttons>

              <Buttons
                disabled={listId.length === 0}
                variant='contained'
                color='primary'
                size='small'
                onClick={() => {
                  DroitsUser.droits_supprimer == 1
                    ? setOpens_(true)
                    : noRightFunc()
                }}
                className={classes.button}
                startIcon={
                  <DeleteSweepIcon
                    color='default'
                    fontSize='inherit'
                    className='DeleteSweepIcon'
                  />
                }>
                Supprimer
              </Buttons>

              <Formik
                noValidate
                initialValues={{
                  debut: initial.debut,
                  fin: initial.fin,
                }}
                validationSchema={schema}
                onSubmit={(values, onSubmitProps) => {
                  MettreAJourTableau(values)
                }}>
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
                }) => (
                  <div style={{ textAlign: 'right' }}>
                    <Form>
                      <Controls.TextInput
                        margin='normal'
                        id='debut'
                        type='date'
                        helperText={errors.debut}
                        error={errors.debut && true}
                        size='small'
                        name='debut'
                      />
                      <Controls.TextInput
                        margin='normal'
                        id='fin'
                        type='date'
                        helperText={errors.fin}
                        error={errors.fin && true}
                        name='fin'
                        style={{ marginLeft: '5px' }}
                      />
                      <Buttons
                        style={{ marginTop: '16px' }}
                        variant='contained'
                        color='default'
                        size='large'
                        className={classes.button}
                        startIcon={<SearchIcon fontSize='large' />}></Buttons>
                    </Form>
                  </div>
                )}
              </Formik>
            </div>
          </>
        }
      />

      <Grid container>
        <SaisieEngagementForm
          queryClient={queryClient}
          initial_={init}
          handleClose={handleCloseSaisieEngagement}
          open={openSaisieEngagement}
          titreModal={
            init.id == ''
              ? 'Nouvel Engagement'
              : 'Modifier Engagement: ' + init.num_engagement
          }
          infoCookie={props.infoCookie}
        />
      </Grid>

      {status === 'loading' ? (
        <Paper elevation={0} className='paperLoad'>
          <Controls.SpinnerBase />
        </Paper>
      ) : (
        <>
          <Grid container>
            <Grid item xs={12}>
              <TableauBasic
                style={{ height: 800, width: '100%' }}
                disableSelectionOnClick={true}
                col={enteteCol}
                donnees={data.infos}
                onSelectionModelChange={(e) => {
                  setListId(e)
                }}
                onRowClick={(e) => {}}
                checkboxSelection={true}
                pagination
                pageSize={150}
              />
            </Grid>
          </Grid>
        </>
      )}

      <ModalOuiNon
        open={opens_}
        onClose={handleCloseModal_}
        titre={'Supprimer ?'}
        message={'Voulez vous Supprimer ce(s) Saisie(s) ?'}
        non='Annuler'
        oui='Oui'
        deconnect={() => mutationDelete.mutate()}
      />

      <Notification
        type={notify.type}
        message={notify.message}
        open={openNotif}
        setOpen={setOpenNotif}
      />
    </>
  )
}

export default SaisieEngagement
