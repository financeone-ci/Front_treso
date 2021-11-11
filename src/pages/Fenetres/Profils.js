/** @format */
import React, { useEffect, useState } from 'react'
import PageHeader from '../../composants/PageHeader'
import TableauBasic from '../../composants/tableaux/TableauBasic'
import { Paper, Grid } from '@material-ui/core'
import Controls from '../../composants/controls/Controls'
import Constantes from '../../api/Constantes'
import ListeDeroulante from '../../composants/liste/ListeDeroulante'
import BarreButtons from '../../composants/BarreButtons'
import Buttons from '../../composants/controls/Buttons'
import AddIcon from '@material-ui/icons/Add'
import ListAltIcon from '@material-ui/icons/ListAlt'
import { makeStyles } from '@material-ui/core/styles'
import ProfilsForm from './ProfilsForm'
import CreateIcon from '@material-ui/icons/Create'
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep'
import IconButton from '@material-ui/core/IconButton'
import ModalOuiNon from '../../composants/controls/modal/ModalOuiNon'
import axios from '../../api/axios'
import { Notification } from '../../composants/controls/toast/MyToast'
import DroitsForm from './DroitsForm'
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

function Profils(props) {
  // valeurs initiales
  const [init, setInit] = useState({ libelle: '', description: '', id: 0 })
  const [notify, setNotify] = useState({
    type: '',
    message: '',
  })
  const [openNotif, setOpenNotif] = useState(false)
  const [titreTableau, setTitreTableau] = useState('')

  const [opens_, setOpens_] = React.useState(false)
  const [idProf, setidProf] = React.useState('')

  // Lignes du tableau
  const [listDroits, setListDroits] = useState({})
  const [listProfils, setListProfils] = useState([])
  const [loader, setLoader] = useState(false)
  const [openProfil, setOpenProfil] = useState(false)
  const [openDroit, setOpenDroit] = useState(false)
  const [disabled, setDisabled] = useState(true)
  // state bouton modifier droits

  // idprofil à editer ou supprimer?

  const handleCloseModal_ = () => {
    setOpens_(false)
  }

  //Supression du profil
  const StopCnx = (id) => {
    axios({
      url: `/Profils.php?type=D&id=${id}`,
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

          fetch(Constantes.URL + '/Profils.php?type=R')
            .then((response) => response.json())
            .then((data) => setListProfils(data.infos))
          setLoader(false)
          ///////////////////
        } else {
          setNotify({
            type: 'error',
            message: 'Suppression impossible',
          })
          setOpenNotif(true)
        }
      })
      .catch((error) => {
        console.log(error)
      })
    setDisabled(true)
    setListDroits({})
    setTitreTableau('')
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
      field: 'profil_libelle',
      hide: false,
      editable: false,
      headerName: 'Profils',
      minWidth: 150,
      columnResizeIcon: true,
    },
    {
      field: 'profil_description',
      hide: false,
      editable: false,
      headerName: 'Description',
      minWidth: 350,
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
            aria-label='delete'
            size='small'
            onClick={() => {
              DroitsUser.droits_creer == 1
                ? handleClickOpenProfil(
                    e.row.id,
                    e.row.profil_libelle,
                    e.row.profil_description,
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

  useEffect(() => {
    setLoader(true)
    fetch(Constantes.URL + '/Profils.php?type=R')
      .then((response) => response.json())
      .then((data) => setListProfils(data.infos))
    setLoader(false)
  }, [])

  // console.log(listProfils)

  const AfficheDroits = (idProfil) => {
    fetch(Constantes.URL + `/droits.php?type=R&idprofil=${idProfil}`)
      .then((response) => response.json())
      .then((data) => {
        setListDroits(data.infos)
        setTitreTableau(data.infos[0].profil_libelle)
      })
    setDisabled(false)
  }

  // Ouverture modal profils
  const handleClickOpenProfil = (
    idprofil = 0,
    libelleprofil = '',
    descriptionprofil = '',
  ) => {
    setInit({
      libelle: libelleprofil,
      description: descriptionprofil,
      id: idprofil,
    })

    setOpenProfil(true)
  }
  const handleCloseProfil = () => {
    setOpenProfil(false)
  }

  // ouverture modal droits profil
  const handleClickOpenDroit = () => {
    setOpenDroit(true)
  }
  const handleCloseDroit = () => {
    setOpenDroit(false)
  }

  const classes = useStyles()
  ////////////// Droits de l'utilisateur
  var MachaineDeCrypte = CryptFunc(localStorage.getItem('_Drt'), 0)
  const leMenu = GroupBy(MachaineDeCrypte)
  const DroitsUser = leMenu.group['Profils et utilisateurs'][0]

  // fonction pas assez de droits
  const noRightFunc = () => {
    setNotify({
      type: 'error',
      message: 'Droits insuffisants',
    })
    setOpenNotif(true)
  }

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
                  ? handleClickOpenProfil()
                  : noRightFunc()
              }}
              className={classes.button}
              startIcon={<AddIcon />}>
              Créer
            </Buttons>
            <Buttons
              disabled={disabled}
              variant='contained'
              color='default'
              size='small'
              onClick={() => {
                DroitsUser.droits_modifier == 1
                  ? handleClickOpenDroit(null)
                  : noRightFunc()
              }}
              className={classes.button}
              startIcon={<ListAltIcon />}>
              Modifier les droits
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
          <Grid item xs={12} sm={6} lg={6}>
            {/**  */}
            <TableauBasic
              disableSelectionOnClick={true}
              col={enteteCol}
              donnees={listProfils}
              onRowClick={(e) => AfficheDroits(e.row.id)}
            />
          </Grid>{' '}
          <Grid item xs={12} sm={6} lg={6}>
            <ListeDeroulante
              donnees={listDroits}
              style={{ marginLeft: '110px' }}
              titre={titreTableau}
            />
          </Grid>
          <ProfilsForm
            setListProfils={setListProfils}
            initial_={init}
            handleClose={handleCloseProfil}
            open={openProfil}
            titreModal={
              init.id == 0
                ? 'Nouveau profil'
                : 'Modifier profil ' + init.libelle
            }
            setTitreTableau={setTitreTableau}
          />
          {DroitsUser.droits_modifier == 1 && (
            <DroitsForm
              listDroits={listDroits}
              titre={'Modifier les droits '}
              handleClose={handleCloseDroit}
              open={openDroit}
              AfficheDroits={AfficheDroits}
              setOpenNotif={setOpenNotif}
            />
          )}
        </Grid>
      )}
      {DroitsUser.droits_supprimer == 1 && (
        <ModalOuiNon
          open={opens_}
          onClose={handleCloseModal_}
          titre='Supprimer?'
          message={'Voulez vous Supprimer cet enregistrement ?'}
          non='Annuler'
          oui='Oui'
          deconnect={() => StopCnx(idProf)}
        />
      )}

      <Notification
        type={notify.type}
        message={notify.message}
        open={openNotif}
        setOpen={setOpenNotif}
      />
    </>
  )
}

export default Profils
