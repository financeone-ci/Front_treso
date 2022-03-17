/** @format */

import React, { useState, useEffect, useCallback } from 'react'
import PageHeader from '../../../composants/PageHeader'
import TableData from '../../../composants/tableaux/TableData'
import { Paper, Grid, FormControlLabel, Checkbox } from '@material-ui/core'
import Controls from '../../../composants/controls/Controls'
import BarreButtons from '../../../composants/BarreButtons'
import Buttons from '../../../composants/controls/Buttons'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import CreateIcon from '@material-ui/icons/Create'
import IconButton from '@material-ui/core/IconButton'
import ModalOuiNon from '../../../composants/controls/modal/ModalOuiNon'
import axios from '../../../api/axios'
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep'
import AddIcon from '@material-ui/icons/Add'
import { Notification } from '../../../composants/controls/toast/MyToast'
import CryptFunc from '../../../functions/CryptFunc'
import GroupBy from '../../../functions/GroupBy'
import ReadCookie from '../../../functions/ReadCookie'
import { useMutation, useQuery, useQueryClient } from 'react-query'
// Style
const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(0.5),
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
}))

function VueDevises(props) {
  ////////////// Droits de l'utilisateur
  var MachaineDeCrypte = CryptFunc(localStorage.getItem('_Drt'), 0)
  const leMenu = GroupBy(MachaineDeCrypte)
  const DroitsUser = leMenu.group['Audits et sécurité'][1]
  // droits insuffisants
  const noRightFunc = () => {
    setNotify({
      type: 'error',
      message: 'Droits insuffisants',
    })
    setOpenNotif(true)
  }

  // Stats
  const [notify, setNotify] = useState({
    type: '',
    message: '',
  })
  const [openNotif, setOpenNotif] = useState(false)
  const [openOuiNon, setOpenOuiNon] = useState(false) // statut du modal suppression
  const [idSuppr, setIdSuppr] = useState([]) // id  à editer ou supprimer ?
 // const [idSuppr, setIdSuppr] = useState('') // id  à editer ou supprimer ?


  // Variables
  const Api = 'audits-systeme/ReadAudit.php'
  const Query = ['listeaudits']
  const cookieInfo = ReadCookie()

  
  const handleCloseModalOuiNon = () => {
    setOpenOuiNon(false)
  }

  

  // Modal Supression
  const FuncSuppr = (id) => {
    setOpenOuiNon(true)
    setIdSuppr(id)
  }

  // suppression d'une  devise
  const supprDevise = async (values) => {
    let response = ''
    const headers = {
      Authorization: cookieInfo,
    }
   
    console.log(`audits-systeme/DeleteAudit.php?id=${values}`)
    response = await axios.post(
      `audits-systeme/DeleteAudit.php?id=${values}`,
      { values },
      { headers },
    )
    handleCloseModalOuiNon()
    
    return response.data
  }

  // suppression d'une devise
  const supDevise = useMutation(supprDevise, {
    onSuccess: (data) => {
      queryClient.invalidateQueries('listeaudits')
      setNotify({
        type: data.reponse,
        message: data.message,
      })
      setOpenNotif(true)
    },
    onError: (error) => {
      console.error(error)
      props.setNotify({
        message: 'Service indisponible',
        type: 'error',
      })
      props.setOpenNotif(true)
    },
  })

  // Mise à jour de la liste des retraits après mutation
  const queryClient = useQueryClient()

  // Entetes du tableau
  const tableHeader = [
    {
      field: 'id',
      hide: true,
      editable: false,
      headerName: 'id',
      width: 10,
      columnResizeIcon: true,
    },
    {
      field: 'audit_sys_date',
      hide: false,
      editable: false,
      headerName: 'Date',
      width: 175,
      columnResizeIcon: true,
    },
    {
      field: 'audit_sys_usernom',
      hide: false,
      editable: false,
      headerName: 'User',
      width: 150,
      columnResizeIcon: true,
    },
    
    {
      field: 'audit_sys_description',
      hide: false,
      editable: false,
      headerName: 'Description',
      width: 250,
      columnResizeIcon: true,
    },
    {
      field: 'audit_sys_action',
      hide: false,
      editable: false,
      headerName: 'Description',
      width: 250,
      columnResizeIcon: true,
    },
    {
      field: 'audit_sys_ip',
      hide: false,
      editable: false,
      headerName: 'IP',
      width: 100,
      columnResizeIcon: true,
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
      field: 'audit_sys_userid',
      hide: true,
      editable: false,
      headerName: 'userid',
      width: 150,
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
        </>
      ),
    },
  ]

  // Classe de style
  const classes = new useStyles()

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
              disabled={idSuppr.length == 0}
              onClick={(e) => {
              DroitsUser.droits_supprimer == 1
                ?  FuncSuppr(idSuppr)
                : noRightFunc()
            }}
              className={classes.button}
              startIcon={<DeleteSweepIcon />}>
              Supprimer {idSuppr.length}
            </Buttons>
           
            
          </>
        }
      />
      <Grid container>
        <Grid item xs={12}>
          <TableData
            columns={tableHeader}
            useQuery={Query}
            api={Api}
            Authorization={ReadCookie()}
            checkboxSelection
            onSelectionModelChange ={(e)=>setIdSuppr(e)}
          />
        </Grid>
      </Grid>
      
      <ModalOuiNon
        open={openOuiNon}
        onClose={handleCloseModalOuiNon}
        titre='Supprimer?'
        message={'Voulez vous Supprimer ?'}
        non='Annuler'
        oui='Oui'
        deconnect={() => supDevise.mutate(idSuppr)}
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

export default VueDevises
