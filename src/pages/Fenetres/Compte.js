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
import CompteForm from './CompteForm'
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

function Compte(props) {
  // Lignes du tableau
  const [listUsers, setListUsers] = useState([])
  const [loader, setLoader] = useState(false)
  const [openUser, setOpenUser] = useState(false)
  // valeurs initiales
  const [openNotif, setOpenNotif] = useState(false)

  const [opens_, setOpens_] = React.useState(false) // statut du modal suppression
  const [idProf, setidProf] = React.useState('') // idprofil à editer ou supprimer?
  const [init, setInit] = useState({
    id: 0,
    code: '',
    solde_i: 0,
    comptable: '',
    rib: '',
    libelle: '',
    gestionnaire: '',
    civilite: '',
    service: '',
    tel: '',
    email: '',
    banque: '',
    fichier: '',
    societe: '',
    devise: '',
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
      url: `/compte.php?type=D&id=${id}`,
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

          fetch(Constantes.URL + '/compte.php?type=R&read_all')
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
      field: 'CODE_COMPTE',
      hide: false,
      editable: false,
      headerName: 'CODE',
      width: 120,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: 'LIBELLE_COMPTE',
      hide: false,
      editable: false,
      headerName: 'LIBELLE',
      width: 143,
      columnResizeIcon: true,
      // resizable: 'true',
    },

    {
      field: 'RIB',
      hide: false,
      editable: false,
      headerName: 'RIB',
      width: 200,
      columnResizeIcon: true,
    },

    {
      field: 'CODE_DEVISE',
      hide: false,
      editable: false,
      headerName: 'DEVISE',
      width: 160,
      columnResizeIcon: true,
    },

    {
      field: 'TEL_GESTIONNAIRE_COMPTE',
      hide: false,
      editable: false,
      headerName: 'CONTACT',
      width: 180,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: 'COMPTE_COMPTABLE',
      hide: false,
      editable: false,
      headerName: 'COMPTE COMPTABLE ',
      width: 200,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: 'CODE_BANQUE',
      hide: false,
      editable: false,
      headerName: 'BANQUE',
      width: 180,
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
                    e.row.CODE_COMPTE,
                    e.row.SOLDE_INITIAL_COMPTE,
                    e.row.COMPTE_COMPTABLE,
                    e.row.RIB,
                    e.row.LIBELLE_COMPTE,
                    e.row.GESTIONNAIRE_COMPTE,
                    e.row.CIV_GESTIONNAIRE_COMPTE,
                    e.row.SERVICE_GESTIONNAIRE_COMPTE,
                    e.row.TEL_GESTIONNAIRE_COMPTE,
                    e.row.EMAIL_GESTIONNAIRE_COMPTE,
                    e.row.ID_BANQUE,
                    e.row.COMPTE_FICHIER,
                    e.row.ID_SOCIETE,
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

  // recuperation des comptes
  useEffect(() => {
    setLoader(true)
    fetch(Constantes.URL + '/compte.php?type=R')
      .then((response) => response.json())
      .then((data) => {
        setListUsers(data.infos)
      })
    setLoader(false)
  }, [])

  // Ouverture modal profils
  const handleClickOpenUser = (
    idCpt = 0,
    codeCpt = '',
    solde_iCpt = 0,
    comptableCpt = '',
    ribCpt = '',
    libelleCpt = '',
    gestionnaireCpt = '',
    civiliteCpt = '',
    serviceCpt = '',
    telCpt = '',
    emailCpt = '',
    banqueCpt = '',
    fichierCpt = '',
    societeCpt = '',
    deviseCpt = '',
  ) => {
    setInit({
      id: idCpt,
      code: codeCpt,
      solde: solde_iCpt,
      comptable: comptableCpt,
      rib: ribCpt,
      libelle: libelleCpt,
      gestionnaire: gestionnaireCpt,
      civilite: civiliteCpt,
      service: serviceCpt,
      tel: telCpt,
      email: emailCpt,
      banque: banqueCpt,
      fichier: fichierCpt,
      societe: societeCpt,
      devise: deviseCpt,
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
          <CompteForm
            setListUsers={setListUsers}
            initial_={init}
            handleClose={handleCloseUser}
            open={openUser}
            titreModal={
              init.id == '' ? 'Nouveau compte' : 'Modifier compte: ' + init.code
            }
            infoCookie={props.infoCookie}
          />
        </Grid>
      )}
      <ModalOuiNon
        open={opens_}
        onClose={handleCloseModal_}
        titre='Supprimer?'
        message={'Voulez vous Supprimer ce compte ?'}
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

export default Compte
