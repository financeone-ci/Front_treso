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
import CodeBudgetaireForm from './CodeBudgetaireForm'
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

function CodeBudgetaire(props) {

    // Lignes du tableau
    const [listCodeBudgetaire, setListCodeBudgetaire] = useState([])
    const [loader, setLoader] = useState(false)
    const [openCodeBudgetaire, setOpenCodeBudgetaire] = useState(false)

   // valeurs initiales
  const [openNotif, setOpenNotif] = useState(false)

  const [opens_, setOpens_] = React.useState(false) // statut du modal suppression
  const [idProf, setidProf] = React.useState('') // idprofil à editer ou supprimer?

  // Intialisation des champs
  const [init, setInit] = useState({
    code: '',
    libelle: '',
    id: 0,
    id_type_budgetaire: 0,
    code_budgetaire: '',
    
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
      url: `/codeBudget.php?type=D&id=${id}`,
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

          fetch(Constantes.URL + '/codeBudget.php?type=R&read_all')
            .then((response) => response.json())
            .then((data) => setListCodeBudgetaire(data.infos))
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
      field: 'CODE_CB',
      hide: false,
      editable: false,
      headerName: 'Code Budgetaire',
      width: 300,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: 'LIB_CB',
      hide: false,
      editable: false,
      headerName: 'Libelle Code Budgetaire',
      width: 300,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: 'CODE_TYPE_BUDGET',
      hide: false,
      editable: false,
      headerName: 'Type Code Budgetaire',
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
            onClick={() =>{
              
              DroitsUser.droits_modifier == 1 ?
              handleClickOpenCodeBudgetaire(
                e.row.id,
                e.row.CODE_CB,
                e.row.LIB_CB,
                e.row.ID_TYPE_BUDGET,
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
    fetch(Constantes.URL + '/codeBudget.php?type=R')
      .then((response) => response.json())
      .then((data) => {
        setListCodeBudgetaire(data.infos)
        
      })
    setLoader(false)
  }, [])




  /////////////// Ouverture du modal des codes budgetaires
  const handleClickOpenCodeBudgetaire = (
    id = 0,
    code_cb = '',
    lib_cb = '',
    id_type_budget =0,
    code_type_budget = '',
  ) => {
    setInit({
      id: id,
      code: code_cb,
      libelle: lib_cb,
      id_type_budgetaire: id_type_budget,  
      code_budgetaire: code_type_budget,
    })

    setOpenCodeBudgetaire(true)
  }

  const handleCloseCodeBudgetaire = () => {
    setOpenCodeBudgetaire(false)
  }

  ////////////// Droits de l'utilisateur
  var MachaineDeCrypte = CryptFunc(localStorage.getItem('_Drt'), 0)
  const leMenu = GroupBy(MachaineDeCrypte)
  const DroitsUser = leMenu.group['Eléments paiements'][3]

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
                handleClickOpenCodeBudgetaire()
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
              donnees={listCodeBudgetaire}
              onRowClick={(e) => {}}
              pagination
            />

          </Grid>{' '}
          <CodeBudgetaireForm
            setListCodeBudgetaire={setListCodeBudgetaire}
            initial_={init}
            handleClose={handleCloseCodeBudgetaire}
            open={openCodeBudgetaire}
            titreModal={
              init.id == ''
                ? 'Nouveau Code Budgetaire'
                : 'Modifier Code Budgetaire: ' + init.code
            }
            infoCookie={props.infoCookie}
          />

        </Grid>
      )}

      <ModalOuiNon
        open={opens_}
        onClose={handleCloseModal_}
        titre='Supprimer?'
        message={'Voulez vous Supprimer ce Code Budgetaire ?' }
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

export default CodeBudgetaire
