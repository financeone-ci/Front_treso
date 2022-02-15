/** @format */

import React, { useState } from 'react'
import PageHeader from '../../../composants/PageHeader'
import TableData from '../../../composants/tableaux/TableData'
import { Grid } from '@material-ui/core'
import Controls from '../../../composants/controls/Controls'
import BarreButtons from '../../../composants/BarreButtons'
import Buttons from '../../../composants/controls/Buttons'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import CreateIcon from '@material-ui/icons/Create'
import IconButton from '@material-ui/core/IconButton'
import ModalOuiNon from '../../../composants/controls/modal/ModalOuiNon'
import axios from '../../../api/axios'
import SocieteForm from './SocieteForm'
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

function Societe(props) {
  ////////////// Droits de l'utilisateur
  var MachaineDeCrypte = CryptFunc(localStorage.getItem('_Drt'), 0)
  const leMenu = GroupBy(MachaineDeCrypte)
  const DroitsUser = leMenu.group['Entités'][0]
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
  const Api = 'societe/ReadSociete.php'
  const Query = ['listesociete']
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
  const supprSociete = async (item) => {
    let response = ''
    const headers = {
      Authorization: cookieInfo,
    }
    response = await axios.get(`sites/DeleteSite.php?id=${item}`, {
      headers,
    })
    setOpenOuiNon(false)

    return response.data
  }

  // suppression d'un societe
  const supSociete = useMutation(supprSociete, {
    onSuccess: (data) => {
      queryClient.invalidateQueries('listesociete')
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
    description = '',
    adresse = '',
    tel = '',
    fax = '',
    email = '',
    siege = '',
    complement = '',
  ) => {
    setInitialModal({
      id: id,
      code: code,
      description: description,
      adresse: adresse,
      tel: tel,
      fax: fax,
      email: email,
      siege: siege,
      complement: complement,
    })

    //Mise à jour du titre
    id === '' ? setTitle('Nouvelle société') : setTitle(`Modifier ${code}`)
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
      width: 10,
      columnResizeIcon: true,
    },
    {
      field: 'CODE_SOCIETE',
      hide: false,
      editable: false,
      headerName: 'Code',
      width: 150,
      columnResizeIcon: true,
    },
    {
      field: 'LIBELLE_SOCIETE',
      hide: false,
      editable: false,
      headerName: 'Nom complet',
      width: 350,
      columnResizeIcon: true,
    },
    {
      field: 'ADRESSE_SOCIETE',
      hide: false,
      editable: false,
      headerName: 'Adresse',
      width: 250,
      columnResizeIcon: true,
    },
    {
      field: 'TEL_SOCIETE',
      hide: false,
      editable: false,
      headerName: 'Téléphone',
      width: 150,
      columnResizeIcon: true,
    },
    {
      field: 'FAX_SOCIETE',
      hide: false,
      editable: false,
      headerName: 'Fax',
      width: 150,
      columnResizeIcon: true,
    },
    {
      field: 'EMAIL_SOCIETE',
      hide: false,
      editable: false,
      headerName: 'E-mail',
      width: 250,
      columnResizeIcon: true,
    },
    {
      field: 'SIEGE',
      hide: false,
      editable: false,
      headerName: 'Siège',
      width: 250,
      columnResizeIcon: true,
    },
    {
      field: 'COMPLEMENT_SOCIETE',
      hide: false,
      editable: false,
      headerName: 'Complément',
      width: 300,
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
              if (DroitsUser.droits_modifier == 1) {
                handleOpenModal(
                  e.row.id,
                  e.row.CODE_SOCIETE,
                  e.row.LIBELLE_SOCIETE,
                  e.row.ADRESSE_SOCIETE,
                  e.row.TEL_SOCIETE,
                  e.row.FAX_SOCIETE,
                  e.row.EMAIL_SOCIETE,
                  e.row.SIEGE,
                  e.row.COMPLEMENT_SOCIETE,
                )
              }
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
      <SocieteForm
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
        message={'Voulez vous supprimer cette société ?'}
        non='Annuler'
        oui='Oui'
        deconnect={() => supSociete.mutate(item)}
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

export default Societe
