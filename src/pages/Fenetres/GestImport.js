/** @format */
import React, { useEffect, useState } from 'react'
import PageHeader from '../../composants/PageHeader'
import TableauBasic from '../../composants/tableaux/TableauBasic'
import { Paper, Grid } from '@material-ui/core'
import Controls from '../../composants/controls/Controls'
import Constantes from '../../api/Constantes'
import BarreButtons from '../../composants/BarreButtons'
import Buttons from '../../composants/controls/Buttons'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import axios from '../../api/axios'
import { Notification } from '../../composants/controls/toast/MyToast'
import CreateIcon from '@material-ui/icons/Create'
import { Formik, Form, } from 'formik'
import * as yup from 'yup'
import SearchIcon from '@material-ui/icons/Search'
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep'
import ModalOuiNon from '../../composants/controls/modal/ModalOuiNon'
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

function GestImport(props) {

// valeurs initiales
// Lignes du tableau
const [listImportations, setListImportations] = useState([])

let today = new Date();
let today2 = new Date();
let dd = today.getDate();
 
let mm = today.getMonth()+1;

const yyyy = today.getFullYear();
if(dd<10) 
{
  dd=`0${dd}`;
} 
 
if(mm<10) 
{
   mm=`0${mm}`;
} 
today = `${yyyy}-${mm}-${dd}`;
today2 = `${yyyy}-${mm}-${dd - 1}`;

const [initial, setInitial] = useState({debut:today, fin:today })
const [loader, setLoader] = useState(false)

const [notify, setNotify] = useState({
    type: '',
    message: '',
})
 

const [openFlux, setOpenFlux] = useState(false)

 // valeurs initiales
const [openNotif, setOpenNotif] = useState(false)

const [opens_, setOpens_] = React.useState(false) // statut du modal suppression
const [idProf, setidProf] = React.useState('') // idprofil à editer ou supprimer?

const handleCloseModal_ = () => {
    setOpens_(false)
}


//Supression du profil
const effacerImportations = (values) => {
    axios({
       url: `/fichier/rejets.php?type=R&debut=${values.debut}&fin=${values.fin}`,
    })
      .then((response) => {
        if (response.data.reponse == 'success') {
         
          //////////////////
          setLoader(true)

          fetch(Constantes.URL + '/fichier/rejets.php?type=R&debut='+values.debut+'&fin='+values.fin)
          .then((response) => response.json())
          .then((data) => {
            setListImportations(data.infos)
          })
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
    
} 

//Match de la date

const matchDate = (values) => {
  
  axios({
     url: `/fichier/gestImportation.php?type=R&debut=${values.debut}&fin=${values.fin}`,
  })
    .then((response) => {
      if (response.data.reponse == 'success') {
       
        //////////////////
        setLoader(true)

        fetch(Constantes.URL + '/fichier/gestImportation.php?type=R&debut='+values.debut+'&fin='+values.fin)
        .then((response) => response.json())
        .then((data) => {
          setListImportations(data.infos)
        })
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
      width: 250,
      columnResizeIcon: true,
    },

    {
        field: 'CHEMIN_IMPORT',
        hide: true,
        editable: false,
        headerName: 'Chemin Import',
        width: 250,
        columnResizeIcon: true,
        // resizable: 'true',
    },
    {
      field: 'DATE_IMPORT',
      hide: false,
      editable: false,
      headerName: ' Date Import',
      width: 250,
      type: 'dateTime',
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: 'TOTAL_IMPORT',
      hide: false,
      editable: false,
      headerName: 'Total Import',
      width: 250,
      type: 'number',
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: 'TOTAL_REJET',
      hide: false,
      editable: false,
      headerName: 'Total Rejet',
      width: 250,
      type: 'number',
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: 'TOTAL_ECRITURE',
      hide: false,
      editable: false,
      headerName: 'Total Ecritures',
      width: 250,
      type: 'number',
      columnResizeIcon: true,
      // resizable: 'true',
    },
  
      {
        field: 'Actions',
        width: 250,
        align: 'center',
        renderCell: (e) => (
          <>
            <IconButton
              aria-label='update'
              size='small'
              >
            </IconButton>
            <CreateIcon
              fontSize='inherit'
              color='default'
              className='CreateIcon'
            />
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


      ////////////// Droits de l'utilisateur
  var MachaineDeCrypte = CryptFunc(localStorage.getItem('_Drt'), 0)
  const leMenu = GroupBy(MachaineDeCrypte)
  const DroitsUser = leMenu.group['Intégrations'][3]

  // fonction pas assez de droits
  const noRightFunc = () =>{
    setNotify({
      type: 'error',
      message: "Droits insuffisants",
    })
    setOpenNotif(true)
  }
  
  const schema = yup.object().shape({
    debut: yup.date('Date invalide').max(yup.ref('fin'),'Période invalide'),
    fin: yup.date('Date invalide').min(yup.ref('debut'),'Période invalide').max(new Date(),'Période invalide'),
  })
 
  // recuperation des rejets
  useEffect(() => {
    setLoader(true)
    fetch(Constantes.URL + '/fichier/gestImportation.php?type=R&debut='+initial.debut+'&fin='+initial.fin)
      .then((response) => response.json())
      .then((data) => {
        setListImportations(data.infos)
      })
    setLoader(false)
  },[])

  
  const classes = useStyles()

  return (
    <>
      <PageHeader icone={props.icone} titrePage={props.titre} />

      <BarreButtons
     
        buttons={
          <div style={{textAlign:"right"}}>
          <Formik
          noValidate
          initialValues={{
            debut: initial.debut,
            fin: initial.fin,
             
          }}
          validationSchema={schema}
          onSubmit={(values, onSubmitProps) => {
            setInitial({
              debut: values.debut,
              fin: values.fin,
            })
            matchDate(values)
          }}>
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            /* and other goodies */
          }) => (
            <Form>
           <Controls.TextInput
                margin='normal'
                id='debut'
                type='date'
                helperText={errors.debut}
                error={errors.debut && true}
               size="small"
                name='debut'
              /> 
           <Controls.TextInput
                margin='normal'
                id='fin'
                type='date'
                helperText={errors.fin}
                error={errors.fin && true}
                name='fin'
                style={{marginLeft: "5px"}}
              />
            <Buttons style={{marginTop:"16px"}}
              variant='contained'
              color='default'
              size='large'
              className={classes.button}
              startIcon={ <SearchIcon fontSize="large"/>}>
            </Buttons> 
           
        </Form>
          )}
        </Formik>
          </div>
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
              donnees={listImportations}
              onRowClick={(e) => {}}
              checkboxSelection={true}
              pagination 
            />
          </Grid>{' '}
        </Grid>
      )}
        <ModalOuiNon
        open={opens_}
        onClose={handleCloseModal_}
        titre='Supprimer?'
        message={'Voulez vous Supprimer cette importation ?' }
        non='Annuler'
        oui='Oui'
        deconnect={() => effacerImportations(idProf)}
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

export default GestImport
