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
import CategoriePaiementForm from './CategoriePaiementForm'
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

function CategoriePaiement(props) {

    // Lignes du tableau
    const [listCategoriePaiement, setListCategoriePaiement] = useState([])
    const [loader, setLoader] = useState(false)
    const [openCategoriePaiement, setOpenCategoriePaiement] = useState(false)

   // valeurs initiales
  const [openNotif, setOpenNotif] = useState(false)

  const [opens_, setOpens_] = React.useState(false) // statut du modal suppression
  const [idProf, setidProf] = React.useState('') // idprofil à editer ou supprimer?

  // Intialisation des champs
  const [init, setInit] = useState({
    code: '',
    libelle: '',
    id: 0,
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
      url: `/categorie_paiement.php?type=D&id=${id}`,
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

          fetch(Constantes.URL + '/categorie_paiement.php?type=R&read_all')
            .then((response) => response.json())
            .then((data) => setListCategoriePaiement(data.infos))
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

  // Modal Supression du categorie paiement
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
      width: 100,
      columnResizeIcon: true,
    },
    {
      field: 'CODE_CATEGORIE_PAIEMENT',
      hide: false,
      editable: false,
      headerName: 'Code Categorie paiement',
      width: 300,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: 'LIB_CATEGORIE_PAIEMENT',
      hide: false,
      editable: false,
      headerName: 'Libelle Categorie paiement',
      width: 300,
      columnResizeIcon: true,
      // resizable: 'true',
    },
  
    {
      field: 'Actions',
      width: 300,
      align: 'center',
      renderCell: (e) => (
        <>
          <IconButton
            aria-label='update'
            size='small'
            onClick={() =>{
              
              DroitsUser.droits_modifier == 1 ?
              handleClickOpenCategoriePaiement(
                e.row.id,
                e.row.CODE_CATEGORIE_PAIEMENT,
                e.row.LIB_CATEGORIE_PAIEMENT,
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
    fetch(Constantes.URL + '/categorie_paiement.php?type=R')
      .then((response) => response.json())
      .then((data) => {
        setListCategoriePaiement(data.infos)
        
      })
    setLoader(false)
}, [])




  /////////////// Ouverture du modal des codes budgetaires
  const handleClickOpenCategoriePaiement = (
    id = 0,
    code_categorie_paiement = '',
    lib_categorie_paiement = '', 
  ) => {
    setInit({
      id: id,
      code: code_categorie_paiement,
      libelle: lib_categorie_paiement,
    })

    setOpenCategoriePaiement(true)
  }

  const handleCloseCategoriePaiement = () => {
    setOpenCategoriePaiement(false)
  }

  ////////////// Droits de l'utilisateur
  var MachaineDeCrypte = CryptFunc(localStorage.getItem('_Drt'), 0)
  const leMenu = GroupBy(MachaineDeCrypte)
  const DroitsUser = leMenu.group['Eléments paiements'][4]

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
                handleClickOpenCategoriePaiement()
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
              donnees={listCategoriePaiement}
              onRowClick={(e) => {}}
              pagination
            />

          </Grid>{' '}
          <CategoriePaiementForm
            setListCategoriePaiement={setListCategoriePaiement}
            initial_={init}
            handleClose={handleCloseCategoriePaiement}
            open={openCategoriePaiement}
            titreModal={
              init.id == ''
                ? 'Nouvelle Categorie Paiement '
                : 'Modifier Categorie Paiement: ' + init.code
            }
            infoCookie={props.infoCookie}
          />

        </Grid>
      )}

      <ModalOuiNon
        open={opens_}
        onClose={handleCloseModal_}
        titre='Supprimer?'
        message={'Voulez vous Supprimer cet Categorie Paiement ?' }
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

export default CategoriePaiement
