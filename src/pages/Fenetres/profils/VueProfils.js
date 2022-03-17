/** @format */

import React, { useState, useEffect, useCallback } from 'react'
import PageHeader from '../../../composants/PageHeader'
import TableData from '../../../composants/tableaux/TableData'
import {  Grid, Paper } from '@material-ui/core'
import BarreButtons from '../../../composants/BarreButtons'
import Buttons from '../../../composants/controls/Buttons'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import CreateIcon from '@material-ui/icons/Create'
import IconButton from '@material-ui/core/IconButton'
import ModalOuiNon from '../../../composants/controls/modal/ModalOuiNon'
import axios from '../../../api/axios'
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep'
import FormProfils from './FormProfils'
import FormDroits from './FormDroits'
import AddIcon from '@material-ui/icons/Add'
import { Notification } from '../../../composants/controls/toast/MyToast'
import CryptFunc from '../../../functions/CryptFunc'
import GroupBy from '../../../functions/GroupBy'
import ReadCookie from '../../../functions/ReadCookie'
import Controls from '../../../composants/controls/Controls'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import MoreVertIcon from '@material-ui/icons/MoreVert'
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

function VueProfils(props) {
  ////////////// Droits de l'utilisateur
  var MachaineDeCrypte = CryptFunc(localStorage.getItem('_Drt'), 0)
  const leMenu = GroupBy(MachaineDeCrypte)
  const DroitsUser = leMenu.group['Profils et utilisateurs'][0]
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
  const [initialModalDroits, setInitialModalDroits] = useState({})
  const [notify, setNotify] = useState({
    type: '',
    message: '',
  })
  const [openNotif, setOpenNotif] = useState(false)
  const [openModal, setOpenModal] = useState(false) // statut du modal 
  const [openModalDroits, setOpenModalDroits] = useState(false) // statut du modal 
  const [loader, setLoader] = useState(false) // statut du loader
  const [title, setTitle] = useState('')
  const [titleDroits, setTitleDroits] = useState('')
  const [openOuiNon, setOpenOuiNon] = useState(false) // statut du modal suppression
  const [idSuppr, setIdSuppr] = useState('') // idprofil à editer ou supprimer ?

  // Variables
  const Api = 'profils/ReadProfils.php'
  const Query = ['listeProfils']
  const cookieInfo = ReadCookie()

  // Fermeture du modal
  const handleCloseModal = () => {
    setOpenModal(false)
  }
  const handleCloseModalDroits = () => {
    setOpenModalDroits(false)
  }
  const handleCloseModalOuiNon = () => {
    setOpenOuiNon(false)
  }

  //loader
  const showLoader = (value) =>{
    setLoader(value)
  }

  // ouverture du modal
  const handleOpenModal = (
    id = '',
    libelle = '',
    description = '',
    donneesSup = [],

  ) => {
    showLoader(true)
    setInitialModal({
        id:  id,
        libelle:  libelle,
        description: description,  
        donneesSup:   donneesSup, 
    })
    //Mise à jour du titre
    id === '' ? setTitle('Nouveau Profil ') : setTitle(`Modifier profil ${libelle}`)
    setOpenModal(true)
    showLoader(false)
  }
  // Ouverture du modal Droits
  const editDroits = (titre, droits)=>{
    setInitialModalDroits({
      titre: titre,  
      droits: droits, 
  })
  
  setOpenModalDroits(true)
  }
  
  // Modal Supression 
  const FuncSuppr = (id) => {
    setOpenOuiNon(true)
    setIdSuppr(id)
  }

  // suppression d'un  Profil
  const supprProfil = async (values) => {
    let response = ''
    const headers = {
      Authorization: cookieInfo,
    }
   
      response = await axios.post(
        'Profils/DeleteProfils.php?id='+values,
        { values },
        { headers },
      )
      handleCloseModalOuiNon()

    return response.data
  }

  // suppression d'un Profils
  const supProfils = useMutation(supprProfil, {
    onSuccess: (data) => {
      queryClient.invalidateQueries('listeProfils')
      
     setNotify({
        type: data.reponse,
        message: data.message,
      })
      setOpenNotif(true)
     
    },
    onError: () => {
      props.setNotify({
        message: 'Connexion au service impossible',
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
      field: 'profil_libelle',
      hide: false,
      editable: false,
      headerName: 'Libelle',
      width: 150,
      columnResizeIcon: true,
    },
    {
      field: 'Profil_description',
      hide: false,
      editable: false,
      headerName: 'Description',
      width: 520,
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
                e.row.profil_libelle,
                e.row.Profil_description,              
                e.row.donneesSup,              
              )
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
                editDroits(e.row.profil_libelle , e.row.donneesSup)
                  
                } else {
                  noRightFunc()
                }
              }}>
              Modifier les droits
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
    {
      loader === true &&  (
        <Paper elevation={0} className='paperLoad'>
          <Controls.SpinnerBase />
        </Paper>
      )
    }
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
      <FormProfils
        openModal={openModal}
        handleClose={handleCloseModal}
        initialModal={initialModal}
        titreModal={title}
        queryClient={queryClient}
        setNotify={setNotify}
        setOpenNotif={setOpenNotif}
      />
      <FormDroits
        openModal={openModalDroits}
        handleClose={handleCloseModalDroits}
        initialModal={initialModalDroits}
        titreModal={titleDroits}
     //   queryClient={queryClient}
      //  elt={droits}
        setNotify={setNotify}
        setOpenNotif={setOpenNotif}
      />
      <ModalOuiNon
        open={openOuiNon}
        onClose={handleCloseModalOuiNon}
        titre='Supprimer?'
        message={'Voulez vous Supprimer ce Profil ?'}
        non='Annuler'
        oui='Oui'
        deconnect={() => supProfils.mutate(idSuppr, {
          onSuccess: () => {

          },
          onError: (e) => {
            console.log(e)
            
          },
        })}
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

export default VueProfils
