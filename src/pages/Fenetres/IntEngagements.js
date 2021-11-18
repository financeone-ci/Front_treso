/** @format */

import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import PhotoCamera from '@material-ui/icons/PhotoCamera'
import { Formik, Form, Field, useField, ErrorMessage } from 'formik'
import * as yup from 'yup'
import Controls from '../../composants/controls/Controls'
import Typography from '@material-ui/core/Typography'
import Constantes from '../../api/Constantes'
import Buttons from '../../composants/controls/Buttons'
import AddIcon from '@material-ui/icons/Add'
import axios from '../../api/axios'
import { Notification } from '../../composants/controls/toast/MyToast'
import PageHeader from '../../composants/PageHeader'
import TableauExcel from './fileReader/TableauExcel'
import BarreButtons from '../../composants/BarreButtons'
import CryptFunc from '../../functions/CryptFunc'
import GroupBy from '../../functions/GroupBy'

const drawerWidth = 240

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  input: {
    // display: 'none',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 140,
  },
}))

function IntEngagements(props) {
  const [infosStructure, setInfosStructure] = useState([
    {
      code: '',
      description: '',
      id: '',
      pos_benef: '',
      pos_budget: '',
      pos_date: '',
      pos_echeance: '',
      pos_marche: '',
      pos_montant: '',
      pos_motif: '',
      pos_num: '',
      pos_num_bon: '',
      pos_ref_benef: '',
      pos_retenue: '',
    },
  ])
  const [avatarPreview, setAvatarPreview] = useState('')
  const [notify, setNotify] = useState({
    type: '',
    message: '',
  })
  const [openNotif, setOpenNotif] = useState(false)
  const [listStructure, setlistStructure] = useState([])
  const schema = yup.object().shape({
    /*
    fichier: yup.string().required('Veuillez choisir un fichier'),
    structure: yup.string().required('Champs obligatoire'),
   
    fichier:yup.array().min(1,"select at least 1 file") */
  })
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
      field: 'code',
      hide: false,
      editable: false,
      headerName: 'Code Structure',
      width: 100,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: 'description',
      hide: false,
      editable: false,
      headerName: 'Description',
      width: 100,
      columnResizeIcon: true,
    },
    {
      field: 'pos_taxe',
      hide: false,
      editable: false,
      headerName: 'Taxe',
      width: 100,
      columnResizeIcon: true,
    },
    {
      field: 'pos_num',
      hide: false,
      editable: false,
      headerName: 'N° Engagement',
      width: 100,
      columnResizeIcon: true,
    },
    {
      field: 'pos_benef',
      hide: false,
      editable: false,
      headerName: 'Bénéficiaire',
      width: 100,
      columnResizeIcon: true,
    },
    {
      field: 'pos_ref_benef',
      hide: false,
      editable: false,
      headerName: 'Référence Bénéf',
      width: 100,
      columnResizeIcon: true,
    },
    {
      field: 'pos_montant',
      hide: false,
      editable: false,
      headerName: 'Montant',
      width: 100,
      columnResizeIcon: true,
    },
    {
      field: 'pos_num_bon',
      hide: false,
      editable: false,
      headerName: 'N° bon commande',
      width: 100,
      columnResizeIcon: true,
    },
    {
      field: 'pos_motif',
      hide: false,
      editable: false,
      headerName: 'Motif',
      width: 100,
      columnResizeIcon: true,
    },
    {
      field: 'pos_echeance',
      hide: false,
      editable: false,
      headerName: 'Echéance',
      width: 100,
      columnResizeIcon: true,
    },
    {
      field: 'pos_budget',
      hide: false,
      editable: false,
      headerName: 'Budget',
      width: 100,
      columnResizeIcon: true,
    },

    {
      field: 'pos_date',
      hide: false,
      editable: false,
      headerName: 'Date',
      width: 100,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: 'pos_marche',
      hide: false,
      editable: false,
      headerName: 'Marché',
      width: 100,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: 'pos_retenue',
      hide: false,
      editable: false,
      headerName: 'Retenue',
      width: 100,
      columnResizeIcon: true,
      // resizable: 'true',
    },
  ]

  //Ouverture modal Structure
  const handleClickOpenStrucImport = (
    id = 0,
    code = '',
    description = '',
    pos_taxe = 0,
    pos_num = 0,
    pos_benef = 0,
    pos_ref_benef = 0,
    pos_montant = 0,
    pos_num_bon = 0,
    pos_motif = 0,
    pos_echeance = 0,
    pos_budget = 0,
    pos_date = 0,
    pos_marche = 0,
    pos_retenue = 0,
  ) => {
    setInfosStructure([
      {
        id: id,
        code: code,
        description: description,
        pos_taxe: pos_taxe,
        pos_num: pos_num,
        pos_benef: pos_benef,
        pos_ref_benef: pos_ref_benef,
        pos_montant: pos_montant,
        pos_num_bon: pos_num_bon,
        pos_motif: pos_motif,
        pos_echeance: pos_echeance,
        pos_budget: pos_budget,
        pos_date: pos_date,
        pos_marche: pos_marche,
        pos_retenue: pos_retenue,
      },
    ])
  }

  const onSubmitFileForm = (values, onSubmitProps) => {
    
    
  }

  const classes = useStyles()

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight)
  const [profileImg, setProfileImg] = useState()
  
 
  const   handleFileRead = async (event) => {
    const file = event.target.files[0]
    const base64 = await this.convertBase64(file)
    console.log(base64)
  }

    ////////////// Droits de l'utilisateur
  var MachaineDeCrypte = CryptFunc(localStorage.getItem('_Drt'), 0)
  const leMenu = GroupBy(MachaineDeCrypte)
  const DroitsUser = leMenu.group['Engagements '][0]

  // fonction pas assez de droits
  const noRightFunc = () => {
    setNotify({
      type: 'error',
      message: 'Droits insuffisants',
    })
    setOpenNotif(true)
  }



  useEffect(() => {
    fetch(Constantes.URL + '/strucImport.php?type=R')
      .then((response) => response.json())
      .then((data) => setlistStructure(data.infos))
  }, [])
  return (
    <>  
     <PageHeader icone={props.icone} titrePage={props.titre} />
    
<Grid container spacing={3}>
       
   


        {/* Chart */}
        
        {/* Recent Deposits */}
        
        {/* Recent Orders */}
        <Grid item xs={12} md={4} lg={3} style={{display:'none'}} >
          
        <Paper className={classes.paper}>
            <table>
              {enteteCol.map(
                (item) =>
                  item.headerName != 'id' &&
                  item.headerName != 'Code Structure' &&
                  item.headerName != 'Description' && (
                    <>
                      <tr style={{ color: 'grey' }}>
                        <td style={{ border: 'solid 1px blue', color: 'grey' }}>
                          {item.headerName}
                        </td>
                        <td style={{ border: 'solid 1px blue', color: 'grey' }}>
                          {infosStructure[0][item.field]} 
                        </td>
                      </tr>
                    </>
                  ),
              )}
            </table>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={12} lg={12}>
          
          <Paper className={classes.paper}>
          {
          DroitsUser.droits_creer == 1
            ?  <TableauExcel infosStructure={infosStructure} infoCookie={props.infoCookie}  />
            : noRightFunc()
        }
                    
          </Paper>
        </Grid>
      </Grid>
      <Notification
        type={notify.type}
        message={notify.message}
        open={openNotif}
        setOpen={setOpenNotif}
      />
    </>
  )
}

export default IntEngagements
