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
import FluxForm from './FluxForm'
import CreateIcon from '@material-ui/icons/Create'
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep'
import IconButton from '@material-ui/core/IconButton'
import ModalOuiNon from '../../composants/controls/modal/ModalOuiNon'
import { Notification } from '../../composants/controls/toast/MyToast'
import CryptFunc from '../../functions/CryptFunc'
import GroupBy from '../../functions/GroupBy'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import OfflinePinIcon from '@material-ui/icons/OfflinePin';
import CancelIcon from '@material-ui/icons/Cancel';


const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(0.5),
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
}))

function Flux(props) {
    // Lignes du tableau

  const [opens_, setOpens_] = useState(false)

  const handleCloseModal_ = () => {
    setOpens_(false)
  }

  const handleCloseFlux = () => {
    setOpenFlux(false)
  }
  // valeurs initiales
  const [openFlux, setOpenFlux] = useState(false)
  const [openNotif, setOpenNotif] = useState(false)
  const [idProf, setidProf] = React.useState('') // idprofil à editer ou supprimer?

  const [init, setInit] = useState({
    code: '',
    description: '',
    sens: '',
    inc_quota_flux: '',
    id: 0,
    id_categorie_flux: '',
    code_categorie_flux:'',
  })

  const [notify, setNotify] = useState({
    type: '',
    message: '',
  })

  ///// Chargement des engagements par période
  const fetchFlux = async () => {
    const response = await fetch(
      Constantes.URL +
        '/flux.php?type=R',
    )
    return response.json()
  }
  const { data, status } = useQuery('reqFlux', fetchFlux)
  

  // supprimer des engagements
  const queryClient = useQueryClient()

  const supprFlux = async (id_flux) => {
     
    const response = await fetch(
       Constantes.URL + `/flux.php?type=D&id=${id_flux}`,
    )
    return response.json()
  }
  
  const mutationDelete = useMutation(supprFlux, {
    onError: (data) => {
      setOpens_(false)
      setNotify({ message: data.message, type: data.reponse })
      setOpenNotif(true)
    },
    onSuccess: (data) => {
      setNotify({ message: data.message, type: data.reponse })
      queryClient.invalidateQueries('reqFlux')
      setOpens_(false)
      setOpenNotif(true)
    },
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
      field: 'CODE_FLUX',
      hide: false,
      editable: false,
      headerName: 'Code flux',
      width: 200,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: 'DESCRIPTION_FLUX',
      hide: false,
      editable: false,
      headerName: 'Description flux',
      width: 300,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: 'SENS_FLUX',
      hide: false,
      editable: false,
      headerName: 'Sens flux',
      width: 200,
      columnResizeIcon: true,
      align: 'center',
     
    },
    {
      field: 'INCR_QUOTA_FLUX',
      hide: false,
      editable: false,
      headerName: 'Quota',
      width: 200,
      columnResizeIcon: true,
      // resizable: 'true',
       ////////////////////////
   
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
      ////////////////////////
    },
    {
      field: 'CODE_CATEGORIE_FLUX',
      hide: false,
      editable: false,
      headerName: 'Categorie',
      width: 200,
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
              handleClickOpenFlux(
                e.row.id,
                e.row.CODE_FLUX,
                e.row.DESCRIPTION_FLUX,
                e.row.SENS_FLUX,
                e.row.INCR_QUOTA_FLUX,
                e.row.ID_CATEGORIE_FLUX,
                e.row.CODE_CATEGORIE_FLUX,
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

  // Ouverture modal flux

  const handleClickOpenFlux = (
    id = 0,
    code_flux = '',
    description_flux = '',
    sens_flux = '',
    inc_quota_flux = 0,
    id_categorie_flux = '',
    code_categorie_flux = '',
  ) => {
    setInit({
      id: id,
      code: code_flux,
      description: description_flux,
      sens: sens_flux,
      inc_quota_flux: inc_quota_flux,
      id_categorie_flux: id_categorie_flux,
      code_categorie_flux: code_categorie_flux,
    })

    setOpenFlux(true)
  }
  

  ////////////// Droits de l'utilisateur
  var MachaineDeCrypte = CryptFunc(localStorage.getItem('_Drt'), 0)
  const leMenu = GroupBy(MachaineDeCrypte)
  const DroitsUser = leMenu.group['Eléments paiements'][2]

  // fonction pas assez de droits
  const noRightFunc = () =>{
    setNotify({
      type: 'error',
      message: "Droits insuffisants",
    })
    
    setOpenNotif(true)
  }

   // Modal Supression du profil
   const FuncSuppr = (id) => {
    setOpens_(true)
    setidProf(id)
  }

  
  const classes = useStyles()


  return (  
    <>
      <PageHeader icone={props.icone} titrePage={props.titre} />

      <BarreButtons
        buttons={
          <div>
            <Buttons
              variant='contained'
              color='primary'
              size='small'
              onClick={() => {
                DroitsUser.droits_creer == 1 
                ?handleClickOpenFlux()
                : noRightFunc()
              }}
              className={classes.button}
              startIcon={<AddIcon />}>
              Créer
             </Buttons> 
          </div> 
              }
            />      
            
          {status === 'loading' ? (
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
                    donnees={data.infos}
                    onRowClick={(e) => {}}
                    onSelectionModelChange={(e) => {
                      setidProf(e)
                      }}
                    pagination
                  />
                  </Grid>
                </Grid>)
            } 
          { /* Modal pour la création ou la modification du flux */ }
          <Grid>
          <FluxForm
            queryClient={queryClient}
            initial_={init}
            handleClose={handleCloseFlux}
            open={openFlux}
            titreModal={
              init.id == ''
                ? 'Nouveau flux'
                : 'Modifier flux: ' + init.code
            }
            infoCookie={props.infoCookie}
          />
        </Grid>
         { /* Modal pour confirmer la suppression du flux */ }
        <ModalOuiNon
        open={opens_}
        onClose={handleCloseModal_}
        titreModal='Supprimer?'
        message={'Voulez vous Supprimer cet flux ?'}
        non='Annuler'
        oui='Oui'
        deconnect={() => mutationDelete.mutate(idProf)}
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

export default Flux
