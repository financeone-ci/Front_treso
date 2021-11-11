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
import TiersForm from './TiersForm'
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
import { useHistory } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(0.5),
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
}))

function Tiers(props) {
  // Lignes du tableau
  const [listTiers, setListTiers] = useState([])
  const [defautType, setDefautType] = useState([])
  const [listTypeTiers, setListTypeTiers] = useState([])
  const [loader, setLoader] = useState(false)
  const [openTiers, setOpenTiers] = useState(false)
  // valeurs initiales
  const [openNotif, setOpenNotif] = useState(false)

  const [opens_, setOpens_] = React.useState(false) // statut du modal suppression
  const [idTiers, setidTiers] = React.useState('') // idTiers à editer ou supprimer?
  const [init, setInit] = useState({
    adresse: '',
    beneficiaire: '',
    civilite: '',
    code: '',
    fonction: '',
    fournisseur: '',
    mp: '',
    nom: '',
    ref: '',  
    tel: '',  
    id: 0,
    type: []
  })
  const [notify, setNotify] = useState({
    type: '',
    message: '',
  })


  const handleCloseModal_ = () => {
    setOpens_(false)
  }
  //Supression du tiers
  const EffacerTiers = (id) => {
    axios({
      url: `/tiers/tiers.php?type=D&id=${id}`,
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

          fetch(Constantes.URL + '/tiers/tiers.php?type=R')
            .then((response) => response.json())
            .then((data) => setListTiers(data.infos))
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
    setidTiers(id)
  } 
  
  var history = useHistory()
  const VersCompte =(code)=>{
    history.push('/accueil/parametre/compte-tiers/'+ code)
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
      field: 'CODE_TIERS',
      hide: false,
      editable: false,
      headerName: 'CODE TIERS',
      width: 130,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: 'ADRESSE_TIERS',
      hide: false,
      editable: false,
      headerName: 'ADRESSE',
      width: 200,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: 'BENEFICIAIRE_TIERS',
      hide: false,
      editable: false,
      headerName: 'BENEFICIAIRE',
      width: 200,
      columnResizeIcon: true,
    },
    {
      field: 'REF_TIERS',
      hide: false,
      editable: false,
      headerName: 'REFERENCE',
      width: 150,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    
    {
      field: 'NOM_REPRESENTANT_TIERS',
      hide: false,
      editable: false,
      headerName: 'NOM COMPLET ',
      width: 400,
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
                ? <>
                    {handleClickOpenTiers(
                    e.row.id,
                    e.row.ADRESSE_TIERS,
                    e.row.BENEFICIAIRE_TIERS,
                    e.row.CIV_REPRESENTANT_TIERS,
                    e.row.CODE_TIERS,
                    e.row.FONCTION_REPRESENTANT_TIERS,
                    e.row.FOURNISSEUR_TIERS,
                    e.row.MP_DEFAUT_TIERS,
                    e.row.NOM_REPRESENTANT_TIERS,
                    e.row.REF_TIERS,
                    e.row.TEL_TIERS,
                    e.row.type
                )}
                    {
                    //handleClickOpenTiers(e.row.id)
                    }
                </>
                    
               
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
              onClick={() =>   VersCompte(e.row.CODE_TIERS)
              }>
              Comptes
            </MenuItem>
          </MenuTable>
        </>
      ),
    },
  ]

  // recuperation des utilisateurs
  useEffect(() => {
    setLoader(true)
    fetch(Constantes.URL + '/tiers/tiers.php?type=R')
      .then((response) => response.json())
      .then((data) => {
        setListTiers(data.infos)
      })
    setLoader(false)
  }, [])

 
      
      // Ouverture modal profils
  const handleClickOpenTiers = (
    idTiers = 0,
    adresseTiers= '',
    beneficiaireTiers= '',
    civiliteTiers= '',
    codeTiers= '',
    fonctionTiers= '',
    fournisseurTiers= '',
    mpTiers='',
    nomTiers= '',
    refTiers= '',  
    telTiers= '',  
    typeTiers = []
    
  ) => {
    
     
    setInit({
     id: idTiers, 
    adresse: adresseTiers,
    beneficiaire: beneficiaireTiers,
    civilite: civiliteTiers,
    code: codeTiers,
    fonction: fonctionTiers,
    fournisseur: fournisseurTiers,
    mp: mpTiers,
    nom: nomTiers,
    ref: refTiers,  
    tel: telTiers, 
    type: typeTiers,
    })
    
    setOpenTiers(true)


    
  }
  
  const handleCloseUser = () => {
    setOpenTiers(false)
  }

  ////////////// Droits de l'utilisateur
  var MachaineDeCrypte = CryptFunc(localStorage.getItem('_Drt'), 0)
  const leMenu = GroupBy(MachaineDeCrypte)
  const DroitsUser = leMenu.group['Entités'][2]

  // fonction pas assez de droits
  const noRightFunc = () => {
    setNotify({
      type: 'error',
      message: 'Droits insuffisants',
    })

    setOpenNotif(true)
  }
 
  useEffect(()=>{
    // setLoader(true)
     fetch(Constantes.URL + '/tiers/type_tiers.php?type=R')
       .then((response) => response.json())
       .then((data) => setListTypeTiers(data.infos)
       )
   },[])
   

  const classes = useStyles()
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
                  ? handleClickOpenTiers()
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
              donnees={listTiers}
              onRowClick={(e) => {}}
              pagination
            />
          </Grid>{' '}
          <TiersForm
            listTypeTiers={listTypeTiers}
            setListTiers={setListTiers}
            initial_={init}
          //  defautType={defautType}
            handleClose={handleCloseUser}
            open={openTiers}
            titreModal={
              init.id == ''
                ? 'Nouveau tiers'
                : 'Modifier tiers: ' + init.code
            }
            infoCookie={props.infoCookie}
          />
        </Grid>
      )}
      <ModalOuiNon
        open={opens_}
        onClose={handleCloseModal_}
        titre='Supprimer?'
        message={'Voulez vous Supprimer cet tiers ?'}
        non='Annuler'
        oui='Oui'
        deconnect={() => EffacerTiers(idTiers)}
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

export default Tiers
