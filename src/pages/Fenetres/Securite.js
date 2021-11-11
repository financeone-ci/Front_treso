/** @format */
import React, { useEffect, useState } from 'react'
import PageHeader from '../../composants/PageHeader'
import TableauBasic from '../../composants/tableaux/TableauBasic'
import { Paper, Grid } from '@material-ui/core'
import Controls from '../../composants/controls/Controls'
import Constantes from '../../api/Constantes'
import BarreButtons from '../../composants/BarreButtons'
import { makeStyles } from '@material-ui/core/styles'
import CreateIcon from '@material-ui/icons/Create'
import IconButton from '@material-ui/core/IconButton'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import SecuriteForm from './SecuriteForm'
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

function Securite(props) {
  // states
  const [init, setInit] = useState({
    taille: 8,
    majuscules: false,
    speciaux: false,
    chiffres: false,
    duree: 0,
    id: 0,
  })
  const [notify, setNotify] = useState({
    type: '',
    message: '',
  })
  const [openNotif, setOpenNotif] = useState(false)
  const [opens_, setOpens_] = React.useState(false)
  const [listSecurite, setListSecurite] = useState([])
  const [loader, setLoader] = useState(false)
  const [openSecurite, setOpenSecurite] = useState(false)
  const [disabled, setDisabled] = useState(true) // state bouton modifier droits

  // Entetes du tableau
  const enteteCol = [
    {
      field: 'id',
      hide: true,
      editable: false,
      headerName: 'id',
      width: 20,
      columnResizeIcon: false,
    },

    {
      field: 'securite_taille',
      hide: false,
      align: 'center',
      editable: false,
      headerName: 'Taille',
      minWidth: 150,
      columnResizeIcon: true,
      renderCell: (params) => <>{params.value + '  caractères'}</>,
    },
    {
      field: 'securite_majuscule',
      hide: false,
      align: 'center',
      editable: false,
      headerName: 'Majuscules',
      width: 150,
      columnResizeIcon: true,
      renderCell: (params) => (
        <strong>
          {params.value == 0 ? (
            <HighlightOffIcon className='iconTab' />
          ) : (
            <CheckCircleOutlineIcon className='iconTab' />
          )}
        </strong>
      ),
    },
    {
      field: 'securite_carc_speciaux',
      hide: false,
      editable: false,
      headerName: 'Caractères spéciaux',
      width: 250,
      align: 'center',
      columnResizeIcon: true,
      renderCell: (params) => (
        <strong>
          {params.value == 0 ? (
            <HighlightOffIcon className='iconTab' />
          ) : (
            <CheckCircleOutlineIcon className='iconTab' />
          )}
        </strong>
      ),
    },
    {
      field: 'securite_chiffres',
      hide: false,
      editable: false,
      headerName: 'Chiffres',
      width: 150,
      columnResizeIcon: true,
      align: 'center',
      renderCell: (params) => (
        <strong>
          {params.value == 0 ? (
            <HighlightOffIcon className='iconTab' />
          ) : (
            <CheckCircleOutlineIcon className='iconTab' />
          )}
        </strong>
      ),
    },
    {
      field: 'valider',
      hide: false,
      editable: false,
      headerName: 'Valider',
      width: 150,
      columnResizeIcon: true,
      align: 'center',
      renderCell: (params) => (
        <strong>
          {params.value == 0 ? (
            <HighlightOffIcon className='iconTab' />
          ) : (
            <CheckCircleOutlineIcon className='iconTab' />
          )}
        </strong>
      ),
    },
    {
      field: 'autoriser',
      hide: false,
      editable: false,
      headerName: 'Autoriser',
      width: 150,
      columnResizeIcon: true,
      align: 'center',
      renderCell: (params) => (
        <strong>
          {params.value == 0 ? (
            <HighlightOffIcon className='iconTab' />
          ) : (
            <CheckCircleOutlineIcon className='iconTab' />
          )}
        </strong>
      ),
    },
    {
      field: 'approuver',
      hide: false,
      editable: false,
      headerName: 'Approuver',
      width: 150,
      columnResizeIcon: true,
      align: 'center',
      renderCell: (params) => (
        <strong>
          {params.value == 0 ? (
            <HighlightOffIcon className='iconTab' />
          ) : (
            <CheckCircleOutlineIcon className='iconTab' />
          )}
        </strong>
      ),
    },
    {
      field: 'securite_duree_pwd',
      hide: false,
      editable: false,
      headerName: 'Durée mot de passe (jours)',
      width: 250,
      align: 'center',
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
              DroitsUser.droits_modifier == 1
                ? handleOpenSecurite(
                    e.row.id,
                    e.row.securite_taille,
                    e.row.securite_majuscule,
                    e.row.securite_carc_speciaux,
                    e.row.securite_chiffres,
                    e.row.securite_duree_pwd,
                    e.row.valider,
                    e.row.autoriser,
                    e.row.approuver,
                  )
                : noRightFunc()
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

  const handleCloseModal_ = () => {
    setOpens_(false)
  }

  const handleCloseSecurite = () => {
    setOpenSecurite(false)
  }

  // // Ouverture modal profils
  const handleOpenSecurite = (
    idsecur = 0,
    taille = 8,
    majuscule = false,
    carc_speciaux = false,
    chiffres = false,
    duree_pwd = 0,
    pvalider = 0,
    pautoriser = 0,
    papprouver = 0,
  ) => {
    setInit({
      id: idsecur,
      securite_taille: taille,
      securite_majuscule: majuscule,
      securite_carc_speciaux: carc_speciaux,
      securite_chiffres: chiffres,
      securite_duree_pwd: duree_pwd,
      valider: pvalider,
      autoriser: pautoriser,
      approuver: papprouver,
    })
    setOpenSecurite(true)
  }

  const classes = useStyles()
  ////////////// Droits de l'utilisateur
  var MachaineDeCrypte = CryptFunc(localStorage.getItem('_Drt'), 0)
  const leMenu = GroupBy(MachaineDeCrypte)
  const DroitsUser = leMenu.group['Audits et sécurité'][2]

  // fonction pas assez de droits
  const noRightFunc = () => {
    setNotify({
      type: 'error',
      message: 'Droits insuffisants',
    })
    setOpenNotif(true)
  }

  // Chargement du tableau des données de sécurité
  useEffect(() => {
    setLoader(true)
    fetch(Constantes.URL + '/securite.php?type=R')
      .then((response) => response.json())
      .then((data) => {
        setListSecurite(data.infos)
      })
    setLoader(false)
  }, [])

  return (
    <>
      <PageHeader icone={props.icone} titrePage={props.titre} />
      <BarreButtons button={''} />

      <BarreButtons />
      {loader ? (
        <Paper elevation={0} className='paperLoad'>
          <Controls.SpinnerBase />
        </Paper>
      ) : (
        <Grid container>
          <Grid item xs={12} sm={12} lg={12}>
            {
              <TableauBasic
                disableSelectionOnClick={true}
                col={enteteCol}
                donnees={listSecurite}
              />
            }
          </Grid>
          {
            <SecuriteForm
              setListSecurite={setListSecurite}
              initial_={init}
              handleClose={handleCloseSecurite}
              open={openSecurite}
              titreModal={'Paramétrage sécurité'}
            />
          }
        </Grid>
      )}
      {
        <Notification
          type={notify.type}
          message={notify.message}
          open={openNotif}
          setOpen={setOpenNotif}
        />
      }
    </>
  )
}

export default Securite
