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
import ListAltIcon from '@material-ui/icons/ListAlt'
import { makeStyles } from '@material-ui/core/styles'
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

function Sites(props) {
  // valeurs initiales
  const [init, setInit] = useState({ code: '', description: '', id: 0 })
  const [notify, setNotify] = useState({
    type: '',
    message: '',
  })
  const [openNotif, setOpenNotif] = useState(false)
  const [opens_, setOpens_] = React.useState(false)
  const [idSite, setIdSite] = React.useState('')

  ////////////// Droits de l'utilisateur
  var MachaineDeCrypte = CryptFunc(localStorage.getItem('_Drt'), 0)
  const leMenu = GroupBy(MachaineDeCrypte)
  console.log(leMenu.group['Profils et utilisateurs'])
  const DroitsUser = leMenu.group['Profils et utilisateurs'][2]

  const handleCloseModal_ = () => {
    setOpens_(false)
  }

  //Supression du Site
  const StopCnx = (id) => {
    axios({
      url: `/sites.php?type=D&id=${id}`,
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

          fetch(Constantes.URL + '/sites.php?type=R')
            .then((response) => response.json())
            .then((data) => setListSites(data.infos))
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
    setOpens_(false)
  }

  // Modal Supression du Site
  const FuncSuppr = (id) => {
    setOpens_(true)
    setIdSite(id)
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
      field: 'sites_code',
      hide: false,
      editable: false,
      headerName: 'Sites',
      minWidth: 150,
      columnResizeIcon: true,
    },
    {
      field: 'sites_description',
      hide: false,
      editable: false,
      headerName: 'Description',
      width: 550,
      columnResizeIcon: true,
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
                ? handleClickOpenSite(
                    e.row.id,
                    e.row.sites_code,
                    e.row.sites_description,
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
  // Lignes du tableau
  const [listSites, setListSites] = useState([])
  const [loader, setLoader] = useState(false)
  const [openSite, setOpenSite] = useState(false)
  const [disabled, setDisabled] = useState(true) // state bouton modifier droits

  useEffect(() => {
    setLoader(true)
    fetch(Constantes.URL + '/Sites.php?type=R')
      .then((response) => response.json())
      .then((data) => setListSites(data.infos))
    setLoader(false)
  }, [])

  // Ouverture modal Sites
  const handleClickOpenSite = (
    idSite = 0,
    libelleSite = '',
    descriptionSite = '',
  ) => {
    setInit({
      libelle: libelleSite,
      description: descriptionSite,
      id: idSite,
    })

    setOpenSite(true)
  }
  const handleCloseSite = () => {
    setOpenSite(false)
  }

  const classes = useStyles()

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
                  ? handleClickOpenSite()
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
              onClick={() => {}}
              className={classes.button}
              startIcon={<ListAltIcon />}>
              Paramétrer site
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
          <Grid item xs={12} sm={12} lg={12}>
            {/**  */}
            <TableauBasic
              disableSelectionOnClick={true}
              col={enteteCol}
              donnees={listSites}
            />
          </Grid>{' '}
          {/* <SitesForm
            setListSites={setListSites}
            initial_={init}
            handleClose={handleCloseSite}
            open={openSite}
            titreModal={
              init.id == 0 ? 'Nouveau Site' : 'Modifier Site ' + init.libelle
            }
          /> */}
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
          deconnect={() => StopCnx(idSite)}
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

export default Sites
