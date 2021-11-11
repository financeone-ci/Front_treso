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
import PaiementForm from './PaiementForm'
import CreateIcon from '@material-ui/icons/Create'
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep'
import IconButton from '@material-ui/core/IconButton'
import ModalOuiNon from '../../composants/controls/modal/ModalOuiNon'
import axios from '../../api/axios'
import { Notification } from '../../composants/controls/toast/MyToast'
import CryptFunc from '../../functions/CryptFunc'
import GroupBy from '../../functions/GroupBy'
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

function Paiements(props) {
  const [notify, setNotify] = useState({
    type: '',
    message: '',
  })

  const queryClient = useQueryClient()

  // Chargement des engagements par période
  const fetchEngagements = async () => {
    const response = await fetch(
      Constantes.URL + '/engagements.php?type=R&paie',
    )
    return response.json()
  }

  const { data, status } = useQuery(['paiements'], fetchEngagements)

  // supprimer des engagements
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
      queryClient.invalidateQueries('paiements')
      setOpens_(false)
      setOpenNotif(true)
    },
  })

  const [openSaisieEngagement, setOpenSaisieEngagement] = useState(false)

  // valeurs initiales
  const [openNotif, setOpenNotif] = useState(false)

  const [opens_, setOpens_] = React.useState(false) // statut du modal suppression
  const [listId, setListId] = React.useState('') // idprofil à editer ou supprimer?
  const [listNum, setListNum] = React.useState(true)
  const [init, setInit] = useState({
    id: {},
  })

  const handleCloseModal_ = () => {
    setOpens_(false)
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
      field: 'SOLDE',
      hide: false,
      editable: false,
      headerName: 'Solde',
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
  ]

  const fusionFunc = () => {
    let jePeux = 0
    lesBeneficiaires.map((element) => {
      element != lesBeneficiaires[0] && jePeux++
    })
    jePeux == 0 ? handleClickOpenSaisieEngagement(listId, 'fusion') : doubFunc()
  }

  //Ouverture modal Structure
  const handleClickOpenSaisieEngagement = (id = {}, type = 'partiel') => {
    setInit({
      id: id,
      typaiement: type,
    })

    setOpenSaisieEngagement(true)
  }

  const handleCloseSaisieEngagement = () => {
    setOpenSaisieEngagement(false)
  }

  ////////////// Droits de l'utilisateur
  var MachaineDeCrypte = CryptFunc(localStorage.getItem('_Drt'), 0)
  const leMenu = GroupBy(MachaineDeCrypte)
  const DroitsUser = leMenu.group['Paiements'][0]

  // fonction pas assez de droits
  const noRightFunc = () => {
    setNotify({
      type: 'error',
      message: 'Droits insuffisants',
    })

    setOpenNotif(true)
  }
  // fonction doublons beneficiaires
  const doubFunc = () => {
    setNotify({
      type: 'error',
      message: 'Bénéficiaires différents',
    })

    setOpenNotif(true)
  }
  // Chargement des lignes sélectionnées
  const lesBeneficiaires = []
  var sumMontant = 0
  status == 'success' &&
    data.infos.map((item) => {
      listId.includes(item.id) && lesBeneficiaires.push(item.BENEFICIAIRE)
      if (listId.includes(item.id)) {
        sumMontant = sumMontant + item.MONTANT
      }
    })

  const classes = useStyles()
  return (
    <>
      <PageHeader icone={props.icone} titrePage={props.titre} />

      <BarreButtons
        buttons={
          <>
            <div style={{ textAlign: 'left' }}>
              <Buttons
                disabled={listId.length === 0 || listNum.length === 0}
                variant='contained'
                color='primary'
                size='small'
                onClick={() => {
                  DroitsUser.droits_creer == 1
                    ? handleClickOpenSaisieEngagement(listId)
                    : noRightFunc()
                }}
                className={classes.button}
                startIcon={
                  <AddIcon
                    color='default'
                    fontSize='inherit'
                    className='CreateIcon'
                  />
                }>
                Paiement Unique / partiel
              </Buttons>

              <Buttons
                disabled={listId.length < 2}
                variant='contained'
                color='primary'
                size='small'
                onClick={() => {
                  DroitsUser.droits_creer == 1 ? fusionFunc() : noRightFunc()
                }}
                className={classes.button}
                startIcon={
                  <AddIcon
                    color='default'
                    fontSize='inherit'
                    className='CreateIcon'
                  />
                }>
                Paiement fusionné
              </Buttons>
            </div>
          </>
        }
      />

      <Grid container>
        <PaiementForm
          queryClient={queryClient}
          initial_={init}
          handleClose={handleCloseSaisieEngagement}
          open={openSaisieEngagement}
          titreModal={
            (init.num_engagement =
              'Créer Paiement à partir de  ' + listId.length + ' engagements')
          }
          infoCookie={props.infoCookie}
          sumMontant={sumMontant}
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
                  setListNum(e)
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
        message={'Voulez vous Supprimer ce(s) Paiement(s) ?'}
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

export default Paiements
