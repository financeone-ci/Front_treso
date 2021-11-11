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
import DevisesForm from './DevisesForm'
import CreateIcon from '@material-ui/icons/Create'
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep'
import IconButton from '@material-ui/core/IconButton'
import ModalOuiNon from '../../composants/controls/modal/ModalOuiNon'
import axios from '../../api/axios'
import { Notification } from '../../composants/controls/toast/MyToast'
import CryptFunc from '../../functions/CryptFunc'
import GroupBy from '../../functions/GroupBy'
import OfflinePinIcon from '@material-ui/icons/OfflinePin';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(0.5),
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
}))

function Devises(props) {
    // Lignes du tableau
    const [listDevises, setListDevises] = useState([])
    const [loader, setLoader] = useState(false)
    const [openDevise, setOpenDevise] = useState(false)
  // valeurs initiales
  const [openNotif, setOpenNotif] = useState(false)

  const [opens_, setOpens_] = React.useState(false) // statut du modal suppression
  const [idProf, setidProf] = React.useState('') // idprofil à editer ou supprimer?
  const [init, setInit] = useState({
    code: '',
    libelle: '',
    taux: '',
    base: '',
    cent: '',
    id: 0,
    sigle: '',
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
      url: `/devise.php?type=D&id=${id}`,
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

          fetch(Constantes.URL + '/devise.php?type=R&read_all')
            .then((response) => response.json())
            .then((data) => setListDevises(data.infos))
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

  // Modal Supression du Devise
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
      field: 'CODE_DEVISE',
      hide: false,
      editable: false,
      headerName: 'Code devise',
      width: 150,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: 'LIBELLE_DEVISE',
      hide: false,
      editable: false,
      headerName: 'Libelle devise',
      width: 300,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: 'TAUX_DEVISE',
      hide: false,
      editable: false,
      headerName: 'taux devise',
      width: 100,
      columnResizeIcon: true,
    },
    {
      field: 'DEVISE_DE_BASE',
      hide: false,
      editable: false,
      headerName: 'Devise de référence',
      width: 150,
      columnResizeIcon: true,
      // resizable: 'true',
      
      renderCell: (e) =>  
          ( e.formattedValue == 1 ? 
       
            <OfflinePinIcon
              fontSize='inherit'
              color='secondary'
              className='OfflinePinIcon'
            />
           :<>
            </>)
      ,
    },
    {
      field: 'LIBELLE_CENTIMES',
      hide: false,
      editable: false,
      headerName: 'Centimes',
      width: 200,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: 'SIGLE_DEVISE',
      hide: false,
      editable: false,
      headerName: 'sigle',
      width: 100,
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
              
              DroitsUser.droits_modifier == 1 
              ? handleClickOpenDevise(
                e.row.id,
                e.row.CODE_DEVISE,
                e.row.LIBELLE_DEVISE,
                e.row.TAUX_DEVISE,
                e.row.DEVISE_DE_BASE,
                e.row.LIBELLE_CENTIMES,
                e.row.SIGLE_DEVISE,
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
              DroitsUser.droits_supprimer == 1 
              ? FuncSuppr(e.row.id)
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
    fetch(Constantes.URL + '/devise.php?type=R')
      .then((response) => response.json())
      .then((data) => {
        setListDevises(data.infos)
      })
    setLoader(false)
  }, [])

  // Ouverture modal devises
  const handleClickOpenDevise = (
    iddevise = 0,
    code_devise = '',
    libelle_devise = '',
    taux_devise = '',
    devise_de_base = 0,
    libelle_centimes = '',
    sigle_devise = '',
  ) => {
    setInit({
      id: iddevise,
      code: code_devise,
      libelle: libelle_devise,
      taux: taux_devise,
      base: devise_de_base,
      centimes: libelle_centimes,
      sigle: sigle_devise,
    })

    setOpenDevise(true)
  }
  const handleCloseDevise = () => {
    setOpenDevise(false)
  }

  ////////////// Droits de l'utilisateur
  var MachaineDeCrypte = CryptFunc(localStorage.getItem('_Drt'), 0)
  const leMenu = GroupBy(MachaineDeCrypte)
  const DroitsUser = leMenu.group['Eléments paiements'][1]

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
                handleClickOpenDevise()
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
              donnees={listDevises}
              onRowClick={(e) => {}}
              pagination
            />
          </Grid>{' '}
          <DevisesForm
            setListDevises={setListDevises}
            initial_={init}
            handleClose={handleCloseDevise}
            open={openDevise}
            titreModal={
              init.id == ''
                ? 'Nouvelle devise'
                : 'Modifier devise: ' + init.code
            }
            infoCookie={props.infoCookie}
          />
        </Grid>
      )}
      <ModalOuiNon
        open={opens_}
        onClose={handleCloseModal_}
        titre='Supprimer?'
        message={'Voulez vous Supprimer cette devise ?' }
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

export default Devises