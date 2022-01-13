/** @format */
import React, { useEffect, useState, useCallback } from 'react'
import PageHeader from '../../composants/PageHeader'
import TableauBasic from '../../composants/tableaux/TableauBasic'
import { Paper, Grid } from '@material-ui/core'
import Controls from '../../composants/controls/Controls'
import Constantes from '../../api/Constantes'
import BarreButtons from '../../composants/BarreButtons'
import Buttons from '../../composants/controls/Buttons'
import AddIcon from '@material-ui/icons/Add'
import { makeStyles } from '@material-ui/core/styles'
import BanqueForm from './BanqueForm'
import MesureForm from './MesureForm'
import CreateIcon from '@material-ui/icons/Create'
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep'
import IconButton from '@material-ui/core/IconButton'
import ModalOuiNon from '../../composants/controls/modal/ModalOuiNon'
import axios from '../../api/axios'
import { Notification } from '../../composants/controls/toast/MyToast'
import CryptFunc from '../../functions/CryptFunc'
import GroupBy from '../../functions/GroupBy'
import ListIcon from '@material-ui/icons/List'
import MenuTable from '../../composants/controls/MenuTable'
import MenuItem from '@material-ui/core/MenuItem'

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(0.5),
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
}))

function Banque(props) {
  //******************** Droits de l'utilisateur *******************************//
  var MachaineDeCrypte = CryptFunc(localStorage.getItem('_Drt'), 0)
  const leMenu = GroupBy(MachaineDeCrypte)
  const DroitsUser = leMenu.group['Entités'][1]
  //******************** Droits de l'utilisateur *******************************//

  // State de départ
  const [listBanqs, setListBanqs] = useState([])
  const [listMesures, setListMesures] = useState({})
  const [loader, setLoader] = useState(false)
  const [openBanq, setOpenBanq] = useState(false)
  const [openMesure, setOpenMesure] = useState(false)
  const [openNotif, setOpenNotif] = useState(false)
  const [opens_, setOpens_] = useState(false) // statut du modal suppression
  const [idBanq, setIdBanq] = useState('') // idprofil à editer ou supprimer ?

  // State initial champs banque
  const [init, setInit] = useState({
    code: '',
    libelle: '',
    dg: '',
    gestionnaire: '',
    adresse: '',
    adresse_web: '',
    id: 0,
    contact: '',
  })
  // State initial champs mesures banque
  const [initMesure, setInitMesure] = useState({})
  const [notify, setNotify] = useState({
    type: '',
    message: '',
  })

  const handleCloseModal_ = () => {
    setOpens_(false)
  }

  const menu = ['Mesures chèque']

  //Supression du profil
  const StopCnx = (id) => {
    axios({
      url: `/banque.php?type=D&id=${id}`,
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

          fetch(Constantes.URL + '/banque.php?type=R&read_all')
            .then((response) => response.json())
            .then((data) => setListBanqs(data.infos))
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
    setIdBanq(id)
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
      field: 'CODE_BANQUE',
      hide: false,
      editable: false,
      headerName: 'Code',
      width: 150,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: 'LIBELLE_BANQUE',
      hide: false,
      editable: false,
      headerName: 'Description',
      width: 280,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: 'GESTIONNAIRE',
      hide: false,
      editable: false,
      headerName: 'Gestionnaire',
      width: 250,
      columnResizeIcon: true,
    },
    {
      field: 'ADRESSE_BANQUE',
      hide: false,
      editable: false,
      headerName: 'Adresse',
      width: 150,
      columnResizeIcon: true,
      // resizable: 'true',
    },

    {
      field: 'ADRESSE_WEB_BANQUE',
      hide: false,
      editable: false,
      headerName: 'site Web',
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
            onClick={() => {
              DroitsUser.droits_modifier == 1
                ? handleClickOpenBanq(
                    e.row.CODE_BANQUE,
                    e.row.LIBELLE_BANQUE,
                    e.row.DG,
                    e.row.GESTIONNAIRE,
                    e.row.ADRESSE_BANQUE,
                    e.row.ADRESSE_WEB_BANQUE,
                    e.row.id,
                    e.row.CONTACT_BANQUE,
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
          <MenuTable icone={<ListIcon />}>
            <MenuItem
              onClick={() => {
                DroitsUser.droits_modifier == 1
                  ? handleClickOpenMesure(e.row.id)
                  : noRightFunc()
              }}>
              Mesures
            </MenuItem>
          </MenuTable>
        </>
      ),
    },
  ]

  // chargement du tableau des banques
  useEffect(() => {
    setLoader(true)
    // Recupérer les banques
    fetch(Constantes.URL + `banque.php?type=R`)
      .then((response) => response.json())
      .then((data) => {
        setListBanqs(data.infos)
      })
    setLoader(false)
  }, [])

  // Charger les mesures de la banque
  // const handleClickOpenMesure = useCallback(async (pid) => {
  //   let response = await axios(Constantes.URL + `/Mesures.php?type=R&id=${pid}`)
  //   setInitMesure(response.data.infos)
  //   setOpenMesure(true)
  // }, [])

  const handleClickOpenMesure = useCallback(async (pid) => {
    let response = await axios(Constantes.URL + `/Mesures.php?type=R&id=${pid}`)
    setInitMesure(response.data.infos)
    setOpenMesure(true)
  }, [])

  // Ouverture modal mesures
  const handleClickOpenBanq = (
    codeBanq = '',
    libelleBanq = '',
    dgBanq = '',
    gestionnaireBanq = '',
    adresseBanq = '',
    webBanq = '',
    idBanq = '',
    contactBanq = '',
  ) => {
    setInit({
      code: codeBanq,
      libelle: libelleBanq,
      dg: dgBanq,
      gestionnaire: gestionnaireBanq,
      adresse: adresseBanq,
      adresse_web: webBanq,
      id: idBanq,
      contact: contactBanq,
    })

    setOpenBanq(true)
  }

  const handleClose = () => {
    setOpenBanq(false)
    setOpenMesure(false)
  }

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
              color='secondary'
              size='small'
              onClick={() => {
                DroitsUser.droits_creer == 1
                  ? handleClickOpenBanq()
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
              donnees={listBanqs}
              onRowClick={(e) => {}}
              pagination
            />
          </Grid>{' '}
          <BanqueForm
            setListBanqs={setListBanqs}
            initial_={init}
            handleClose={handleClose}
            open={openBanq}
            titreModal={
              init.id == ''
                ? 'Nouvelle banque'
                : 'Modifier banque: ' + init.code
            }
            infoCookie={props.infoCookie}
          />
          <MesureForm
            initMesure={initMesure}
            handleClose={handleClose}
            open={openMesure}
            titreModal={'Modifier mesures chèque'}
            infoCookie={props.infoCookie}
          />
        </Grid>
      )}
      <ModalOuiNon
        open={opens_}
        onClose={handleCloseModal_}
        titre='Supprimer?'
        message={'Voulez vous Supprimer cette banque ?'}
        non='Annuler'
        oui='Oui'
        deconnect={() => StopCnx(idBanq)}
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

export default Banque
