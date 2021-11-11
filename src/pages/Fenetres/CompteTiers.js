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
import CompteTiersForm from './CompteTiersForm'
import CreateIcon from '@material-ui/icons/Create'
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep'
import IconButton from '@material-ui/core/IconButton'
import ModalOuiNon from '../../composants/controls/modal/ModalOuiNon'
import axios from '../../api/axios'
import { Notification } from '../../composants/controls/toast/MyToast'
import CryptFunc from '../../functions/CryptFunc'
import GroupBy from '../../functions/GroupBy'
import {
  useParams
} from "react-router-dom";


const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(0.5),
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
}))

function CompteTiers(props) {

    // Lignes du tableau
    const [listCompteTiers, setListCompteTiers] = useState([])
    const [loader, setLoader] = useState(false)
    const [openCompteTiers, setOpenCompteTiers] = useState(false)
    const [listTiers, setListTiers] = useState([])
    const [defaultTiers, setDefaultTiers] = useState([])

   // valeurs initiales
  const [openNotif, setOpenNotif] = useState(false)

  const [opens_, setOpens_] = React.useState(false) // statut du modal suppression
  const [idProf, setidProf] = React.useState('') // idprofil à editer ou supprimer?


  // Intialisation des champs
  const [init, setInit] = useState({
    id: 0,
    rib_compte_tiers: '',
    iban_compte_tiers: '',
    swift_compte_tiers: '',
    banque_id: 0,
    adresse_banque: '',
    id_tiers: 0,
    libelle_compte_tiers: '',
    banque: '',
    code_tiers: '', 
  })

  // Notification après chaque action
  const [notify, setNotify] = useState({
    type: '',
    message: '',
  })
  
  //
  const handleCloseModal_ = () => {
    setOpens_(false)
  }

  //Supression du code budgetaire
  const StopCnx = (id) => {
    axios({
      url: `/tiers/compte_tiers.php?type=D&id=${id}`,
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

          fetch(Constantes.URL + '/tiers/compte_tiers.php?type=R&id=R&read_all')
            .then((response) => response.json())
            .then((data) => setListCompteTiers(data.infos))
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

  // Modal Supression du code budgetaire
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
      field: 'RIB_COMPTE_TIERS',
      hide: false,
      editable: false,
      headerName: 'Rib compte tiers',
      width: 150,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: 'IBAN_COMPTE_TIERS',
      hide: false,
      editable: false,
      headerName: 'Iban compte tiers',
      width: 150,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: 'SWIFT_COMPTE_TIERS',
      hide: false,
      editable: false,
      headerName: 'Swift compte tiers',
      width: 150,
      columnResizeIcon: true,
      // resizable: 'true',
    },

      {
        field: 'ADRESSE_BANQUE',
        hide: false,
        editable: false,
        headerName: 'Addresse banque',
        width: 150,
        columnResizeIcon: true,
        // resizable: 'true',
      },
      {
        field: 'LIBELLE__COMPTE_TIERS',
        hide: false,
        editable: false,
        headerName: 'Libelle compte tiers',
        width: 150,
        columnResizeIcon: true,
        // resizable: 'true',
      },
      {
        field: 'CODE_BANQUE',
        hide: false,
        editable: false,
        headerName: 'Code Banque',
        width: 150,
        columnResizeIcon: true,
        // resizable: 'true',
      },
      {
        field: 'CODE_TIERS',
        hide: false,
        editable: false,
        headerName: 'Code Tiers',
        width: 150,
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
              handleClickOpenCompteTiers(
                e.row.id,
                e.row.RIB_COMPTE_TIERS,
                e.row.IBAN_COMPTE_TIERS,
                e.row.SWIFT_COMPTE_TIERS,
                e.row.BANQ_ID,
                e.row.ADRESSE_BANQUE,
                e.row.ID_TIERS,
                e.row.LIBELLE__COMPTE_TIERS,
                e.row.ID_BANQUE,
                e.row.CODE_TIERS,
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


  // recuperation des codes budgetaires
  useEffect(() => {
    setLoader(true)
    fetch(Constantes.URL + '/tiers/compte_tiers.php?type=R&codetiers='+codeTiers)
      .then((response) => response.json())
      .then((data) => {
        setListCompteTiers(data.infos)   
      })
    setLoader(false)
  }, [])


  /////////////// Ouverture du modal des codes budgetaires
  const handleClickOpenCompteTiers = (
    id = 0,
    rib_compte_tiers = '',
    iban ='',
    swift = '',
    banq_id = 0,
    adresse ='',
    tiers_id = 0,
    libelle ='',
    banque ='',
    tiers ='', 
  ) => {
    setInit({
    id: id,
    rib_compte_tiers: rib_compte_tiers,
    iban_compte_tiers: iban,
    swift_compte_tiers: swift,
    banque_id: banq_id,
    adresse_banque: adresse,
    id_tiers: tiers_id,
    libelle_compte_tiers: libelle,
    banque: banque,
    code_tiers: tiers,
    })

    setOpenCompteTiers(true)
  }

  const handleCloseCompteTiers = () => {
    setOpenCompteTiers(false)
  }

  ////////////// Droits de l'utilisateur
  var MachaineDeCrypte = CryptFunc(localStorage.getItem('_Drt'), 0)
  const leMenu = GroupBy(MachaineDeCrypte)
  const DroitsUser = leMenu.group['Entités'][2]

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
let { codeTiers } = useParams();

  return (
    <React.Suspense fallback={<Controls.SpinnerBase />}>
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
                handleClickOpenCompteTiers()
                : noRightFunc()
              } }
              className={classes.button}
              startIcon={<AddIcon />}>
              Créer
            </Buttons>
           Code du tiers: {codeTiers}
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
              donnees={listCompteTiers}
              onRowClick={(e) => {}}
              pagination
            />

          </Grid>{' '}
          <CompteTiersForm
            setListCompteTiers={setListCompteTiers}
            initial_={init}
            handleClose={handleCloseCompteTiers}
            open={openCompteTiers}
            codeTiers={codeTiers}
            titreModal={
              init.id == ''
                ? 'Nouveau Compte Tiers'
                : 'Modifier Compte Tiers: ' + init.libelle_compte_tiers
            }
            infoCookie={props.infoCookie}
          />
         

        </Grid>
      )}

      <ModalOuiNon
        open={opens_}
        onClose={handleCloseModal_}
        titre='Supprimer?'
        message={'Voulez vous Supprimer cet Compte Tiers ?' }
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
  </React.Suspense>
    
  )
}

export default CompteTiers
