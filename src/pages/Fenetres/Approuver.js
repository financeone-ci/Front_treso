/** @format **/

import React, { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import PageHeader from '../../composants/PageHeader'
import TableauBasic from '../../composants/tableaux/TableauBasic'
import { Paper, Grid } from '@material-ui/core'
import Controls from '../../composants/controls/Controls'
import Constantes from '../../api/Constantes'
import BarreButtons from '../../composants/BarreButtons'
import Buttons from '../../composants/controls/Buttons'
import AddIcon from '@material-ui/icons/Add'
import { makeStyles } from '@material-ui/core/styles'
import ModalOuiNon from '../../composants/controls/modal/ModalOuiNon'
import { Notification } from '../../composants/controls/toast/MyToast'
import CryptFunc from '../../functions/CryptFunc'
import GroupBy from '../../functions/GroupBy'

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(0.5),
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
}))

function Approuver(props) {
  const [notify, setNotify] = useState({
    type: '',
    message: '',
  })
  const [openNotif, setOpenNotif] = useState(false)
  const [opens_, setOpens_] = React.useState(false) // statut du modal suppression
  const [listId, setListId] = React.useState([]) // idprofil à editer ou supprimer?

  const queryClient = useQueryClient()
  // Fermeture de modal
  const handleCloseModal_ = () => {
    setOpens_(false)
  }

  ////////////// Droits de l'utilisateur
  var MachaineDeCrypte = CryptFunc(localStorage.getItem('_Drt'), 0)
  const leMenu = GroupBy(MachaineDeCrypte)
  const DroitsUser = leMenu.group['Paiements'][3]
  // fonction pas assez de droits
  const noRightFunc = () => {
    setNotify({
      type: 'error',
      message: 'Droits insuffisants',
    })
    setOpenNotif(true)
  }

  // Chargement des paiements en attente de validation
  const fetchValidation = async () => {
    const response = await fetch(Constantes.URL + '/approbations.php?type=R')
    return response.json()
  }
  const { data, status } = useQuery(['approbations'], fetchValidation)

  // validation des paiements (mise à jour des status des paiements)
  const ValidePaiement = async () => {
    const response = await fetch(
      Constantes.URL + `approbations.php?type=U&id=${listId}`,
    )
    return response.json()
  }

  const mutationValidate = useMutation(ValidePaiement, {
    onError: (data) => {
      setOpens_(false)
      setNotify({ message: data.message, type: data.reponse })
      setOpenNotif(true)
    },
    onSuccess: (data) => {
      setNotify({ message: data.message, type: data.reponse })
      queryClient.invalidateQueries('approbations')
      setOpens_(false)
      setOpenNotif(true)
    },
  })

  const classes = useStyles()

  // Entetes du tableau
  const enteteTableau = [
    {
      field: 'IDPAIEMENT',
      hide: true,
      editable: false,
      headerName: 'id',
      width: 20,
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
        return `${valueFormatted}`
      },
      valueParser: (value) => Number(value),
    },
    {
      field: 'MOTIF_PAIEMENT',
      hide: false,
      editable: false,
      headerName: 'Motif',
      width: 400,
      columnResizeIcon: true,
    },
    {
      field: 'DATE_PAIE',
      hide: false,
      editable: false,
      headerName: 'Date opération',
      width: 150,
      columnResizeIcon: true,
      type: 'date',
    },
    {
      field: 'LIBELLE_STATUT_PAIEMENT',
      hide: false,
      editable: false,
      headerName: 'Status',
      width: 150,
      columnResizeIcon: true,
    },
    {
      field: 'CODE_NATURE',
      hide: false,
      editable: false,
      headerName: 'Nature',
      width: 150,
      columnResizeIcon: true,
    },
    {
      field: 'CODE_COMPTE',
      hide: false,
      editable: false,
      headerName: 'Compte',
      width: 150,
      columnResizeIcon: true,
    },
    {
      field: 'CODE_BUDGET_PAIE',
      hide: true,
      editable: false,
      headerName: 'Budget',
      width: 150,
      columnResizeIcon: true,
    },
    {
      field: 'CODE_CATEGORIE_PAIEMENT',
      hide: false,
      editable: false,
      headerName: 'Catégorie',
      width: 150,
      columnResizeIcon: true,
    },
  ]
  return (
    <>
      <PageHeader icone={props.icone} titrePage={props.titre} />

      <BarreButtons
        buttons={
          <>
            <div style={{ textAlign: 'left' }}>
              <Buttons
                disabled={listId.length === 0}
                variant='contained'
                color='primary'
                size='small'
                onClick={() => {
                  DroitsUser.droits_creer == 1 ? setOpens_(true) : noRightFunc()
                }}
                className={classes.button}
                startIcon={
                  <AddIcon
                    color='default'
                    fontSize='inherit'
                    className='CreateIcon'
                  />
                }>
                Approuver
              </Buttons>
            </div>
          </>
        }
      />

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
                col={enteteTableau}
                donnees={data.infos}
                onSelectionModelChange={(e) => {
                  setListId(e)
                }}
                onRowClick={(e) => {}}
                checkboxSelection={true}
                pagination
                pageSize={50}
              />
            </Grid>
          </Grid>
        </>
      )}

      <ModalOuiNon
        open={opens_}
        onClose={handleCloseModal_}
        titre={'Confirmer approbations !'}
        message={'Voulez vous approuver ce(s) Paiement(s) ?'}
        non='Annuler'
        oui='Oui'
        deconnect={() => mutationValidate.mutate()}
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

export default Approuver
