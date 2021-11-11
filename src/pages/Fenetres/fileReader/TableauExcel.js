import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import IconButton from '@material-ui/core/IconButton'
import PhotoCamera from '@material-ui/icons/PhotoCamera'
import Constantes from '../../../api/Constantes'
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import axios from '../../../api/axios'
import { Notification } from '../../../composants/controls/toast/MyToast'
import { makeStyles, withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import { useHistory } from 'react-router-dom'
import { Paper, Grid } from '@material-ui/core'
import Controls from '../../../composants/controls/Controls'
import CachedIcon from '@material-ui/icons/Cached';
import TableauBasic from '../../../composants/tableaux/TableauBasic';
import Stepper from '../../../composants/Stepper'
import NavigateNextIcon from '@material-ui/icons/NavigateNext';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
      height: 100,
    },
  },
}));

function TableauExcel(props) {
  const [items, setItems] = useState([]);//lignes du tableau
  const [listStructure, setlistStructure] = useState([]) // liste des structures d'importation
  const [defautStruc, setDefautStruc] = useState([]) // liste des structures d'importation
  const [struc, setStruc] = useState([{
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
    
  }]); // structure sélectionnée
   const classes = useStyles();
 const [newItem, setNewItem]= useState([{id: '',
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
    pos_retenue: '',}]) // données prêtes à être envoyées

    const [openNotif, setOpenNotif] = useState(false) // notification
    const [notify, setNotify] = useState({
        type: '',
        message: '',
      }) // contenu notification

      const [niveau, setNiveau] = useState(0) // état du traitement
      const [fichier, setFichier] = useState("") // fichier à importer
      const [resultats, setResultats] = useState({import: 0, rejet: 0, poucentageImport: 0, pourcentageRejet:0 }) // état du traitement
      const [loader, setLoader] = useState(false)

      //// Fonction analyse du fichier
  const readExcel = (file) => {
    setLoader(true)
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, { type: "buffer",   });

        const wsname = wb.SheetNames[0];
        
        const ws = wb.Sheets[wsname];
        
        //Récupération des colonnes concernées
      let tpos_echeance = ""
      try {
       tpos_echeance =  ws[struc[0].pos_echeance+"1"].w
     } catch (error) {}
     
      
      let tpos_date = ""
      try {
       tpos_date =  ws[struc[0].pos_date+"1"].w
     } catch (error) {}
     
      
      let tpos_benef = ""
     try {
      tpos_benef =  ws[struc[0].pos_benef +"1"].w 
    } catch (error) {}
    
     
      let tpos_budget =  "" 
     try {
       tpos_budget =  ws[struc[0].pos_budget +"1"].w 
     } catch (error) {}

    

      let tpos_marche =""
      try {
       tpos_marche =   ws[struc[0].pos_marche+"1"].w
     } catch (error) {}

     let tpos_montant = ""
     try {
      tpos_montant =   ws[struc[0].pos_montant+"1"].w
    } catch (error) {}

      let tpos_motif = ""
     try {
      tpos_motif =   ws[struc[0].pos_motif+"1"].w
    } catch (error) {}


      let tpos_num = ""
      try {
       tpos_num    =    ws[struc[0].pos_num+"1"].w
     } catch (error) {}
 
 
      let tpos_num_bon = ""
      try {
     tpos_num_bon     =    ws[struc[0].pos_num_bon+"1"].w
     } catch (error) {}
 
 
      let tref_benef = ""
      try {
      tref_benef   =    ws[struc[0].ref_benef+"1"].w
     } catch (error) {}
 
 


     let tretenue =  ""
     try {
     tretenue   =   ws[struc[0].retenue+"1"].w
    } catch (error) {}

     let tpos_taxe=  ""
     try {
     tpos_taxe   =   ws[struc[0].pos_taxe+"1"].w
    } catch (error) {}



        const data = XLSX.utils.sheet_to_json(ws);
      try {
    
          setNewItem(data.map((item, key) => {
            return { 
              id: key,
              pos_echeance: item[tpos_echeance] , 
              pos_benef: item[tpos_benef] ,
              pos_budget: item[tpos_budget] ,
              pos_date: item[tpos_date],
              pos_marche: item[tpos_marche] ,
              pos_montant: item[tpos_montant] ,
              pos_motif: item[tpos_motif] ,
              pos_num: item[tpos_num] ,
              pos_num_bon: item[tpos_num_bon] ,
              ref_benef: item[tref_benef] ,
              retenue: item[tretenue] ,
              pos_taxe: item[tpos_taxe] ,
            };
          }))
       
        } catch (error) {
          console.log(error)
        }
        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
        console.log(error)
      };
      setLoader(false)
    }
    
    
    );

    promise.then((data) => {
      setItems(data); 
    });
  };
  //choix Structure
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
    
    setStruc([
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
  var history = useHistory()
 const importFunc = (values) => {
 axios
 .post('fichier/importationEngagement.php?jeton=' +  props.infoCookie , values) //

 .then((response) => { 
   console.log(response)
  if(response.data.reponse == 'success'){
    setNewItem([{id: '',
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
    pos_retenue: '',}])
     setNotify({
    type: response.data.reponse,
    message: response.data.message + '\r' + 
   'Total: '+ response.data.infos.total  + '\n' + 
   'Imports: '+ response.data.infos.imports  + '\n' + 
   'rejets: '+ response.data.infos.rejets  
   ,
      })
      setResultats({import: response.data.infos.imports, rejet: response.data.infos.rejets , poucentageImport: response.data.infos.imports*100/response.data.infos.total, pourcentageRejet: response.data.infos.rejets  *100/response.data.infos.total })
      setStruc([{
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
      }])
      setNiveau(4)
  setOpenNotif(true)
  }
  else{
    setNotify({
      type: response.data.reponse,
      message: response.data.message 
     ,
    })
    setOpenNotif(true)
  }
  
  })
 }



 useEffect(() => {
  fetch(Constantes.URL + '/strucImport.php?type=R')
    .then((response) => response.json())
    .then((data) => setlistStructure(data.infos))
}, [])
  
  const columns = []
 
    newItem[0].pos_date  && columns.push({
      field: 'pos_date',
      headerName: 'Date',
      width: 150,
      editable: false,
      type: 'date' ,
      valueFormatter: (params) => {
        var date = new Date(Math.round((params.value - (25567 + 2)) * 86400 * 1000));
        var converted_date = date.toISOString().split('T')[0];
        return converted_date;
      },
    })  
    newItem[0].pos_benef  && columns.push({
      field: 'pos_benef',
      headerName: 'Bénéficiaire',
      minWidth: 250,
      editable: false,
       
    }) 
    newItem[0].pos_budget  && columns.push({
      field: 'pos_budget',
      headerName: 'Code Budget',
      width: 150,
      editable: false,
    }) 
    newItem[0].pos_echeance  && columns.push({
      field: 'pos_echeance',
      headerName: 'Date échéance',
      width: 150,
      editable: false,
      type: 'date' ,
      align: 'right',
      valueFormatter: (params) => {
        var date = new Date(Math.round((params.value - (25567 + 2)) * 86400 * 1000));
       // var converted_date = date.toISOString().split('T')[0];
        var converted_date = date.getDate() + '-'+(date.getMonth()+1) + '-' + date.getFullYear();
        return converted_date;
      },
     // valueParser: (value) => Number(value),
    }) 
    newItem[0].pos_marche  && columns.push({
      field: 'pos_marche',
      headerName: 'Marché',
      width: 200,
      editable: false,
    }) 
    newItem[0].pos_montant  && columns.push({
      field: 'pos_montant',
      headerName: 'Montant',
      width: 150,
      editable: false,
      type: 'number' ,
      valueFormatter: (params) => {
        const valueFormatted = Number(params.value).toLocaleString();
        return `${valueFormatted}`;
      },
      valueParser: (value) => Number(value),
    }) 
    newItem[0].pos_motif  && columns.push({
      field: 'pos_motif',
      headerName: 'Motif',
      width: 150,
      editable: false,
    }) 
    newItem[0].pos_num  && columns.push({
      field: 'pos_num',
      headerName: 'N° Engagement',
      width: 150,
      editable: false,
    }) 
    newItem[0].pos_num_bon  && columns.push({
      field: 'pos_num_bon',
      headerName: 'N° Bon de commande',
      width: 150,
      editable: false,
    }) 
    newItem[0].pos_ref_benef  && columns.push({
      field: 'pos_ref_benef',
      headerName: 'Ref. Bénéficiaire',
      width: 150,
      editable: false,
    }) 
    newItem[0].pos_retenue  && columns.push({
      field: 'pos_retenue',
      headerName: 'Retenue',
      width: 150,
      editable: false,
    }) 
    newItem[0].pos_taxe  && columns.push({
      field: 'pos_taxe',
      headerName: 'Taxe',
      width: 150,
      editable: false,
    }) 
    
     // REMPLIR LA COMBO structure
  useEffect(() => {
    if (struc[0].id != 0) {
     
      listStructure.map((item) => { 
        console.log(item)
        if (item.id == struc[0].id) {
          setDefautStruc(item)
        }
      })
    } else {
      setDefautStruc(null)
    }
  }, [niveau])
   
  return (
    <>  
    
      <Stepper
        niveau = {niveau}
        setNiveau = {setNiveau}
        etapes= {
          [
            'Choix strucuture',
            'Choix fichier',
            'Importer',
            'Terminé',
          ]
        }
        
        
        />
    <Grid container spacing={3}>
        <Grid item  xs={12} justifyContent="center">
          <Paper style={{
    marginLeft: 'auto',
    marginRight: 'auto',
    padding:12,
    textAlign: 'center',
  }} >
   
    {
      niveau == 0 ? /// Aucune structure choisie
      <>
    
    <Grid container spacing={1}>
        <Grid item xs={6} >
        
        
     <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={listStructure}
      getOptionLabel={(option) => option.description }
     defaultChecked={defautStruc}
      onChange={(e, value) => {
            handleClickOpenStrucImport(
              value.id,
              value.code,
              value.description,
              value.pos_taxe,
              value.pos_num,
              value.pos_benef,
              value.pos_ref_benef,
              value.pos_montant,
              value.pos_num_bon,
              value.pos_motif,
              value.pos_echeance,
              value.pos_budget,
              value.pos_date,
              value.pos_marche,
              value.pos_retenue,
            )
                        }}
      renderInput={(params) => <TextField {...params} label="Choisissez une Structure" />}
    />
     
    {console.log(struc[0])}            
    {console.log(defautStruc)}            
      </Grid>

      <Grid item xs={6} >
              
  <Button
        variant="contained"
        color="primary"
        style={{width:150}}
        endIcon={<NavigateNextIcon/>}
        disabled={!struc[0].id}
        onClick={()=>setNiveau(1)}
      >
        Suivant
      </Button>
        </Grid>
        </Grid>
      </>
      :
      
      <>
      <Button
        variant="contained"
        color="primary"
        style={{width:150}}
        endIcon={<CachedIcon/>}
        onClick={()=>{
          setNiveau(0)
        }
      }
      >
        Recommencer
      </Button>

    {struc[0].description && <h1>Structure: {struc[0].description } </h1>}
      <div>
        {
          niveau == 1 && 
          <>
          Choisir un fichier --
                      <label htmlFor='fileImport'>
                        <IconButton
                          color='primary'
                          aria-label='upload picture'
                          component='span'>
                          <PhotoCamera />
                        </IconButton>
                      </label>

                      
      <input
      style={{display:'none'}}
      id="fileImport"
        type="file"
        accept=".xlsx, .xls,"
        onChange={(e) => {
          const file = e.target.files[0];
          if(file.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ){
            readExcel(file);
            setFichier(file.name)
            setNiveau(2)
          }else{
            setNotify({
              type: "error",
              message: "Veuillez choisir un fichier au format Excel (xlsx)" 
             ,
            })
            setOpenNotif(true)
          }
          
        }}
      />
          </>
        }
        
     
<br/>
        { niveau == 2 && 
        <>
        <h2> {fichier} </h2>
{items[0] && 
<Button
        variant="contained"
        color="default"
        startIcon={<CloudUploadIcon />}
        onClick={()=> importFunc(newItem)}
      >
        Importer {newItem.length } ligne(s)
      </Button>
}
     
<br/>
<br/>
      {
        loader ? (
          <Paper elevation={0} className='paperLoad'>
            <Controls.SpinnerBase />
          </Paper>
        ) :
        <>
      
      <TableauBasic 
      rows={newItem}
        loading={newItem.length === 0}
        columns={columns}
        pageSize={50}
        disableSelectionOnClick
        
      pagination
      
      />
      </>
      }
     
        </>
        
        }

    </div>
    </>
    }
     {
       niveau == 4 && 
       <>
       <h1>Statistiques</h1>
     
     <h3> Importés: {resultats.import} </h3>
    <LinearProgress variant="buffer" value={resultats.poucentageImport} />
      <h3> Rejétés: {resultats.rejet} </h3>
    <LinearProgress variant="determinate" value={resultats.pourcentageRejet} color="secondary" />
    <br/>
    <button
        variant="contained"
        color="default"
        startIcon={<CloudUploadIcon />}
        onClick={()=>  history.push('/accueil/tresorerie/gestion-importations')}
      >
       Plus d'infos

    </button>
    </>
    }
    <Notification
        type={notify.type}
        message={notify.message}
        open={openNotif}
        setOpen={setOpenNotif}
      />

</Paper>
        </Grid>
        </Grid>
    </>
  );
}

export default TableauExcel;