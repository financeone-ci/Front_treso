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
import axios from '../../api/axios'
import { Notification } from '../../composants/controls/toast/MyToast'
import { Formik, Form, } from 'formik'
import * as yup from 'yup'
import SearchIcon from '@material-ui/icons/Search';



const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(0.5),
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
}))

function AuditsSystem(props) {
  // valeurs initiales
   // Lignes du tableau
   const [listSystem, setListSystem] = useState([])
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
   const [initial, setInitial] = useState({debut:today, fin:  today})
   const [loader, setLoader] = useState(false)
  const [notify, setNotify] = useState({
    type: '',
    message: '',
  })
 
  const [openNotif, setOpenNotif] = useState(false)



  //Supression du profil
  const matchDate = (values) => {
    axios({
       url: `/auditSys.php?type=R&debut=${values.debut}&fin=${values.fin}`,
    })
      .then((response) => {
        if (response.data.reponse == 'success') {
         
          //////////////////
          setLoader(true)

          fetch(Constantes.URL + '/auditSys.php?type=R&debut='+values.debut+'&fin='+values.fin)
          .then((response) => response.json())
          .then((data) => {
            setListSystem(data.infos)
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

 
  // Entetes du tableau
  const enteteCol = [
    {
      field: 'id',
      hide: true,
      editable: false,
      headerName: 'id',
      width: 10,
      columnResizeIcon: true,
    },
    {
      field: 'audit_sys_usernom',
      hide: false,
      editable: false,
      headerName: 'Nom complet',
      width: 300,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: 'audit_sys_ip',
      hide: false,
      editable: false,
      headerName: 'ip',
      width: 150,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: 'audit_sys_machine',
      hide: false,
      editable: false,
      headerName: 'Poste',
      width: 150,
      columnResizeIcon: true,
    },
    {
      field: 'audit_sys_action',
      hide: false,
      editable: false,
      headerName: 'Action',
      width: 100,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: 'audit_sys_issue',
      hide: false,
      editable: false,
      headerName: 'issue',
      width: 50,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: 'audit_sys_description',
      hide: false,
      editable: false,
      headerName: 'Description',
      width: 250,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    
    {
      field: 'audit_sys_nouvelleValeur',
      hide: false,
      editable: false,
      headerName: 'Valeur',
      width: 250,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: 'audit_sys_date',
      hide: false,
      editable: false,
      headerName: 'Date',
      width: 200,
      columnResizeIcon: true,
      // resizable: 'true',
    },
  
    
  ]
 
  
  const schema = yup.object().shape({
    debut: yup.date('Date invalide').max(yup.ref('fin'),'Période invalide'),
    fin: yup.date('Date invalide').min(yup.ref('debut'),'Période invalide').max(new Date(),'Période invalide'),
  })
 
  // recuperation des audits
  useEffect(() => {
    setLoader(true)
    fetch(Constantes.URL + '/auditSys.php?type=R&debut='+initial.debut+'&fin='+initial.fin)
      .then((response) => response.json())
      .then((data) => {
        setListSystem(data.infos)
      })
    setLoader(false)
  }, [])

  
 
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
            debut: initial.debut  ,
             fin: initial.fin,
             
          }}
          validationSchema={schema}
          onSubmit={(values, onSubmitProps) => {
            setInitial({
              debut: values.debut,
              fin: values.fin
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
              donnees={listSystem}
            
              pagination 
            />
          </Grid>{' '}
          
        </Grid>
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

export default AuditsSystem
