/** @format */

import React, { useState, useEffect, useCallback } from 'react'
import PageHeader from '../../composants/PageHeader'
import TableauBasic from '../../composants/tableaux/TableauBasic'
import { Paper, Grid, FormControlLabel, Checkbox } from '@material-ui/core'
import Controls from '../../composants/controls/Controls'
import Constantes from '../../api/Constantes'
import BarreButtons from '../../composants/BarreButtons'
import Buttons from '../../composants/controls/Buttons'
import AddIcon from '@material-ui/icons/Add'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import { green } from '@material-ui/core/colors'
import CreateIcon from '@material-ui/icons/Create'
import IconButton from '@material-ui/core/IconButton'
import ModalOuiNon from '../../composants/controls/modal/ModalOuiNon'
import axios from '../../api/axios'
import { Notification } from '../../composants/controls/toast/MyToast'
import CryptFunc from '../../functions/CryptFunc'
import GroupBy from '../../functions/GroupBy'
import ReadCookie from '../../functions/ReadCookie'
import SearchIcon from '@material-ui/icons/Search'
import { Formik, Form } from 'formik'
import * as yup from 'yup'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import RetraitForm from './RetraitForm'
import { get } from 'lodash'

// Style
const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(0.5),
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
}))
// Style chekcbox
const GreenCheckbox = withStyles({
  root: {
    color: green[800],
    '&$checked': {
      color: green[600],
    },
  },
  checked: {},
})((props) => <Checkbox color='default' {...props} />)

function VueRetrais(props) {
  // Date de selection
  let debut = new Date()
  let fin = new Date()
  let jour = debut.getDate()
  let mois = debut.getMonth() + 1
  const annee = debut.getFullYear()

  if (jour < 10) {
    jour = `0${jour}`
  }

  if (mois < 10) {
    mois = `0${mois}`
  }
  debut = `${annee}-${mois}-${jour}`
  fin = `${annee}-${mois}-${jour}`

  ////////////// Droits de l'utilisateur
  var MachaineDeCrypte = CryptFunc(localStorage.getItem('_Drt'), 0)
  const leMenu = GroupBy(MachaineDeCrypte)
  const DroitsUser = leMenu.group['Paiements'][4]
  // droits insuffisants
  const noRightFunc = () => {
    setNotify({
      type: 'error',
      message: 'Droits insuffisants',
    })
    setOpenNotif(true)
  }

  // lire les infos du cookie
  const cookieInfo = ReadCookie()
  // Stats
  const [initial, setInitial] = useState({
    debut: debut,
    fin: fin,
    etat: false,
  })
  const [initialModal, setInitialModal] = useState({
    beneficiaire: '',
    identite: '',
  })
  const [notify, setNotify] = useState({
    type: '',
    message: '',
  })
  const [openNotif, setOpenNotif] = useState(false)
  const [openModal, setOpenModal] = useState(false) // statut du modal suppression
  const [listId, setListId] = useState('') // idprofil à editer ou supprimer?
  const [checkedG, setCheckedG] = useState(false)
  const [idem, setIdem] = useState(false)
  const [statevuePaiements, setStatevuePaiements] = useState([])

  // Reherche des écritures par date
  const MettreAJourTableau = (values) => {
    setInitial({ debut: values.debut, fin: values.fin, etat: checkedG })
  }

  // état coche tableau
  const handleCheck = (e) => {
    setCheckedG(!checkedG)
  }

  // Fermeture du modal
  const handleCloseModal = () => {
    setOpenModal(false)
  }
  // ouverture du modal
  const handleOpenModal = () => {
    setInitialModal({
      beneficiaire: '',
      identite: '',
    })
    setOpenModal(true)
  }

  const [idPaiement, setIdpaiement] = useState(0)
  const handleIdPaiement = (idpaiement) => {
    setIdpaiement(idpaiement)
  }

  // Récupérer les information d'un paiement pour modification
  const handleClickOpenMesure = useCallback(async (pid) => {
    const headers = {
      Authorization: cookieInfo,
    }
    let response = await axios(`VuePaiements.php?id=${pid}`, {
      headers,
    })
    setInitialModal({
      beneficiaire: response.data.infos.BENEF_REMISE,
      identite: response.data.infos.REF_REMISE,
    })
    setStatevuePaiements(response.data.infos.file)
    setOpenModal(true)
  }, [])

  // Chargement des paiements à retirer
  const fetchVueRetraits = async () => {
    const response = await fetch(
      Constantes.URL +
        `VueRetraits.php?debut=${initial.debut}&fin=${initial.fin}&etat=${initial.etat}`,
    )
    return response.json()
  }
  const VueRetrait = useQuery(['vueretraits', initial], fetchVueRetraits)

  // Shhéma de valiation des champs de saisie
  const schema = yup.object().shape({
    debut: yup.date('Date invalide').max(yup.ref('fin'), 'Période invalide'),
    fin: yup
      .date('Date invalide')
      .min(yup.ref('debut'), 'Période invalide')
      .max(new Date(), 'Période invalide'),
  })

  // Controle de l'unicité du bénéficiaire
  useEffect(() => {
    let dataT = []
    // remplir la table de vérification
    VueRetrait.status == 'success' &&
      VueRetrait.data.infos.map((item) => {
        listId.includes(item.id) && dataT.push(item.BENEFICIAIRE_PAIEMENT)
      })
    // Vérifier si tous les éléments du tableau sont identiques
    dataT.every((val, i, arr) => val === arr[0]) === true
      ? setIdem(true)
      : setIdem(false)
  }, [listId])

  // Mise à jour de la liste des retraits après mutation
  const queryClient = useQueryClient()

  // Entetes du tableau
  const enteteCol = [
    {
      field: 'id',
      hide: true,
      editable: false,
      headerName: 'id',
      width: 10,
      columnResizeIcon: true,
    },
    {
      field: 'BENEFICIAIRE_PAIEMENT',
      hide: false,
      editable: false,
      headerName: 'Bénéficiaire',
      width: 300,
      columnResizeIcon: true,
    },
    {
      field: 'MONTANT_PAIEMENT',
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
      field: 'MOTIF_PAIEMENT',
      hide: false,
      editable: false,
      headerName: 'Motif',
      width: 100,
      columnResizeIcon: true,
    },
    {
      field: 'DATE_IMP',
      hide: false,
      editable: false,
      headerName: 'Date impression',
      width: 100,
      columnResizeIcon: true,
    },
    {
      field: 'DATE_REMISE',
      hide: false,
      editable: false,
      headerName: 'Date retrait',
      width: 100,
      columnResizeIcon: true,
    },
    {
      field: 'CODE_NATURE',
      hide: true,
      editable: false,
      headerName: 'Nature',
      width: 100,
      columnResizeIcon: true,
    },
    {
      field: 'CODE_COMPTE',
      hide: false,
      editable: false,
      headerName: 'Compte',
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
      field: 'CODE_CATEGORIE_PAIEMENT',
      hide: true,
      editable: false,
      headerName: 'Catégorie',
      width: 100,
      columnResizeIcon: true,
    },
    {
      field: 'Actions',
      width: 125,
      align: 'center',
      renderCell: (e) => (
        <>
          {checkedG && (
            <IconButton
              aria-label='update'
              size='small'
              onClick={() => {
                handleClickOpenMesure(e.row.id)
                //  VuePaiement.refetch()
              }}>
              <CreateIcon
                fontSize='inherit'
                color='default'
                className='CreateIcon'
              />
            </IconButton>
          )}
        </>
      ),
    },
  ]

  // Classe de style
  const classes = new useStyles()

  return (
    <>
      <PageHeader icone={props.icone} titrePage={props.titre} />
      <BarreButtons
        buttons={
          <>
            <Buttons
              variant='contained'
              color='primary'
              size='small'
              onClick={() => {
                DroitsUser.droits_creer == 1 ? handleOpenModal() : noRightFunc()
              }}
              className={classes.button}
              startIcon={<AddIcon />}
              disabled={listId.length > 0 && idem === true ? false : true}>
              Enregistrer
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
                <Form style={{ textAlign: 'right', marginTop: '-50px' }}>
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
                  <FormControlLabel
                    control={
                      <GreenCheckbox
                        id='etat'
                        checked={checkedG}
                        onChange={handleCheck}
                        name='etat'
                      />
                    }
                    label='Retirés'
                    style={{ marginLeft: '2px', paddingTop: '10px' }}
                  />
                  <Buttons
                    style={{ marginTop: '16px' }}
                    variant='contained'
                    color='default'
                    size='large'
                    className={classes.button}
                    startIcon={<SearchIcon fontSize='large' />}></Buttons>
                </Form>
              )}
            </Formik>
          </>
        }
      />

      {VueRetrait.status === 'loading' ? (
        <Paper elevation={0} className='paperLoad'>
          <Controls.SpinnerBase />
        </Paper>
      ) : (
        <>
          <Grid container>
            <Grid item xs={12}>
              <TableauBasic
                disableSelectionOnClick={true}
                col={enteteCol}
                donnees={VueRetrait.data.infos}
                onSelectionModelChange={(e) => {
                  setListId(e)
                }}
                checkboxSelection={true}
                pagination
                pageSize={150}
              />
            </Grid>
          </Grid>
          <RetraitForm
            openModal={openModal}
            handleClose={handleCloseModal}
            initialModal={initialModal}
            queryClient={queryClient}
            listID={listId}
            infoCookie={props.infoCookie}
            files={statevuePaiements}
          />
          <Notification
            type={notify.type}
            message={notify.message}
            open={openNotif}
            setOpen={setOpenNotif}
          />
        </>
      )}
    </>
  )
}

export default VueRetrais
