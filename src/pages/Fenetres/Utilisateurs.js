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
import UtilisateursForm from './UtilisateursForm'
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

function Utilisateurs(props) {
  // Lignes du tableau
  const [listUsers, setListUsers] = useState([])
  const [loader, setLoader] = useState(false)
  const [openUser, setOpenUser] = useState(false)
  // valeurs initiales
  const [openNotif, setOpenNotif] = useState(false)

  const [opens_, setOpens_] = React.useState(false) // statut du modal suppression
  const [idProf, setidProf] = React.useState('') // idprofil à editer ou supprimer?
  const [init, setInit] = useState({
    login: '',
    email: '',
    tel: '',
    role: '',
    profil: '',
    id: 0,
    idprofil: '',
    nom: '',
    prenom: '',
    actif: '',
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
      url: `/user.php?type=D&id=${id}`,
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

          fetch(Constantes.URL + '/user.php?type=R&read_all')
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
      field: 'user_nom',
      hide: false,
      editable: false,
      headerName: 'Nom',
      width: 150,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: 'user_prenom',
      hide: false,
      editable: false,
      headerName: 'Prénoms',
      width: 300,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: 'user_email',
      hide: false,
      editable: false,
      headerName: 'Email',
      width: 250,
      columnResizeIcon: true,
    },
    {
      field: 'user_role',
      hide: false,
      editable: false,
      headerName: 'Role',
      width: 150,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: 'profil_libelle',
      hide: false,
      editable: false,
      headerName: 'Profil',
      width: 200,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: 'user_actif',
      hide: false,
      editable: false,
      headerName: ' ',
      width: 30,
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
            onClick={() => {
              DroitsUser.droits_modifier == 1
                ? handleClickOpenUser(
                    e.row.id,
                    e.row.user_login,
                    e.row.user_email,
                    e.row.user_tel,
                    e.row.user_role,
                    e.row.profil_libelle,
                    e.row.id_profil,
                    e.row.user_nom,
                    e.row.user_prenom,
                    e.row.user_actif,
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

  // recuperation des utilisateurs
  useEffect(() => {
    setLoader(true)
    fetch(Constantes.URL + '/user.php?type=R&read_all')
      .then((response) => response.json())
      .then((data) => {
        setListUsers(data.infos)
      })
    setLoader(false)
  }, [])

  // Ouverture modal profils
  const handleClickOpenUser = (
    iduser = 0,
    loginuser = '',
    emailuser = '',
    teluser = '',
    roleuser = '',
    profiluser = '',
    idprofil = 0,
    nomuser = '',
    prenomuser = '',
    actifuser = 0,
  ) => {
    setInit({
      login: loginuser,
      email: emailuser,
      tel: teluser,
      role: roleuser,
      profil: profiluser,
      id: iduser,
      idprofil: idprofil,
      nom: nomuser,
      prenom: prenomuser,
      actif: actifuser,
    })

    setOpenUser(true)
  }
  const handleCloseUser = () => {
    setOpenUser(false)
  }

  ////////////// Droits de l'utilisateur
  var MachaineDeCrypte = CryptFunc(localStorage.getItem('_Drt'), 0)
  const leMenu = GroupBy(MachaineDeCrypte)
  const DroitsUser = leMenu.group['Profils et utilisateurs'][1]

  // fonction pas assez de droits
  const noRightFunc = () => {
    setNotify({
      type: 'error',
      message: 'Droits insuffisants',
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
                DroitsUser.droits_creer == 1
                  ? handleClickOpenUser()
                  : noRightFunc()
              }}
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
          <UtilisateursForm
            setListUsers={setListUsers}
            initial_={init}
            handleClose={handleCloseUser}
            open={openUser}
            titreModal={
              init.id == ''
                ? 'Nouvel utilisateur'
                : 'Modifier utilisateur: ' + init.login
            }
            infoCookie={props.infoCookie}
          />
        </Grid>
      )}
      <ModalOuiNon
        open={opens_}
        onClose={handleCloseModal_}
        titre='Supprimer?'
        message={'Voulez vous Supprimer cet utilisateur ?'}
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

export default Utilisateurs
