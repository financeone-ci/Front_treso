/** @format */

import React, { useState, useEffect, useCallback } from 'react'
import PageHeader from '../../../composants/PageHeader'
import TableData from '../../../composants/tableaux/TableData'
import { Paper, Grid, FormControlLabel, Checkbox } from '@material-ui/core'
import Controls from '../../../composants/controls/Controls'
import BarreButtons from '../../../composants/BarreButtons'
import Buttons from '../../../composants/controls/Buttons'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import CreateIcon from '@material-ui/icons/Create'
import IconButton from '@material-ui/core/IconButton'
import ModalOuiNon from '../../../composants/controls/modal/ModalOuiNon'
import axios from '../../../api/axios'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import MenuTable from '../../../composants/controls/MenuTable'
import MenuItem from '@material-ui/core/MenuItem'
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep'
import FormTiers from './FormTiers'
import AddIcon from '@material-ui/icons/Add'
import { Notification } from '../../../composants/controls/toast/MyToast'
import CryptFunc from '../../../functions/CryptFunc'
import GroupBy from '../../../functions/GroupBy'
import ReadCookie from '../../../functions/ReadCookie'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import ListTypeTiers from './ListTypeTiers'
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

function VueTiers(props) {
  ////////////// Droits de l'utilisateur
  var MachaineDeCrypte = CryptFunc(localStorage.getItem('_Drt'), 0)
  const leMenu = GroupBy(MachaineDeCrypte)
  const DroitsUser = leMenu.group['Entités'][1]
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
  const [openOuiNon, setOpenOuiNon] = useState(false) // statut du modal suppression
  const [idSuppr, setIdSuppr] = useState('') // id  à editer ou supprimer ?
  const [typeTiers, setTypeTiers] = useState([])
  const [tiers, setTiers] = useState([])
  const [checkedTypeTiers, setCheckedTypeTiers] = useState([])
  const [openTypeModal, setOpenTypeModal] = useState(false)


  // Variables
  const Api = 'tiers/ReadTiers.php'
  const Query = ['Tiers']
  const cookieInfo = ReadCookie()

  // Chargement de la liste des types tiers
  const listeType = async (tiers, code) => {
    const headers = {
      Authorization: cookieInfo,
    }
    setTitle(code)
    checkedTypeTiers.splice(0, checkedTypeTiers.length)
    setTiers(tiers)
    await axios
      .get(`tiers/TypeTiersTiers.php?tiers=${tiers}`, {
        headers,
      })
      .then((response) => {
        
        setTypeTiers(response.data.infos)
        response.data.infos.map(
          (item) => item.tiers  && checkedTypeTiers.push(item.id),
        )
        setOpenTypeModal(true)
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

  // Fermeture du modal
  const handleCloseModal = () => {
    setOpenModal(false)
  }
  const handleCloseTypeModal = () => {
    setOpenTypeModal(false)
  }
  const handleCloseModalOuiNon = () => {
    setOpenOuiNon(false)
  }

  // ouverture du modal
  const handleOpenModal = (
    id = '',
    code = '',
    beneficiaire = '',
    contact = '',
    civilite = '',
    reference = '',
    nom = '',
    fonction = '',
    adresse = '',
   
  ) => {
    setInitialModal({
      id: id,
      code: code,
      beneficiaire: beneficiaire,
      contact: contact,
      civilite: civilite,
      reference: reference,
      nom: nom,
      fonction: fonction,
      adresse: adresse,
    })
    //Mise à jour du titre
    id === '' ? setTitle('Nouveau  tiers ') : setTitle(`Modifier ${code}`)
    setOpenModal(true)
  }

  // Modal Supression
  const FuncSuppr = (id) => {
    setOpenOuiNon(true)
    setIdSuppr(id)
  }

  // suppression d'un  tiers
  const supprTiers = async (values) => {
    let response = ''
    const headers = {
      Authorization: cookieInfo,
    }

    response = await axios.post(
      `tiers/DeleteTiers.php?id=${values}`,
      { values },
      { headers },
    )
    handleCloseModalOuiNon()

    return response.data
  }

  // suppression d'un sTiers
  const supTiers = useMutation(supprTiers, {
    onSuccess: (data) => {
      queryClient.invalidateQueries('Tiers')
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
      field: 'CODE_TIERS',
      hide: false,
      editable: false,
      headerName: 'Code',
      width: 120,
      columnResizeIcon: true,
    },
    {
      field: 'BENEFICIAIRE_TIERS',
      hide: false,
      editable: false,
      headerName: 'Bénéficiaire',
      width: 300,
      columnResizeIcon: true,
      fixed: true,
    },
    {
      field: 'TEL_TIERS',
      hide: false,
      editable: false,
      headerName: 'Contact',
      width: 150,
      columnResizeIcon: true,
    },
    {
      field: 'CIV_REPRESENTANT_TIERS',
      hide: false,
      editable: false,
      headerName: 'Civilité',
      width: 150,
      columnResizeIcon: true,
    },
    {
      field: 'REF_TIERS',
      hide: false,
      editable: false,
      headerName: 'Référence',
      width: 250,
      columnResizeIcon: true,
      fixed: true,
    },
    {
      field: 'NOM_REPRESENTANT_TIERS',
      hide: false,
      editable: false,
      headerName: 'Représentant',
      width: 250,
      columnResizeIcon: true,
      fixed: true,
    },
    {
      field: 'FONCTION_REPRESENTANT_TIERS',
      hide: false,
      editable: false,
      headerName: 'Fonction',
      width: 250,
      columnResizeIcon: true,
      fixed: true,
      
    },
    {
      field: 'ADRESSE_TIERS',
      hide: false,
      editable: false,
      headerName: 'Adresse',
      width: 250,
      columnResizeIcon: true,
      fixed: true,
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
                  e.row.CODE_TIERS,
                  e.row.BENEFICIAIRE_TIERS,
                  e.row.TEL_TIERS,
                  e.row.CIV_REPRESENTANT_TIERS,
                  e.row.REF_TIERS,
                  e.row.NOM_REPRESENTANT_TIERS,
                  e.row.FONCTION_REPRESENTANT_TIERS,
                  e.row.ADRESSE_TIERS,
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
          <MenuTable icone={<MoreVertIcon />}>
            <MenuItem
              dense={true}
              onClick={() => {
                if (DroitsUser.droits_modifier == 1) {
                  listeType(e.row.id, e.row.CODE_TIERS)
                  
                } else {
                  noRightFunc()
                }
              }}>
              Ajouter type de tiers
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
            Authorization={ReadCookie()}
          />
        </Grid>
      </Grid>
      <FormTiers
        openModal={openModal}
        handleClose={handleCloseModal}
        initialModal={initialModal}
        titreModal={title}
        queryClient={queryClient}
        setNotify={setNotify}
        setOpenNotif={setOpenNotif}
      />
      <ListTypeTiers
        titreModal={`Type de tiers / ${title}`}
        handleClose={handleCloseTypeModal}
        openModal={openTypeModal}
        Authorization={cookieInfo}
        siteId={tiers}
        checked={checkedTypeTiers}
        setChecked={setCheckedTypeTiers}
        typeTiers={typeTiers}
        setNotify={setNotify}
        setOpenNotif={setOpenNotif}
      />
      <ModalOuiNon
        open={openOuiNon}
        onClose={handleCloseModalOuiNon}
        titre='Supprimer?'
        message={'Voulez vous Supprimer ce  tiers ?'}
        non='Annuler'
        oui='Oui'
        deconnect={() => supTiers.mutate(idSuppr)}
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

export default VueTiers
