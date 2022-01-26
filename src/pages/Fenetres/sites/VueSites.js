/** @format */

import React, { useState, useEffect, useCallback } from 'react'
import PageHeader from '../../../composants/PageHeader'
import TableData from '../../../composants/tableaux/TableData'
// import TableauBasic from '../../../composants/tableaux/TableauBasic'
import { Paper, Grid, FormControlLabel, Checkbox } from '@material-ui/core'
import Controls from '../../../composants/controls/Controls'
import BarreButtons from '../../../composants/BarreButtons'
import Buttons from '../../../composants/controls/Buttons'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import CreateIcon from '@material-ui/icons/Create'
import IconButton from '@material-ui/core/IconButton'
import ModalOuiNon from '../../../composants/controls/modal/ModalOuiNon'
import axios from '../../../api/axios'
import FormSite from './FormSite'
import AddIcon from '@material-ui/icons/Add'
import { Notification } from '../../../composants/controls/toast/MyToast'
import CryptFunc from '../../../functions/CryptFunc'
import GroupBy from '../../../functions/GroupBy'
import ReadCookie from '../../../functions/ReadCookie'
import { useMutation, useQuery, useQueryClient } from 'react-query'
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

function VueSites(props) {
  ////////////// Droits de l'utilisateur
  var MachaineDeCrypte = CryptFunc(localStorage.getItem('_Drt'), 0)
  const leMenu = GroupBy(MachaineDeCrypte)
  const DroitsUser = leMenu.group['Entités'][3]
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
  const [openModal, setOpenModal] = useState(false) // statut du modal suppression
  const [title, setTitle] = useState('')

  // Variables
  const Api = 'sites/ReadSite.php'
  const Query = ['listesite']
  const cookieInfo = ReadCookie()

  // Fermeture du modal
  const handleCloseModal = () => {
    setOpenModal(false)
  }

  // ouverture du modal
  const handleOpenModal = (
    id = '',
    code = '',
    description = '',
    representant = '',
    local = '',
  ) => {
    setInitialModal({
      id: id,
      code: code,
      description: description,
      representant: representant,
      local: local,
    })
    //Mise à jour du titre
    id === '' ? setTitle('Nouveau site') : setTitle(`Modifier ${code}`)
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
      field: 'CODE_SITE',
      hide: false,
      editable: false,
      headerName: 'Code',
      width: 150,
      columnResizeIcon: true,
    },
    {
      field: 'DESCRIPTION_SITE',
      hide: false,
      editable: false,
      headerName: 'Description',
      width: 250,
      columnResizeIcon: true,
    },
    {
      field: 'REPRESENTANT_SITE',
      hide: false,
      editable: false,
      headerName: 'Représentant',
      width: 250,
      columnResizeIcon: true,
    },
    {
      field: 'LOCALISATION_SITE',
      hide: false,
      editable: false,
      headerName: 'Adresse géographique',
      width: 250,
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
              handleOpenModal(
                e.row.id,
                e.row.CODE_SITE,
                e.row.DESCRIPTION_SITE,
                e.row.REPRESENTANT_SITE,
                e.row.LOCALISATION_SITE,
                1,
              )
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
            Authorization={ReadCookie()}
          />
        </Grid>
      </Grid>
      <FormSite
        openModal={openModal}
        handleClose={handleCloseModal}
        initialModal={initialModal}
        titreModal={title}
        queryClient={queryClient}
        setNotify={setNotify}
        setOpenNotif={setOpenNotif}
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

export default VueSites
