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
import SocieteForm from './SocieteForm'
import CreateIcon from '@material-ui/icons/Create'
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep'
import IconButton from '@material-ui/core/IconButton'
import ModalOuiNon from '../../composants/controls/modal/ModalOuiNon'
import axios from '../../api/axios'
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

function Societe(props) {
    // Lignes du tableau
    const [listUsers, setListUsers] = useState([])
    const [loader, setLoader] = useState(false)
    const [openUser, setOpenSoc] = useState(false)
  // valeurs initiales
  const [openNotif, setOpenNotif] = useState(false)

  const [opens_, setOpens_] = React.useState(false) // statut du modal suppression
  const [idProf, setidProf] = React.useState('') // idprofil à editer ou supprimer?
  const [init, setInit] = useState({
    code: '',
    tel: '',
    libelle: '',
    complement: '',
    adresse: '',
    email: '',
    id: 0,
    siege: '',
  })
  const [notify, setNotify] = useState({
    type: '',
    message: '',
  })
  

  const handleCloseModal_ = () => {
    setOpens_(false)
  }
  //Supression du profil
  const StopCnx = (id) => {
    axios({
      url: `/societe.php?type=D&id=${id}`,
    })
      .then((response) => {
        if (response.data.reponse == 'success') {
          setNotify({
            type: response.data.reponse,
            message: response.data.message,
          })
          setOpenNotif(true)
          //////////////////
          setLoader(true)

          fetch(Constantes.URL + '/societe.php?type=R&read_all')
            .then((response) => response.json())
            .then((data) => setListUsers(data.infos))
          setLoader(false)
          ///////////////////
        } else {
          setNotify({
            type: 'error',
            message: response.data.message,
          })
          setOpenNotif(true)
        }
      })
      .catch((error) => {
        console.log(error)
      })
    setOpens_(false)
  }

  // Modal Supression du profil
  const FuncSuppr = (id) => {
    setOpens_(true)
    setidProf(id)
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
      field: 'CODE_SOCIETE',
      hide: false,
      editable: false,
      headerName: 'CODE',
      width: 150,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: 'LIBELLE_SOCIETE',
      hide: false,
      editable: false,
      headerName: 'LIBELLE',
      width: 280,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: 'COMPLEMENT_SOCIETE',
      hide: false,
      editable: false,
      headerName: 'COMPLEMENT',
      width: 250,
      columnResizeIcon: true,
    },
    {
      field: 'ADRESSE_SOCIETE',
      hide: false,
      editable: false,
      headerName: 'ADRESSE',
      width: 150,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    

    {
      field: 'EMAIL_SOCIETE',
      hide: false,
      editable: false,
      headerName: 'EMAIL',
      width: 300,
      columnResizeIcon: true,
      // resizable: 'true',
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
            onClick={() =>{
              
              DroitsUser.droits_modifier == 1 ?
              handleClickOpenSoc(
                e.row.CODE_SOCIETE,
                e.row.TEL_SOCIETE,
                e.row.LIBELLE_SOCIETE,
                e.row.COMPLEMENT_SOCIETE,
                e.row.ADRESSE_SOCIETE,
                e.row.EMAIL_SOCIETE,
                e.row.id,
                e.row.SIEGE,
              )
              : noRightFunc()
            }
              
            }>
            <CreateIcon
              fontSize='inherit'
              color='default'
              className='CreateIcon'
            />
          </IconButton>
          <IconButton
            aria-label='delete'
            size='small'
            onClick={() =>{
              DroitsUser.droits_supprimer == 1 ?
               FuncSuppr(e.row.id)
              : noRightFunc()
            } }>
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


  // recuperation des utilisateurs
  useEffect(() => {
    setLoader(true)
    fetch(Constantes.URL + '/societe.php?type=R')
      .then((response) => response.json())
      .then((data) => {
        setListUsers(data.infos)
      })
    setLoader(false)
  }, [])

  // Ouverture modal profils
  const handleClickOpenSoc = (
    codeSoc = '',
    telSoc = '',
    libelleSoc = '',
    complementSoc = '',
    adresseSoc = '',
    emailSoc = '',
    idSoc = '',
    siegeSoc = '',
  ) => {
    setInit({
      code: codeSoc,
      tel: telSoc,
    libelle: libelleSoc,
    complement: complementSoc,
    adresse: adresseSoc,
    email: emailSoc,
    id: idSoc,
    siege: siegeSoc,

    })
    
    setOpenSoc(true)
  }
  const handleCloseUser = () => {
    setOpenSoc(false)
  }

  ////////////// Droits de l'utilisateur
  var MachaineDeCrypte = CryptFunc(localStorage.getItem('_Drt'), 0)
  const leMenu = GroupBy(MachaineDeCrypte)
  const DroitsUser = leMenu.group['Entités'][0]

  // fonction pas assez de droits
  const noRightFunc = () =>{
    setNotify({
      type: 'error',
      message: "Droits insuffisants",
    })
    
    setOpenNotif(true)
  }

  const classes = useStyles()
//console.log(DroitsUser)
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
                DroitsUser.droits_creer == 1 ?
                handleClickOpenSoc()
                : noRightFunc()
              } }
              className={classes.button}
              startIcon={<AddIcon />}>
              Créer
            </Buttons>
          </>
        }
      />
      {loader ? (
        <Paper elevation={0} className='paperLoad'>
          <Controls.SpinnerBase />
        </Paper>
      ) : (
        <Grid container>
          <Grid item xs={12}>
            {/**  */}
            <TableauBasic
              disableSelectionOnClick={true}
              col={enteteCol}
              donnees={listUsers}
              onRowClick={(e) => {}}
              pagination
            />
          </Grid>{' '}
          <SocieteForm
            setListUsers={setListUsers}
            initial_={init}
            handleClose={handleCloseUser}
            open={openUser}
            titreModal={
              init.id == ''
                ? 'Nouvelle société'
                : 'Modifier société: ' + init.code
            }
            infoCookie={props.infoCookie}
          />
        </Grid>
      )}
      <ModalOuiNon
        open={opens_}
        onClose={handleCloseModal_}
        titre='Supprimer?'
        message={'Voulez vous Supprimer cette société ?'}
        non='Annuler'
        oui='Oui'
        deconnect={() => StopCnx(idProf)}
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
