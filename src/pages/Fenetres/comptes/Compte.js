/** @format */

import React, { useState } from 'react'
import PageHeader from '../../../composants/PageHeader'
import TableData from '../../../composants/tableaux/TableData'
import { Grid } from '@material-ui/core'
import BarreButtons from '../../../composants/BarreButtons'
import Buttons from '../../../composants/controls/Buttons'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import CreateIcon from '@material-ui/icons/Create'
import IconButton from '@material-ui/core/IconButton'
import ModalOuiNon from '../../../composants/controls/modal/ModalOuiNon'
import axios from '../../../api/axios'
import CompteForm from './CompteForm'
import AddIcon from '@material-ui/icons/Add'
import { Notification } from '../../../composants/controls/toast/MyToast'
import CryptFunc from '../../../functions/CryptFunc'
import GroupBy from '../../../functions/GroupBy'
import ReadCookie from '../../../functions/ReadCookie'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep'

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

function CompteBanque(props) {
  ////////////// Droits de l'utilisateur
  var MachaineDeCrypte = CryptFunc(localStorage.getItem('_Drt'), 0)
  const leMenu = GroupBy(MachaineDeCrypte)
  const DroitsUser = leMenu.group['Eléments paiements'][0]
  // droits insuffisants
  const noRightFunc = () => {
    setNotify({
      type: 'error',
      message: 'Droits insuffisants',
    })
    setOpenNotif(true)
  }

  // Stats
  const [initialModal, setInitialModal] = useState({})
  const [notify, setNotify] = useState({
    type: '',
    message: '',
  })
  const [openNotif, setOpenNotif] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [openOuiNon, setOpenOuiNon] = useState(false) // statut du modal suppression
  const [title, setTitle] = useState('')
  const [item, setItem] = useState()

  // Variables
  const Api = 'comptes/ReadCompte.php'
  const Query = ['listecompte']
  const cookieInfo = ReadCookie()

  // Fermeture du modal
  const handleCloseModal = () => {
    setOpenModal(false)
  }

  const handleCloseModalOuiNon = () => {
    setOpenOuiNon(false)
  }

  // Modal Supression
  const FuncSuppr = (id) => {
    setOpenOuiNon(true)
    setItem(id)
  }

  // suppression d'une  devise
  const supprCompte = async (item) => {
    let response = ''
    const headers = {
      Authorization: cookieInfo,
    }
    response = await axios.get(`societe/DeleteCompte.php?id=${item}`, {
      headers,
    })
    setOpenOuiNon(false)

    return response.data
  }

  // suppression d'un societe
  const supCompte = useMutation(supprCompte, {
    onSuccess: (data) => {
      queryClient.invalidateQueries('listecompte')
      setNotify({
        type: data.reponse,
        message: data.message,
      })
      setOpenNotif(true)
    },
    onError: (error) => {
      console.error(error)
      props.setNotify({
        message: 'Service indisponible',
        type: 'error',
      })
      props.setOpenNotif(true)
    },
  })

  const handleOpenModal = (
    id = '',
    code = '',
    solde_i = 0,
    comptable = '',
    rib = '',
    libelle = '',
    gestionnaire = '',
    civilite = '',
    service = '',
    tel = '',
    email = '',
    banque = '',
    societe = '',
    devise = '',
  ) => {
    setInitialModal({
      id: id,
      code: code,
      solde_i: solde_i,
      comptable: comptable,
      rib: rib,
      libelle: libelle,
      gestionnaire: gestionnaire,
      civilite: civilite,
      service: service,
      tel: tel,
      email: email,
      banque: banque,
      societe: societe,
      devise: devise,
    })

    //Mise à jour du titre
    id === '' ? setTitle('Nouveau compte') : setTitle(`Modifier ${code}`)

    setOpenModal(true)
  }

  // Mise à jour de la liste des retraits après mutation
  const queryClient = useQueryClient()

  // Entetes du tableau
  const tableHeader = [
    {
      field: 'id',
      hide: true,
      editable: false,
      headerName: 'id',
      width: 20,
      columnResizeIcon: true,
    },
    {
      field: 'CODE_COMPTE',
      hide: false,
      editable: false,
      headerName: 'Code',
      width: 120,
      columnResizeIcon: true,
    },
    {
      field: 'LIBELLE_COMPTE',
      hide: false,
      editable: false,
      headerName: 'Description',
      width: 143,
      columnResizeIcon: true,
    },
    {
      field: 'CODE_BANQUE',
      hide: false,
      editable: false,
      headerName: 'Banque',
      width: 180,
      columnResizeIcon: true,
    },
    {
      field: 'SOLDE_INITIAL_COMPTE',
      hide: false,
      editable: false,
      headerName: 'Solde',
      width: 120,
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
      field: 'RIB',
      hide: false,
      editable: false,
      headerName: 'RIB',
      width: 250,
      columnResizeIcon: true,
    },
    {
      field: 'CODE_DEVISE',
      hide: false,
      editable: false,
      headerName: 'Devise',
      width: 100,
      columnResizeIcon: true,
    },
    {
      field: 'COMPTE_COMPTABLE',
      hide: false,
      editable: false,
      headerName: 'Comptablilité',
      width: 150,
      columnResizeIcon: true,
    },
    {
      field: 'GESTIONNAIRE_COMPTE',
      hide: false,
      editable: false,
      headerName: 'Gestionnaire',
      width: 200,
      columnResizeIcon: true,
    },
    {
      field: 'CIV_GESTIONNAIRE_COMPTE',
      hide: true,
      editable: false,
      headerName: 'Civilité',
      width: 200,
      columnResizeIcon: true,
    },
    {
      field: 'SERVICE_GESTIONNAIRE_COMPTE',
      hide: false,
      editable: false,
      headerName: 'Service',
      width: 200,
      columnResizeIcon: true,
    },
    {
      field: 'TEL_GESTIONNAIRE_COMPTE',
      hide: false,
      editable: false,
      headerName: 'Tel',
      width: 200,
      columnResizeIcon: true,
    },
    {
      field: 'EMAIL_GESTIONNAIRE_COMPTE',
      hide: false,
      editable: false,
      headerName: 'Email',
      width: 200,
      columnResizeIcon: true,
    },
    {
      field: 'banq',
      hide: true,
      editable: false,
      headerName: 'IDbanq',
      width: 180,
      columnResizeIcon: true,
    },
    {
      field: 'ID_DEVISE',
      hide: true,
      editable: false,
      headerName: 'IDdevise',
      width: 180,
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
              DroitsUser.droits_modifier == 1
                ? handleOpenModal(
                    e.row.id,
                    e.row.CODE_COMPTE,
                    e.row.SOLDE_INITIAL_COMPTE,
                    e.row.COMPTE_COMPTABLE,
                    e.row.RIB,
                    e.row.LIBELLE_COMPTE,
                    e.row.CODE_DEVISE,
                    e.row.COMPTE_COMPTABLE,
                    e.row.GESTIONNAIRE_COMPTE,
                    e.row.CIV_GESTIONNAIRE_COMPTE,
                    e.row.SERVICE_GESTIONNAIRE_COMPTE,
                    e.row.TEL_GESTIONNAIRE_COMPTE,
                    e.row.EMAIL_GESTIONNAIRE_COMPTE,
                    e.row.banq,
                    e.row.ID_DEVISE,
                  )
                : noRightFunc()
            }}>
            <CreateIcon
              fontSize='inherit'
              color='default'
              className='CreateIcon'
            />
          </IconButton>
          <IconButton
            aria-label='delete'
            size='small'
            onClick={() => {
              DroitsUser.droits_supprimer == 1
                ? FuncSuppr(e.row.id)
                : noRightFunc()
            }}>
            <DeleteSweepIcon
              color='default'
              fontSize='inherit'
              className='DeleteSweepIcon'
            />
          </IconButton>
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
              startIcon={<AddIcon />}>
              Créer
            </Buttons>
          </>
        }
      />
      <Grid container>
        <Grid item xs={12}>
          <TableData
            columns={tableHeader}
            useQuery={Query}
            api={Api}
            Authorization={cookieInfo}
          />
        </Grid>
      </Grid>
      <CompteForm
        openModal={openModal}
        handleClose={handleCloseModal}
        initialModal={initialModal}
        titreModal={title}
        queryClient={queryClient}
        setNotify={setNotify}
        setOpenNotif={setOpenNotif}
      />
      <ModalOuiNon
        open={openOuiNon}
        onClose={handleCloseModalOuiNon}
        titre='Suppression'
        message={'Voulez vous supprimer ce compte ?'}
        non='Annuler'
        oui='Oui'
        deconnect={() => supCompte.mutate(item)}
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

export default CompteBanque
