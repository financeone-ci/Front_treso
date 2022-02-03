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
import ListUserSite from './ListUserSite'
import ListCptSite from './ListCptSite'
import ListIcon from '@material-ui/icons/List'
import MenuTable from '../../../composants/controls/MenuTable'
import MenuItem from '@material-ui/core/MenuItem'

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
  const [openModal, setOpenModal] = useState(false)
  const [openUserModal, setOpenUserModal] = useState(false)
  const [openCpteModal, setOpenCpteModal] = useState(false)
  const [title, setTitle] = useState('')
  const [site, setSite] = useState()
  const [siteUser, setSiteUser] = useState([])
  const [siteCpte, setSiteCpte] = useState([])
  const [checked, setChecked] = useState([])

  // Variables
  const Api = 'sites/ReadSite.php'
  const Query = ['listesite']
  const cookieInfo = ReadCookie()

  // Fermeture du modal
  const handleCloseModal = () => {
    setOpenModal(false)
  }
  const handleCloseUserModal = () => {
    setOpenUserModal(false)
  }
  const handleCloseCpteModal = () => {
    setOpenCpteModal(false)
  }

  // Chargement de la liste des users
  const listeUser = async (site) => {
    const headers = {
      Authorization: cookieInfo,
    }
    checked.splice(0, checked.length)
    setSite(site)
    await axios
      .get(`sites/UserSite.php?site=${site}`, {
        headers,
      })
      .then((response) => {
        setSiteUser(response.data.infos)
        response.data.infos.map(
          (item) => item.site == 1 && checked.push(item.id),
        )
        setOpenUserModal(true)
        if (response.data.reponse == 'error') {
          setNotify({
            type: response.data.reponse,
            message: response.data.message,
          })
          setOpenNotif(true)
        }
      })
      .catch((error) => {
        setNotify({
          type: 'error',
          message: `Service indisponible: ${error}`,
        })
        setOpenNotif(true)
      })
  }

  // Chargement de la liste des comptes
  const listeCompte = async (site) => {
    const headers = {
      Authorization: cookieInfo,
    }
    checked.splice(0, checked.length)
    setSite(site)
    await axios
      .get(`sites/CompteSite.php?site=${site}`, {
        headers,
      })
      .then((response) => {
        setSiteCpte(response.data.infos)
        response.data.infos.map(
          (item) => item.site == 1 && checked.push(item.id),
        )
        setOpenCpteModal(true)
        if (response.data.reponse == 'error') {
          setNotify({
            type: response.data.reponse,
            message: response.data.message,
          })
          setOpenNotif(true)
        }
      })
      .catch((error) => {
        setNotify({
          type: 'error',
          message: `Service indisponible: ${error}`,
        })
        setOpenNotif(true)
      })
  }

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
      width: 350,
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
          <MenuTable icone={<ListIcon />}>
            <MenuItem
              onClick={() => {
                if (DroitsUser.droits_modifier == 1) {
                  listeUser(e.row.id)
                } else {
                  noRightFunc()
                }
              }}>
              Ajouter utilisateur
            </MenuItem>
            <MenuItem
              onClick={() => {
                if (DroitsUser.droits_modifier == 1) {
                  listeCompte(e.row.id)
                } else {
                  noRightFunc()
                }
              }}>
              Ajouter compte
            </MenuItem>
          </MenuTable>
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
      <FormSite
        openModal={openModal}
        handleClose={handleCloseModal}
        initialModal={initialModal}
        titreModal={title}
        queryClient={queryClient}
        setNotify={setNotify}
        setOpenNotif={setOpenNotif}
      />
      <ListUserSite
        titreModal='Utilisateurs du site'
        handleClose={handleCloseUserModal}
        openModal={openUserModal}
        Authorization={cookieInfo}
        siteId={site}
        checked={checked}
        setChecked={setChecked}
        usersite={siteUser}
        setNotify={setNotify}
        setOpenNotif={setOpenNotif}
      />
      <ListCptSite
        titreModal='Utilisateurs du site'
        handleClose={handleCloseCpteModal}
        openModal={openCpteModal}
        Authorization={cookieInfo}
        siteId={site}
        checked={checked}
        setChecked={setChecked}
        cptesite={siteCpte}
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
